from pathlib import Path
import re

p = Path('split-system-cleaning-offer/index.html')
text = p.read_text(encoding='utf-8')

css = '''
    .vsl-card{position:relative;margin:0 0 22px;border:0;border-radius:16px;overflow:hidden;background:transparent;box-shadow:none;isolation:auto;aspect-ratio:16/9;transition:opacity .45s ease,transform .45s ease}
    .vsl-card:before{content:"WATCH THE 35-SECOND CLEANING DIFFERENCE";position:absolute;left:14px;top:12px;z-index:3;background:rgba(11,11,11,.28);border:1px solid rgba(200,164,106,.45);color:var(--gold2);padding:7px 10px;border-radius:999px;font-size:8px;font-weight:900;letter-spacing:.14em;pointer-events:none}
    .vsl-card.finished{opacity:0;transform:scale(.985);pointer-events:none}
    .vsl-embed{display:block;width:100%;height:100%;border:0;background:transparent;border-radius:14px;box-shadow:none}
    @media(max-width:640px){.vsl-card{margin-bottom:18px;border-radius:12px}.vsl-card:before{left:10px;top:10px;font-size:7px}.vsl-embed{border-radius:10px}}
'''

video = '''          <div class="vsl-card" id="cleaningVslCard">
            <iframe class="vsl-embed" id="cleaningVsl" loading="eager"
              src="https://www.canva.com/design/DAHVXLREICQ/view?embed&autoplay=1&muted=0&loop=0"
              title="SplitsPro 35-second split system cleaning video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen></iframe>
          </div>
'''

js = '''
  <script id="cleaning-vsl-behaviour">
    (()=>{
      const card=document.getElementById('cleaningVslCard');
      const frame=document.getElementById('cleaningVsl');
      if(!card||!frame)return;

      let hideTimer;
      const hideAfterPlayback=()=>{
        clearTimeout(hideTimer);
        hideTimer=setTimeout(()=>{
          card.classList.add('finished');
          setTimeout(()=>{ card.style.display='none'; },460);
        },35500);
      };

      // Start the countdown once the Canva player itself has loaded.
      frame.addEventListener('load',hideAfterPlayback,{once:true});
      // Fallback in case the browser restores the iframe from cache without firing load.
      setTimeout(()=>{ if(card.style.display!=='none' && !card.classList.contains('finished')) hideAfterPlayback(); },2500);
    })();
  </script>
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

js_pattern = re.compile(r'\s*<script id="cleaning-vsl-behaviour">.*?</script>', re.S)
if js_pattern.search(text):
    text = js_pattern.sub('\n' + js.strip(), text, count=1)
else:
    text = text.replace('</body>', js + '</body>', 1)

p.write_text(text, encoding='utf-8')
