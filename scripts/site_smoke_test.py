#!/usr/bin/env python3
"""Fail a SplitsPro publish before commit if key routes/assets are broken."""

from pathlib import Path
from urllib.parse import urlsplit
import json
import re
import subprocess

ROOT = Path(".")

REACT_ROUTES = (
    "about",
    "split-systems",
    "split-systems/daikin",
    "split-systems/rinnai",
    "split-systems/rinnai-local-offer",
    "book-installation",
    "secure-installation",
    "payment-options",
    "split-system-installation-sydney",
    "daikin-zena-special",
    "split-systems/mitsubishi",
    "split-systems/mitsubishi-electric",
    "split-systems/mitsubishi-heavy-industries",
    "split-systems/fujitsu",
    "split-systems/samsung",
    "split-systems/oran-park",
    "split-systems/willoughby-north-sydney",
    "split-systems/central-coast-newcastle",
    "split-systems/wollongong",
    "split-systems/quakers-hill-austral-richmond",
    "ducted",
    "cleaning",
    "split-system-cleaning",
    "secure-cleaning",
    "ducted-cleaning",
    "repairs",
    "servicing",
    "gallery",
    "reviews",
    "service-areas",
    "faq",
    "contact",
)

LOADER_ROUTES = {"book-installation", "secure-installation"}
STATIC_PAGES = (
    Path("index.html"),
    Path("aircon-installation-guide/index.html"),
    Path("aircon-quote-guide/index.html"),
    Path("split-system-cleaning-offer/index.html"),
)


def fail(message: str) -> None:
    raise SystemExit(f"SMOKE TEST FAILED: {message}")


def resolve_local_ref(page: Path, raw: str) -> Path | None:
    if not raw or raw.startswith(("#", "tel:", "mailto:", "javascript:", "data:")):
        return None
    parts = urlsplit(raw)
    if parts.scheme or parts.netloc:
        return None
    target = parts.path
    if not target:
        return None
    if target.startswith("/"):
        resolved = ROOT / target.lstrip("/")
    else:
        resolved = page.parent / target
    if target.endswith("/") or resolved.is_dir():
        resolved = resolved / "index.html"
    return resolved


def check_static_refs(page: Path) -> None:
    if not page.exists():
        fail(f"missing static page {page}")
    html = page.read_text(encoding="utf-8")
    refs = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', html, flags=re.I)
    for raw in refs:
        resolved = resolve_local_ref(page, raw)
        if resolved is not None and not resolved.exists():
            fail(f"{page} references missing local file {raw} -> {resolved}")


