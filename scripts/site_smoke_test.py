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
    if "CLEANING_OFFERS" not in cleaning_page or '"$220"' not in cleaning_page or '"$300"' not in cleaning_page:
        fail("split system cleaning packages are not configured as $220 / 2 for $300")
    if '<QuoteForm' not in cleaning_page:
        fail("single cleaning landing page is missing its booking request form")

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
