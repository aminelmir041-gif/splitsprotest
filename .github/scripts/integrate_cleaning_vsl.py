from pathlib import Path
import re

p = Path('split-system-cleaning-offer/index.html')
text = p.read_text(encoding='utf-8')

css = '''
    .vsl-card{position:relative;margin:0 0 22px;border:0;border-radius:16px;overflow:visible;background:transparent;box-shadow:none;isolation:auto}
    .vsl-card:before{content:"WATCH THE 35-SECOND CLEANING DIFFERENCE";position:absolute;left:14px;top:12px;z-index:3;background:rgba(11,11,11,.22);border:1px solid rgba(200,164,106,.45);color:var(--gold2);padding:7px 10px;border-radius:999px;font-size:8px;font-weight:900;letter-spacing:.14em;pointer-events:none}
    .vsl-video{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:transparent;border:0;border-radius:14px;box-shadow:none;opacity:.92}
    .vsl-sound{display:none;position:absolute;z-index:4;left:50%;bottom:14px;transform:translateX(-50%);border:1px solid rgba(255,255,255,.42);background:rgba(11,11,11,.64);color:#fff;border-radius:999px;padding:10px 14px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap;backdrop-filter:blur(6px)}
    .vsl-card.sound-blocked .vsl-sound{display:inline-flex;align-items:center;justify-content:center}
    .vsl-sound:hover{background:rgba(200,164,106,.9);color:#111;border-color:var(--gold)}
    @media(max-width:640px){.vsl-card{margin-bottom:18px;border-radius:12px}.vsl-card:before{left:10px;top:10px;font-size:7px}.vsl-video{border-radius:10px}.vsl-sound{bottom:10px;padding:9px 12px}}
'''

video = '''          <div class="vsl-card" id="cleaningVslCard">
            <video class="vsl-video" id="cleaningVsl" autoplay playsinline preload="auto" aria-label="SplitsPro split system cleaning video">
              <source src="/assets/splitspro-cleaning-vsl.mp4?v=20260917-3" type="video/mp4">
            </video>
            <button class="vsl-sound" id="cleaningVslSound" type="button" aria-label="Play video with sound">Play with sound 🔊</button>
          </div>
'''

js = '''
  <script id="cleaning-vsl-behaviour">
    (()=>{
      const video=document.getElementById('cleaningVsl');
      const sound=document.getElementById('cleaningVslSound');
      const card=document.getElementById('cleaningVslCard');
      if(!video||!sound||!card)return;

      video.loop=false;
      video.muted=false;
      video.volume=1;

      const startWithSound=()=>{
        video.muted=false;
        video.volume=1;
        const playPromise=video.play();
        if(playPromise&&playPromise.catch){
          playPromise.then(()=>card.classList.remove('sound-blocked')).catch(()=>{
            card.classList.add('sound-blocked');
          });
        }
      };

      if(video.readyState>=2) startWithSound();
      else video.addEventListener('canplay',startWithSound,{once:true});

      sound.addEventListener('click',()=>{
        video.pause();
        video.currentTime=0;
        video.muted=false;
        video.volume=1;
        const playPromise=video.play();
        if(playPromise&&playPromise.catch){
          playPromise.then(()=>card.classList.remove('sound-blocked')).catch(()=>card.classList.add('sound-blocked'));
        }else{
          card.classList.remove('sound-blocked');
        }
      });

      video.addEventListener('ended',()=>{
        video.pause();
        video.currentTime=video.duration || video.currentTime;
      });
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
