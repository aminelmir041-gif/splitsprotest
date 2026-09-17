from pathlib import Path
import re

p = Path('split-system-cleaning-offer/index.html')
text = p.read_text(encoding='utf-8')

base = 'https://www.canva.com/design/DAHVXLREICQ/ezIJ1mvbhzS9qc2N1WC-rQ/view?embed&autoplay=1&loop=0'
muted_src = base + '&muted=1'
sound_src = base + '&muted=0&volume=1'

# Make the Canva video reliably autoplay muted first, then restart with sound
# on the visitor's first real interaction (touch/click/scroll/keyboard).
text = re.sub(
    r'(<iframe[^>]+id="cleaningVsl"[^>]+src=")[^"]+("[^>]*>)',
    lambda m: m.group(1) + muted_src + m.group(2),
    text,
    count=1,
    flags=re.S,
)

# Add a transparent first-touch catcher over the video itself so tapping the
# video also counts as the interaction that turns sound on.
if 'id="vslSoundCatcher"' not in text:
    text = re.sub(
        r'(\s*</iframe>)',
        r'\1\n            <button class="vsl-sound-catcher" id="vslSoundCatcher" type="button" aria-label="Turn video sound on"></button>',
        text,
        count=1,
    )

if '.vsl-sound-catcher{' not in text:
    css = '''\n    .vsl-sound-catcher{position:absolute;inset:0;z-index:6;border:0;background:transparent;padding:0;margin:0;cursor:pointer}\n    .vsl-card.sound-on .vsl-sound-catcher{display:none}\n'''
    text = text.replace('  </style>', css + '  </style>', 1)

js = f'''
  <script id="cleaning-vsl-behaviour">
    (()=>{{
      const card=document.getElementById('cleaningVslCard');
      const frame=document.getElementById('cleaningVsl');
      const catcher=document.getElementById('vslSoundCatcher');
      if(!card||!frame)return;

      const mutedSrc={muted_src!r};
      const soundSrc={sound_src!r};
      let soundStarted=false;
      let hideTimer=null;
      let fallbackTimer=null;

      const hideCard=()=>{{
        card.classList.add('finished');
        setTimeout(()=>{{ card.style.display='none'; }},460);
      }};

      const armHide=()=>{{
        clearTimeout(hideTimer);
        hideTimer=setTimeout(hideCard,35000);
      }};

      const cleanup=()=>{{
        ['pointerdown','touchstart','mousedown','click','keydown','wheel','scroll'].forEach(type=>{{
          document.removeEventListener(type,startSound,true);
        }});
        if(catcher) catcher.removeEventListener('pointerdown',startSound,true);
      }};

      const startSound=(event)=>{{
        if(soundStarted)return;
        soundStarted=true;
        cleanup();
        clearTimeout(hideTimer);
        clearTimeout(fallbackTimer);
        card.classList.add('sound-on');
        if(catcher) catcher.style.display='none';

        // Reload during the user's interaction so mobile browsers permit audio.
        frame.src=soundSrc+'&started='+(Date.now());
        frame.addEventListener('load',armHide,{{once:true}});
        fallbackTimer=setTimeout(armHide,1500);
      }};

      // Initial muted autoplay is allowed by mobile browsers.
      if(frame.src!==mutedSrc) frame.src=mutedSrc;
      frame.addEventListener('load',armHide,{{once:true}});
      fallbackTimer=setTimeout(armHide,1800);

      // The first touch used to scroll the page will turn the sound on.
      ['pointerdown','touchstart','mousedown','click','keydown','wheel','scroll'].forEach(type=>{{
        document.addEventListener(type,startSound,{{capture:true,passive:true}});
      }});
      if(catcher) catcher.addEventListener('pointerdown',startSound,{{capture:true,passive:true}});
    }})();
  </script>
'''

pattern = re.compile(r'\s*<script id="cleaning-vsl-behaviour">.*?</script>', re.S)
if pattern.search(text):
    text = pattern.sub('\n' + js.strip(), text, count=1)
else:
    text = text.replace('</body>', js + '</body>', 1)

p.write_text(text, encoding='utf-8')
