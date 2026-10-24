import { useEffect, useState } from "react";
import { Check, Loader2, Phone, Upload, X } from "lucide-react";
import { PHONE_TEL } from "../lib/data";
import { submitQuote, uploadPhoto } from "../lib/api";

const SEEN_KEY = "splitspro:installed-quote-prompt:v1";
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function ExitQuoteCapture({ selectedUnit }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", name: "", phone: "", suburb: "", marketing: false });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    let seen = false;
    try { seen = window.sessionStorage.getItem(SEEN_KEY) === "shown"; } catch {}
    if (seen) return undefined;

    let idleTimer;
    const show = () => {
      if (document.visibilityState !== "visible" || seen) return;
      seen = true;
      try { window.sessionStorage.setItem(SEEN_KEY, "shown"); } catch {}
      setOpen(true);
    };
    const resetIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(show, 30000);
    };
    const onMouseOut = (event) => {
      // Desktop exit intent: cursor leaves through the top of the viewport.
      if (!event.relatedTarget && event.clientY <= 0 && Date.now() - startedAt > 10000) show();
    };
    const startedAt = Date.now();
    resetIdle();
    for (const event of ["scroll", "pointerdown", "keydown", "touchstart"]) {
      window.addEventListener(event, resetIdle, { passive: true });
    }
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      window.clearTimeout(idleTimer);
      for (const event of ["scroll", "pointerdown", "keydown", "touchstart"]) {
        window.removeEventListener(event, resetIdle);
      }
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const ready = validEmail(form.email) && form.name.trim().length >= 2 &&
    form.phone.replace(/\D/g, "").length >= 8 && form.suburb.trim().length >= 2;
  const update = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setError(""); };

  const submit = async (event) => {
    event.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    try {
      let photo_url = "";
      if (photo) {
        const upload = await uploadPhoto(photo);
        photo_url = upload.url;
      }
      const params = new URLSearchParams(window.location.search);
      const requestedSystem = selectedUnit?.displayName
        ? selectedUnit.displayName + " " + selectedUnit.kw
        : "Rinnai or Daikin split system";
      await submitQuote({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        suburb: form.suburb.trim(),
        service: "Split System Installation",
        message: "Free email quote requested from installed-deals exit popup. Interested in: " +
          requestedSystem + ". Photo supplied: " + (photo ? "yes" : "no") +
          ". Marketing email consent: " + (form.marketing ? "yes" : "no") + ".",
        photo_url,
        page_url: window.location.href,
        landing_page: window.location.href,
        referrer: document.referrer || "",
        utm_source: params.get("utm_source") || "",
        utm_campaign: params.get("utm_campaign") || ""
      });
      setDone(true);
    } catch {
      setError("We couldn't send your request. Please try again or call us.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="presentation" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 sm:p-6"
      onClick={() => setOpen(false)} data-testid="installed-exit-quote-overlay">
      <section role="dialog" aria-modal="true" aria-labelledby="installed-exit-quote-title"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-lg overflow-y-auto rounded-2xl border-t-4 border-[#C8A46A] bg-white p-5 shadow-2xl sm:p-8"
        style={{ maxHeight: "min(90dvh, 780px)" }} data-testid="installed-exit-quote">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close free quote"
          className="absolute right-3 top-3 rounded-full bg-[#F0ECE5] p-2 text-[#555] hover:bg-[#E2D7C6]">
          <X className="h-5 w-5" />
        </button>
        {done ? (
          <div className="py-5 text-center" role="status">
            <Check className="mx-auto h-12 w-12 text-[#8F6A34]" />
            <h2 id="installed-exit-quote-title" className="mt-4 font-serif text-3xl">Thanks, we've got your quote request.</h2>
            <p className="mt-3 text-sm text-[#555]">We'll review your details and any photo you supplied, then get in touch about your installation quote.</p>
            <button type="button" onClick={() => setOpen(false)} className="mt-5 rounded-lg bg-[#111] px-6 py-3 text-sm font-bold text-white">Close</button>
          </div>
        ) : (
          <>
            <p className="pr-8 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#987038]">Before you go · Free quote</p>
            <h2 id="installed-exit-quote-title" className="mt-2 pr-7 font-serif text-3xl leading-tight text-[#111] sm:text-4xl">
              Not ready to book? We'll help you choose.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#555]">
              Get a free, no-obligation installation quote. Send a photo of where the indoor and outdoor units would go, and we'll review it and reply to your email.
            </p>
            <form onSubmit={submit} className="mt-5 grid gap-3">
              <label className="text-xs font-bold text-[#333]">Email for your quote *
                <input autoFocus type="email" required value={form.email} onChange={(event) => update("email", event.target.value)}
                  placeholder="you@email.com" autoComplete="email" className="mt-1 block h-12 w-full rounded-lg border border-[#D6C9B6] px-3 text-base outline-[#C8A46A]" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-bold text-[#333]">Your name *
                  <input required value={form.name} onChange={(event) => update("name", event.target.value)}
                    autoComplete="name" className="mt-1 block h-11 w-full rounded-lg border border-[#D6C9B6] px-3 text-base outline-[#C8A46A]" />
                </label>
                <label className="text-xs font-bold text-[#333]">Suburb *
                  <input required value={form.suburb} onChange={(event) => update("suburb", event.target.value)}
                    autoComplete="address-level2" className="mt-1 block h-11 w-full rounded-lg border border-[#D6C9B6] px-3 text-base outline-[#C8A46A]" />
                </label>
              </div>
              <label className="text-xs font-bold text-[#333]">Mobile for quote follow-up *
                <input type="tel" required value={form.phone} onChange={(event) => update("phone", event.target.value)}
                  autoComplete="tel" placeholder="04xx xxx xxx" className="mt-1 block h-11 w-full rounded-lg border border-[#D6C9B6] px-3 text-base outline-[#C8A46A]" />
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#C8A46A] bg-[#FBF8F2] p-3 text-xs font-bold text-[#5B482D]">
                <Upload className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">{photo ? photo.name : "Add installation photos (optional, max 10 MB)"}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
                  onChange={(event) => {
                    const next = event.target.files?.[0] || null;
                    if (next && next.size > 10 * 1024 * 1024) {
                      setError("Please upload a photo under 10 MB.");
                      event.target.value = "";
                      return;
                    }
                    setPhoto(next);
                  }} />
              </label>
              <label className="flex items-start gap-2 text-[11px] text-[#555]">
                <input type="checkbox" checked={form.marketing} onChange={(event) => update("marketing", event.target.checked)}
                  className="mt-0.5 accent-[#C8A46A]" />
                Email me occasional SplitsPro offers too (optional).
              </label>
              <button type="submit" disabled={!ready || busy}
                className="mt-1 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#111] p-3 text-sm font-extrabold uppercase text-white disabled:opacity-40">
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending request…</> : "Send my free quote request →"}
              </button>
              {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}
            </form>
            <a href={PHONE_TEL} className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#78572D] underline">
              <Phone className="h-4 w-4" /> Prefer to talk? Call now
            </a>
          </>
        )}
      </section>
    </div>
  );
}
