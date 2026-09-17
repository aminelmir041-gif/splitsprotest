from pathlib import Path

p = Path('split-system-cleaning-offer/index.html')
text = p.read_text(encoding='utf-8')

css = '''
    .vsl-card{position:relative;margin:0 0 22px;border:1px solid rgba(200,164,106,.32);border-radius:16px;overflow:hidden;background:#050505;box-shadow:0 16px 42px rgba(0,0,0,.3)}
    .vsl-card:before{content:"WATCH THE 35-SECOND CLEANING DIFFERENCE";position:absolute;left:14px;top:12px;z-index:3;background:rgba(11,11,11,.78);border:1px solid rgba(200,164,106,.42);color:var(--gold2);padding:7px 10px;border-radius:999px;font-size:8px;font-weight:900;letter-spacing:.14em;pointer-events:none;backdrop-filter:blur(8px)}
    .vsl-video{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#050505}
    .vsl-sound{position:absolute;z-index:4;left:50%;bottom:14px;transform:translateX(-50%);border:1px solid rgba(255,255,255,.28);background:rgba(11,11,11,.82);color:#fff;border-radius:999px;padding:10px 14px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap;backdrop-filter:blur(10px)}
    .vsl-sound:hover{background:rgba(200,164,106,.92);color:#111;border-color:var(--gold)}
    .vsl-card.sound-on .vsl-sound{display:none}
    @media(max-width:640px){.vsl-card{margin-bottom:18px;border-radius:12px}.vsl-card:before{left:10px;top:10px;font-size:7px}.vsl-sound{bottom:10px;padding:9px 12px}}
'''

video = '''          <div class="vsl-card" id="cleaningVslCard">
            <video class="vsl-video" id="cleaningVsl" autoplay muted playsinline preload="metadata" aria-label="SplitsPro split system cleaning video">
              <source src="/assets/splitspro-cleaning-vsl.mp4" type="video/mp4">
            </video>
            <button class="vsl-sound" id="cleaningVslSound" type="button" aria-label="Play video with sound">Tap for sound 🔊</button>
          </div>
'''

js = '''
  <script id="cleaning-vsl-behaviour">
    (()=>{
      const video=document.getElementById('cleaningVsl');
      const sound=document.getElementById('cleaningVslSound');
      const card=document.getElementById('cleaningVslCard');
      if(!video||!sound||!card)return;
      video.muted=true;
      video.loop=false;
      const startMuted=()=>{video.muted=true;const p=video.play();if(p&&p.catch)p.catch(()=>{});};
      if(video.readyState>=2)startMuted();else video.addEventListener('canplay',startMuted,{once:true});
      sound.addEventListener('click',()=>{video.pause();video.currentTime=0;video.muted=false;card.classList.add('sound-on');const p=video.play();if(p&&p.catch)p.catch(()=>{video.muted=true;card.classList.remove('sound-on');});});
      video.addEventListener('ended',()=>{video.pause();});
    })();
  </script>
'''

if '.vsl-card{' not in text:
    text = text.replace('  </style>', css + '  </style>', 1)

if 'id="cleaningVsl"' not in text:
    needle = '        <div class="hero-offers">\n'
    if needle not in text:
        raise SystemExit('hero-offers marker not found')
    text = text.replace(needle, needle + video, 1)

if 'id="cleaning-vsl-behaviour"' not in text:
    text = text.replace('</body>', js + '</body>', 1)

p.write_text(text, encoding='utf-8')
