from pathlib import Path
import re

p = Path('split-system-cleaning-offer/index.html')
text = p.read_text(encoding='utf-8')

css = '''
    .vsl-card{position:relative;margin:0 0 22px;border:0;border-radius:16px;overflow:hidden;background:transparent;box-shadow:none;isolation:auto;aspect-ratio:16/9}
    .vsl-card:before{content:"WATCH THE 35-SECOND CLEANING DIFFERENCE";position:absolute;left:14px;top:12px;z-index:3;background:rgba(11,11,11,.28);border:1px solid rgba(200,164,106,.45);color:var(--gold2);padding:7px 10px;border-radius:999px;font-size:8px;font-weight:900;letter-spacing:.14em;pointer-events:none}
    .vsl-embed{display:block;width:100%;height:100%;border:0;background:transparent;border-radius:14px;box-shadow:none}
    @media(max-width:640px){.vsl-card{margin-bottom:18px;border-radius:12px}.vsl-card:before{left:10px;top:10px;font-size:7px}.vsl-embed{border-radius:10px}}
'''

video = '''          <div class="vsl-card" id="cleaningVslCard">
            <iframe class="vsl-embed" id="cleaningVsl" loading="eager"
              src="https://www.canva.com/design/DAHVXLREICQ/view?embed&autoplay=1"
              title="SplitsPro 35-second split system cleaning video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen></iframe>
          </div>
'''

css_pattern = re.compile(r'\n\s*\.vsl-card\{.*?@media\(max-width:640px\)\{\.vsl-card\{.*?\}\}\n', re.S)
if css_pattern.search(text):
    text = css_pattern.sub('\n' + css, text, count=1)
elif '.vsl-card{' not in text:
    text = text.replace('  </style>', css + '  </style>', 1)

video_pattern = re.compile(r'\s*<div class="vsl-card" id="cleaningVslCard">.*?</div>', re.S)
if video_pattern.search(text):
    text = video_pattern.sub('\n' + video.rstrip(), text, count=1)
else:
    needle = '        <div class="hero-offers">\n'
    if needle not in text:
        raise SystemExit('hero-offers marker not found')
    text = text.replace(needle, needle + video, 1)

# The old native-video playback script is no longer needed with the Canva embed.
text = re.sub(r'\s*<script id="cleaning-vsl-behaviour">.*?</script>', '', text, count=1, flags=re.S)

p.write_text(text, encoding='utf-8')
