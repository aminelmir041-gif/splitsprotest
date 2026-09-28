from pathlib import Path
import base64

parts_dir = Path("scripts/hero_dog_parts")
encoded = "".join((parts_dir / f"part{i}.txt").read_text().strip() for i in range(6))
data = base64.b64decode(encoded)

if not data.startswith(b"RIFF") or data[8:12] != b"WEBP":
    raise SystemExit("invalid hero webp")

out = Path("public/landing/overheated-bulldog-hero.webp")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(data)
print(f"wrote {out} ({len(data)} bytes)")
