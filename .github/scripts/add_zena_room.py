from pathlib import Path

parts = []
for i in range(1, 5):
    parts.append(Path(f'.github/assets/zena-room-part{i}.txt').read_text(encoding='utf-8').strip())
base64_data = ''.join(parts)
out = Path('src/lib/embedded/zenaRoom.js')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(f'const zenaRoom = "data:image/webp;base64,{base64_data}";\nexport default zenaRoom;\n', encoding='utf-8')

p = Path('src/lib/data.js')
text = p.read_text(encoding='utf-8')
import_line = 'import zenaStreamerUserImage from "./embedded/zenaStreamer";\n'
room_import = 'import zenaRoomUserImage from "./embedded/zenaRoom";\n'
if room_import not in text:
    if import_line not in text:
        raise SystemExit('Could not find Zena Streamer import')
    text = text.replace(import_line, import_line + room_import, 1)
old = '{ src: IMAGES.splitBedroom, alt: "Daikin Zena installed in a room" },'
new = '{ src: zenaRoomUserImage, alt: "Daikin Zena Black Wood installed in a modern room" },'
if old in text:
    text = text.replace(old, new, 1)
elif new not in text:
    raise SystemExit('Could not find Zena room gallery item')
p.write_text(text, encoding='utf-8')
print('Zena lifestyle image integrated')
