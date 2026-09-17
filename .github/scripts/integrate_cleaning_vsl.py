from pathlib import Path
import re

p = Path('split-system-cleaning-offer/index.html')
text = p.read_text(encoding='utf-8')

base = 'https://www.canva.com/design/DAHVXLREICQ/ezIJ1mvbhzS9qc2N1WC-rQ/view?embed&autoplay=1&loop=0&muted=0&volume=1'

# Start the shared Canva video unmuted from the very first load.
text = re.sub(
    r'(<iframe[^>]+id="cleaningVsl"[^>]+src=")[^"]+("[^>]*>)',
    lambda m: m.group(1) + base + m.group(2),
    text,
    count=1,
    flags=re.S,
)

# Remove the transparent catcher added by the previous muted-first version.
text = re.sub(r'\s*<button class="vsl-sound-catcher" id="vslSoundCatcher".*?</button>', '', text, count=1, flags=re.S)
text = re.sub(r'\n\s*\.vsl-sound-catcher\{.*?\.vsl-card\.sound-on \.vsl-sound-catcher\{display:none\}\n', '\n', text, count=1, flags=re.S)

js = f'''
  <script id="cleaning-vsl-behaviour">
    (()=>{{
      const card=document.getElementById('cleaningVslCard');
      const frame=document.getElementById('cleaningVsl');
      if(!card||!frame)return;

      const soundSrc={base!r};
      let interactionRetry=false;
      let hideTimer=null;

      const hideCard=()=>{{
        card.classList.add('finished');
        setTimeout(()=>{{ card.style.display='none'; }},460);
      }};

      const armHide=()=>{{
        clearTimeout(hideTimer);
        hideTimer=setTimeout(hideCard,35000);
      }};

      // Ask Canva for full-volume audio immediately on page load.
      frame.src=soundSrc+'&load='+(Date.now());
      frame.addEventListener('load',armHide,{{once:true}});
      setTimeout(armHide,1800);

      // If the browser muted/blocked the first autoplay, the very first visitor
      // interaction retries the same unmuted autoplay inside a user gesture.
      const retrySound=()=>{{
        if(interactionRetry)return;
        interactionRetry=true;
        clearTimeout(hideTimer);
        frame.src=soundSrc+'&gesture='+(Date.now());
        frame.addEventListener('load',armHide,{{once:true}});
        setTimeout(armHide,1500);
        ['pointerdown','touchstart','mousedown','click','keydown','wheel','scroll'].forEach(type=>{{
          document.removeEventListener(type,retrySound,true);
        }});
      }};

      ['pointerdown','touchstart','mousedown','click','keydown','wheel','scroll'].forEach(type=>{{
        document.addEventListener(type,retrySound,{{capture:true,passive:true}});
      }});
    }})();
  </script>
'''

pattern = re.compile(r'\s*<script id="cleaning-vsl-behaviour">.*?</script>', re.S)
if pattern.search(text):
    text = pattern.sub('\n' + js.strip(), text, count=1)
else:
    text = text.replace('</body>', js + '</body>', 1)

p.write_text(text, encoding='utf-8')
