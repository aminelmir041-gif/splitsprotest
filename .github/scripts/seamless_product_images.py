from pathlib import Path

# Use the exact two Zena product photos uploaded by the user.
p = Path('src/lib/data.js')
text = p.read_text(encoding='utf-8')
text = text.replace('import zenaBlackUserImage from "./embedded/zenaBlack";\n', '')
text = text.replace('import zenaStreamerUserImage from "./embedded/zenaStreamer";\n', '')
text = text.replace('import zenaRoomUserImage from "./embedded/zenaRoom";\n', '')
text = text.replace('        image: zenaBlackUserImage,\n', '        image: `${PUBLIC}/products/zena-black-uploaded.webp`,\n')
text = text.replace('          { src: zenaBlackUserImage, alt: "Daikin Zena Black Wood indoor unit" },\n', '          { src: `${PUBLIC}/products/zena-black-uploaded.webp`, alt: "Daikin Zena Black Wood indoor unit" },\n')
text = text.replace('          { src: zenaStreamerUserImage, alt: "Daikin Zena White Hair Line with Streamer" },\n', '          { src: `${PUBLIC}/products/zena-white-uploaded.webp`, alt: "Daikin Zena White Hair Line with Streamer" },\n')
text = text.replace('          { src: zenaRoomUserImage, alt: "Daikin Zena Black Wood installed in a modern room" },\n', '')
p.write_text(text, encoding='utf-8')

print('Zena now points to the exact uploaded white and Black Wood image files')
