from pathlib import Path

BACKEND_URL = "https://splitspro-leads.onrender.com"
REPO = Path(__file__).resolve().parents[1]


def patch_api():
    path = REPO / "src/lib/api.js"
    text = path.read_text(encoding="utf-8")
    old = 'const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;'
    new = f'const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "{BACKEND_URL}";'
    if old in text:
        text = text.replace(old, new)
    elif BACKEND_URL not in text:
        raise RuntimeError("Could not safely patch src/lib/api.js")
    path.write_text(text, encoding="utf-8")


def replace_function_line(path: Path, marker: str, replacement: str):
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    replaced = False
    out = []
    for line in lines:
        if marker in line:
            ending = "\n" if line.endswith("\n") else ""
            out.append(replacement.rstrip("\n") + ending)
            replaced = True
        else:
            out.append(line)
    if not replaced:
        if "splitspro-leads.onrender.com/api/quotes" in text:
            return
        raise RuntimeError(f"Could not find {marker!r} in {path}")
    path.write_text("".join(out), encoding="utf-8")


def patch_homepage():
    path = REPO / "index.html"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "This test site opens your SMS app with the enquiry filled in.",
        "Your enquiry is sent securely to SplitsPro. We'll be in touch shortly.",
    )

    old_fields = '<input class="field" id="suburb" placeholder="Suburb *" required><select class="field" id="service">'
    new_fields = (
        '<input class="field" id="suburb" placeholder="Suburb *" required>'
        '<input class="field wide" id="address" placeholder="Street address (optional)">'
        '<input class="field" id="preferred_date" type="date" aria-label="Preferred date (optional)">'
        '<select class="field" id="service">'
    )
    if 'id="preferred_date"' not in text and old_fields in text:
        text = text.replace(old_fields, new_fields, 1)

    path.write_text(text, encoding="utf-8")

    replacement = r'''async function sendEnquiry(e){
  e.preventDefault();
  const form=e.currentTarget;
  const btn=form.querySelector('button[type="submit"]');
  const original=btn?btn.textContent:'';
  const payload={
    name:document.getElementById('name').value.trim(),
    phone:document.getElementById('phone').value.trim(),
    suburb:document.getElementById('suburb').value.trim(),
    address:(document.getElementById('address')?.value||'').trim(),
    preferred_date:document.getElementById('preferred_date')?.value||'',
    service:document.getElementById('service').value,
    message:document.getElementById('message').value.trim(),
    email:'',
    page_url:window.location.href,
    landing_page:window.location.href,
    referrer:document.referrer||''
  };
  if(btn){btn.disabled=true;btn.textContent='Sending…'}
  try{
    const r=await fetch('https://splitspro-leads.onrender.com/api/quotes',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
    });
    if(!r.ok)throw new Error('Lead endpoint returned '+r.status);
    form.reset();
    if(btn)btn.textContent='Request received ✓';
    setTimeout(()=>{if(btn){btn.disabled=false;btn.textContent=original}},3000);
  }catch(err){
    console.error('SplitsPro enquiry failed',err);
    if(btn){btn.disabled=false;btn.textContent=original}
    const subject=encodeURIComponent('Website enquiry — '+payload.service+' — '+payload.suburb);
    const body=encodeURIComponent(`Name: ${payload.name}\nPhone: ${payload.phone}\nSuburb: ${payload.suburb}\nAddress: ${payload.address}\nPreferred date: ${payload.preferred_date}\nService: ${payload.service}\nMessage: ${payload.message}`);
    window.location.href=`mailto:info@splitspro.com.au?subject=${subject}&body=${body}`;
  }
}'''
    replace_function_line(path, "function sendEnquiry(e)", replacement)


def patch_cleaning_offer():
    path = REPO / "split-system-cleaning-offer/index.html"
    if not path.exists():
        return

    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "Send the details below and your phone will open a ready-to-send message to SplitsPro.",
        "Send the details below and your booking request will go straight to SplitsPro.",
    )
    old_fields = '<input class="field" id="suburb" placeholder="Suburb *" required><select class="field" id="offer">'
    new_fields = (
        '<input class="field" id="suburb" placeholder="Suburb *" required>'
        '<input class="field" id="address" placeholder="Street address (optional)">'
        '<input class="field" id="preferred_date" type="date" aria-label="Preferred date (optional)">'
        '<select class="field" id="offer">'
    )
    if 'id="preferred_date"' not in text and old_fields in text:
        text = text.replace(old_fields, new_fields, 1)
    path.write_text(text, encoding="utf-8")

    replacement = r'''async function bookClean(e){
  e.preventDefault();
  const form=e.currentTarget;
  const btn=form.querySelector('button[type="submit"]');
  const original=btn?btn.textContent:'';
  const name=document.getElementById('name').value.trim();
  const phone=document.getElementById('phone').value.trim();
  const suburb=document.getElementById('suburb').value.trim();
  const address=(document.getElementById('address')?.value||'').trim();
  const preferred_date=document.getElementById('preferred_date')?.value||'';
  const offer=document.getElementById('offer').value;
  const payload={
    name,phone,suburb,address,preferred_date,
    service:'Air Conditioner Cleaning',
    message:`Cleaning offer selected: ${offer}`,
    email:'',
    page_url:window.location.href,
    landing_page:window.location.href,
    referrer:document.referrer||''
  };
  if(btn){btn.disabled=true;btn.textContent='Sending…'}
  try{
    const r=await fetch('https://splitspro-leads.onrender.com/api/quotes',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
    });
    if(!r.ok)throw new Error('Lead endpoint returned '+r.status);
    form.reset();
    if(btn)btn.textContent='Booking request received ✓';
    setTimeout(()=>{if(btn){btn.disabled=false;btn.textContent=original}},3000);
  }catch(err){
    console.error('SplitsPro cleaning enquiry failed',err);
    if(btn){btn.disabled=false;btn.textContent=original}
    const subject=encodeURIComponent('Cleaning enquiry — '+suburb);
    const body=encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nSuburb: ${suburb}\nAddress: ${address}\nPreferred date: ${preferred_date}\nOffer: ${offer}`);
    window.location.href=`mailto:info@splitspro.com.au?subject=${subject}&body=${body}`;
  }
}'''
    replace_function_line(path, "function bookClean(e)", replacement)


def main():
    patch_api()
    patch_homepage()
    patch_cleaning_offer()
    print("All website enquiry forms now route to the SplitsPro lead backend with client details.")


if __name__ == "__main__":
    main()
