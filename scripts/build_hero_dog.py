from pathlib import Path
from collections import deque
import base64

# Rebuild the approved local-offer hero artwork.
parts_dir = Path("scripts/hero_dog_parts")
encoded = "".join((parts_dir / f"part{i}.txt").read_text().strip() for i in range(6))
data = base64.b64decode(encoded)

if not data.startswith(b"RIFF") or data[8:12] != b"WEBP":
    raise SystemExit("invalid hero webp")

hero_out = Path("public/landing/overheated-bulldog-hero.webp")
hero_out.parent.mkdir(parents=True, exist_ok=True)
hero_out.write_bytes(data)
print(f"wrote {hero_out} ({len(data)} bytes)")

# Remove only the black background connected to the outside edges of the
# social-proof dog artwork. Internal dark detail on the dog/text stays intact.
from PIL import Image

dog_src = Path("public/landing/rinnai-google-dog.webp")
dog_out = Path("public/landing/rinnai-google-dog-transparent.webp")

if dog_src.exists():
    image = Image.open(dog_src).convert("RGBA")
    width, height = image.size
    px = image.load()
    seen = bytearray(width * height)
    queue = deque()

    def dark(x, y):
        r, g, b, _ = px[x, y]
        return (r + g + b) < 120

    def add(x, y):
        idx = y * width + x
        if not seen[idx] and dark(x, y):
            seen[idx] = 1
            queue.append((x, y))

    for x in range(width):
        add(x, 0)
        add(x, height - 1)
    for y in range(height):
        add(0, y)
        add(width - 1, y)

    while queue:
        x, y = queue.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        if x > 0:
            add(x - 1, y)
        if x + 1 < width:
            add(x + 1, y)
        if y > 0:
            add(x, y - 1)
        if y + 1 < height:
            add(x, y + 1)

    image.save(dog_out, "WEBP", lossless=True, quality=92, method=6)
    print(f"wrote {dog_out} ({dog_out.stat().st_size} bytes)")
else:
    print(f"warning: {dog_src} not found")
