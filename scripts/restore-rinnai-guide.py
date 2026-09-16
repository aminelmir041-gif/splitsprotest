from pathlib import Path
import base64
import hashlib

ROOT = Path(__file__).resolve().parents[1]
PARTS = [
    ROOT / ".github/assets/rinnai-guide-part01.txt",
    ROOT / ".github/assets/rinnai-guide-part02.txt",
    ROOT / ".github/assets/rinnai-guide-part03.txt",
    ROOT / ".github/assets/rinnai-guide-part04a.txt",
    ROOT / ".github/assets/rinnai-guide-part04.txt",
    ROOT / ".github/assets/rinnai-guide-part05.txt",
    ROOT / ".github/assets/rinnai-guide-part06.txt",
]

encoded = "".join(path.read_text().strip() for path in PARTS)
data = base64.b64decode(encoded, validate=True)

EXPECTED_SIZE = 69290
EXPECTED_SHA256 = "299a2459629ee19386d9d451acab571c9242fc37619d6592becd6feee9c8f73f"

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