def main() -> None:
    manifest_path = ROOT / "asset-manifest.json"
    if not manifest_path.exists():
        fail("asset-manifest.json is missing")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    files = manifest.get("files") or {}
    main_js = files.get("main.js")
    main_css = files.get("main.css")
    if not main_js or not main_css:
        fail("asset manifest is missing main.js or main.css")

    for asset in (main_js, main_css):
        if not (ROOT / asset.lstrip("/")).exists():
            fail(f"manifest points to missing asset {asset}")

    for route in REACT_ROUTES:
        page = ROOT / route / "index.html"
        if not page.exists():
            fail(f"missing generated route /{route}")
        html = page.read_text(encoding="utf-8")
        if '<div id="root"></div>' not in html:
            fail(f"/{route} is missing the React root")
        if route in LOADER_ROUTES:
            if "data-splitspro-bundle-loader" not in html:
                fail(f"/{route} is missing the stale-bundle protection loader")
            if main_js not in html or main_css not in html:
                fail(f"/{route} fallback bundle does not match the current manifest")
        else:
            if main_js not in html or main_css not in html:
                fail(f"/{route} does not reference the current React bundle")

    # Regression guard: customers must be able to choose the unit and live
    # installation date ON the local-deals page, without a hidden initial click.
    brand_source = (ROOT / "src/pages/BrandPage.jsx").read_text(encoding="utf-8")
    booking_source = (ROOT / "src/components/InlineDealsBooking.jsx").read_text(encoding="utf-8")
    if (
        brand_source.count("<InlineDealsBooking") != 1
        or "selectedUnit={selected?.productKey ? selected : null}" not in brand_source
        or "onChooseUnit={handleBook}" not in brand_source
        or 'id="local-deal-booking"' not in brand_source
    ):
        fail("local deals must always mount the inline unit/date booking component")
    for required in (
        'data-testid="local-deal-unit-select"',
        'data-testid="local-deal-inline-booking"',
        "getBookingSlots(12)",
        "Choose your installation date",
        "onChange={(event) => chooseUnitFromList(event.target.value)}",
    ):
        if required not in booking_source:
            fail(f"local deals unit/date selector missing {required}")
    compiled_js = (ROOT / main_js.lstrip("/")).read_text(encoding="utf-8")
    if "local-deal-unit-select" not in compiled_js or "local-deal-inline-booking" not in compiled_js:
        fail("published React bundle missing the local-deals unit/date selector")

    deals = ROOT / "deals/index.html"
    if not deals.exists() or "rinnai-local-offer" not in deals.read_text(encoding="utf-8"):
        fail("/deals redirect is missing or points to the wrong destination")

    for page in STATIC_PAGES:
        check_static_refs(page)

    home = (ROOT / "index.html").read_text(encoding="utf-8")
    if home.count("async function sendEnquiry(e)") != 1:
        fail("homepage enquiry handler is missing or duplicated")

    # A syntax error in an inline script can break the homepage hamburger,
    # FAQ toggles and quote forms. Compile scripts before publishing.
    inline_scripts = re.findall(
        r'<script[^>]*>(.*?)</script>',
        home,
        flags=re.I | re.S,
    )
    if not inline_scripts:
        fail("homepage inline JavaScript is missing")
    for index, script in enumerate(inline_scripts, 1):
        check = subprocess.run(
            ["node", "--check"],
            input=script,
            text=True,
            capture_output=True,
            timeout=15,
            check=False,
        )
        if check.returncode:
            fail(f"homepage inline script {index} contains invalid JavaScript: {check.stderr[:600]}")

    nav_test = subprocess.run(
        ["node", "scripts/test_home_menu.cjs"],
        text=True,
        capture_output=True,
        timeout=15,
        check=False,
    )
    if nav_test.returncode:
        fail(f"homepage menu interaction test failed: {nav_test.stderr[:600]}")

    # The old offer URL is deliberately a redirect to the SINGLE canonical
    # React cleaning page. The booking form now lives there, not on the old page.
    cleaning = (ROOT / "split-system-cleaning-offer/index.html").read_text(encoding="utf-8")
    is_cleaning_redirect = (
        'href="https://splitspro.com.au/split-system-cleaning/"' in cleaning
        and 'window.location.replace("../split-system-cleaning/"' in cleaning
    )
    if not is_cleaning_redirect:
        fail("old cleaning-offer URL must redirect to the main split-system-cleaning page")
    cleaning_page = (ROOT / "src/pages/SplitSystemCleaning.jsx").read_text(encoding="utf-8")
    if not all(token in cleaning_page for token in (
        "CLEANING_QUANTITIES", "firstPrice + Math.max(0, count - 1) * 150",
        "getCleaningSlots", 'data-testid="cleaning-unit-count"',
        "Continue to details & payment options", 'data-testid="cleaning-booking-200-default"',
    )):
        fail("cleaning page must show the current server-verified first-system offer, $150 extras, $200 booking and live times")
    # Preserve the full approved sales story with booking and calendar near the bottom.
    # Visitors wanting to skip the copy can go straight there from Book Now in the hero.
    landing_sequence = (
        'data-testid="cleaning-hero-book-now-mobile"',
        'data-testid="cleaning-guardian-story"',
        'data-testid="cleaning-benchtop-airflow-punchline"',
        "splitspro-cleaning-baby-approved.png",
        'data-testid="cleaning-solution"',
        'data-testid="cleaning-trust"',
        'data-testid="cleaning-prices"',
        'data-testid="cleaning-offer-details"',
        'data-testid="cleaning-booking"',
        'data-testid="cleaning-faq"',
    )
    positions = [cleaning_page.find(part) for part in landing_sequence]
    if any(position < 0 for position in positions) or positions != sorted(positions):
        fail("cleaning sales story, offer and booking must remain in the approved order")
    if 'data-testid="cleaning-black-friday-countdown"' not in cleaning_page or "PRICE RISES $20 EVERY THURSDAY" not in cleaning_page:
        fail("Black Friday countdown sale and weekly increases must be prominently visible")
    if 'data-testid="cleaning-hero-book-now-desktop"' not in cleaning_page:
        fail("desktop cleaning hero must include a Book Now shortcut")
    if 'const scrollOffer = () => document.getElementById("cleaning-prices")?.scrollIntoView' not in cleaning_page:
        fail("cleaning hero must jump to the existing offer section")
    if cleaning_page.count("onClick={scrollOffer}") != 2 or cleaning_page.count("See Our Offer") != 2:
        fail("mobile and desktop hero buttons must show the offer shortcut")
    secure_page = (ROOT / "src/pages/CleaningCheckout.jsx").read_text(encoding="utf-8")
    if not all(token in secure_page for token in (
        '"/cleaning-checkout"', '"/cleaning-payment-status"',
        'getCleaningCheckoutConfig', 'start_time: time', 'quantity: count',
        'api.post("/cleaning-checkout"', "PAY {money(dueNow)} TO", 'data-testid="cleaning-payment-choice"', 'useState("booking")',
    )):
        fail("cleaning checkout must present default $200 booking, optional full pay and server-verifiable amounts")
    # Full checkout uses the booking server's one atomic availability-and-hold
    # request; no redundant calendar call that might reject later valid dates.
    if 'api.get("/cleaning-slots"' in secure_page:
        fail("cleaning checkout must not fetch the entire calendar before the atomic checkout request")
    if "cleaning-mobile-payment-summary" not in secure_page:
        fail("mobile checkout must show date and price above customer details")
    if "payment_choice: paymentChoice" not in secure_page or "Number(response.data.amount_due_now) !== dueNow" not in secure_page:
        fail("cleaning payment amount and mode must be validated against server checkout response")
    for field in ('name', 'address', 'phone', 'email'):
        if field not in secure_page:
            fail(f"cleaning checkout missing customer field {field}")

    # SplitsPro standing sales rule: surface payment flexibility BEFORE booking,
    # customer-detail forms and payment buttons, not only at the last checkout step.
    pay_later_positions = (
        ("src/pages/SplitSystemCleaning.jsx",
         "cleaning-before-booking-cta-pay-later-reminder",
         '<button type="button" onClick={() => choose(1)}'),
        ("src/pages/SplitSystemCleaning.jsx",
         "cleaning-booking-pay-later-reminder",
         'cleaning-unit-quantity'),
        ("src/pages/CleaningCheckout.jsx",
         "cleaning-checkout-before-payment-reminder",
         'PAY {money(dueNow)} TO'),
        ("src/pages/CleaningCheckout.jsx",
         "cleaning-before-customer-form-pay-later-reminder",
         '<form onSubmit={pay}'),
        ("src/pages/InstallationBooking.jsx",
         "installation-booking-pay-later-reminder",
         'Quick standard-install check'),
        ("src/pages/InstallationDepositCheckout.jsx",
         "installation-deposit-pay-later-reminder",
         '<QuoteForm'),
        ("src/pages/PaymentOptions.jsx",
         "finance-before-customer-form-pay-later-reminder",
         '<form onSubmit={handleCheckout}'),
    )
    for source_path, reminder, next_action in pay_later_positions:
        source = (ROOT / source_path).read_text(encoding="utf-8")
        reminder_at = source.find(reminder)
        action_at = source.find(next_action)
        if reminder_at < 0 or action_at < 0 or reminder_at >= action_at:
            fail(f"{source_path}: pay-later reminder must come before {next_action}")

    # Never ship placeholder navigation/social links that only jump to the top.
    for source in list((ROOT / "src/pages").glob("*.jsx")) + list((ROOT / "src/components").glob("*.jsx")):
        source_text = source.read_text(encoding="utf-8")
        if 'href="#"' in source_text or 'to="#"' in source_text:
            fail(f"{source} contains a dead # link")

    print(
        f"Smoke test passed: {len(REACT_ROUTES)} React routes, "
        f"{len(STATIC_PAGES)} static pages, current assets {main_js} / {main_css}"
    )


if __name__ == "__main__":
    main()
