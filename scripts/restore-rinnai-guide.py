from pathlib import Path
import base64
import hashlib

ROOT = Path(__file__).resolve().parents[1]
PARTS = [
    ROOT / ".github/assets/rinnai-guide-v2-part01.txt",
    ROOT / ".github/assets/rinnai-guide-v2-part02.txt",
    ROOT / ".github/assets/rinnai-guide-v2-part03.txt",
    ROOT / ".github/assets/rinnai-guide-v2-part04.txt",
]

encoded = "".join(path.read_text().strip() for path in PARTS)
data = base64.b64decode(encoded, validate=True)

EXPECTED_SIZE = 35106
EXPECTED_SHA256 = "6c7047748bbf87c714c6695cd42be44b57b5ab21a25d61a44c8aa11012a076fd"

if len(data) != EXPECTED_SIZE:
    raise SystemExit(f"Unexpected guide image size: {len(data)} bytes")
if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
    raise SystemExit("Restored guide is not a valid WebP container")
actual_hash = hashlib.sha256(data).hexdigest()
if actual_hash != EXPECTED_SHA256:
    raise SystemExit(f"Guide checksum mismatch: {actual_hash}")

out = ROOT / "public/installs/rinnai-back-to-back-guide.webp"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(data)
print(f"Restored approved Rinnai guide: {out} ({len(data)} bytes)")

# Keep the Daikin Lite local-offer card visually consistent with the Daikin Cora
# section by reusing the same Cora product image on the local-offer page.
brand_page = ROOT / "src/pages/BrandPage.jsx"
page_text = brand_page.read_text()
old_image = 'image: SPLIT_BRANDS.find((b) => b.slug === "daikin")?.image,'
new_image = 'image: SPLIT_BRANDS.find((b) => b.slug === "daikin")?.ranges?.find((r) => r.slug === "cora")?.image,'
if old_image in page_text:
    page_text = page_text.replace(old_image, new_image, 1)
elif new_image not in page_text:
    raise SystemExit("Could not locate the Daikin Lite local-offer image reference")
brand_page.write_text(page_text)
print("Daikin Lite local offer now uses the same product image as Daikin Cora")
