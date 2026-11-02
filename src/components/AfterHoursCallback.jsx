import { useEffect, useState } from "react";
import { submitQuote } from "../lib/api";
import { PHONE_TEL } from "../lib/data";

const isAfterHours = () => {
  const parts = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", hour: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  return Number(parts.find(p => p.type === "hour")?.value || 0) >= 18;
};
export default function AfterHoursCallback() {
  const [closed, setClosed] = useState(isAfterHours);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", suburb: "" });
  const [status, setStatus] = useState("");
  useEffect(() => {
    const update = () => setClosed(isAfterHours());
    const timer = window.setInterval(update, 30000);
    const handleClick = (event) => {
      if (!isAfterHours()) return;
      const target = event.target.closest('a[href^="tel:"], button');
      if (!target) return;
      const label = (target.textContent || "").toLowerCase();
      if (target.tagName !== "A" && !/call now|call to book|call us|call splitspro|call 0/.test(label)) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(true);
    };
    document.addEventListener("click", handleClick, true);
    return () => { window.clearInterval(timer); document.removeEventListener("click", handleClick, true); };
  }, []);
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="tel:"]');
    links.forEach(a => {
      if (!a.dataset.spOriginalLabel) a.dataset.spOriginalLabel = a.textContent;
      if (closed) {
        a.setAttribute("aria-label", "We are currently closed. Request a callback");
        if (/call now|call to book|call us/i.test(a.textContent)) a.textContent = "We are currently closed · Request a callback";
      } else if (a.dataset.spOriginalLabel && a.textContent.includes("We are currently closed")) {
        a.textContent = a.dataset.spOriginalLabel;
        a.removeAttribute("aria-label");
      }
    });
  }, [closed, open]);
  const send = async e => {
    e.preventDefault(); setStatus("sending");
    try {
      await submitQuote({ ...form, service: "Callback Request", message: "After 6pm callback request from " + window.location.href, page_url: window.location.href });
      setStatus("sent");
    } catch { setStatus("error"); }
  };
  if (!open) return null;
  return <div role="presentation" className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/70 p-4" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
    <div role="dialog" aria-modal="true" aria-label="Request a callback" className="w-full max-w-md rounded-2xl bg-white p-6 text-[#161616] shadow-2xl">
      <button className="float-right text-2xl" aria-label="Close" onClick={() => setOpen(false)}>×</button>
      <h2 className="font-serif text-3xl">We're currently closed</h2>
      <p className="mt-3 text-sm text-gray-600">Leave your details and we'll call you back during business hours. No pressure or obligation.</p>
      {status === "sent" ? <p className="mt-6 font-semibold">Thank you. Your callback request has been received.</p> :
      <form onSubmit={send} className="mt-5 grid gap-3">
        {["name","phone","email","suburb"].map(field => <label key={field} className="grid gap-1 text-sm font-semibold capitalize">{field}<input className="rounded-lg border border-gray-300 p-3" required type={field === "email" ? "email" : field === "phone" ? "tel" : "text"} value={form[field]} onChange={e => setForm(v => ({ ...v, [field]: e.target.value }))} /></label>)}
        {status === "error" && <p role="alert" className="text-sm text-red-700">Couldn't send your request. Please try again.</p>}
        <button disabled={status === "sending"} className="mt-2 rounded-lg bg-[#C8A46A] p-3 font-bold text-black">{status === "sending" ? "Sending..." : "Request My Callback"}</button>
      </form>}
    </div>
  </div>;
}
