import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Check, Phone, Upload, X } from "lucide-react";
import { Input } from "./ui/input.js";
import { Textarea } from "./ui/textarea.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select.js";
import { SERVICE_OPTIONS, PHONE_TEL } from "../lib/data.js";
import { submitQuote, uploadPhoto } from "../lib/api.js";
const buildInitial = (defaultService = "", defaultMessage = "") => ({
    name: "", phone: "", email: "", suburb: "", service: defaultService, message: defaultMessage,
});
const fieldClass = "h-12 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus-visible:border-[#C8A46A] focus-visible:ring-0 placeholder:text-[#6E6E73]/60";
export const QuoteForm = ({ onDark = false, defaultService = "", defaultMessage = "", submitLabel = "Get Free Quote & Plan" }) => {
    const [form, setForm] = useState(buildInitial(defaultService, defaultMessage));
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const fileRef = useRef(null);
    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const onPickPhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image must be 10MB or smaller.");
            return;
        }
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };
    const clearPhoto = () => {
        setPhoto(null);
        setPhotoPreview("");
        if (fileRef.current)
            fileRef.current.value = "";
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.suburb || !form.service) {
            toast.error("Please complete your name, phone, suburb and service.");
            return;
        }
        if (form.phone.replace(/\D/g, "").length < 8) {
            toast.error("Please enter a valid phone number.");
            return;
        }
        setLoading(true);
        try {
            let photo_url = "";
            if (photo) {
                const res = await uploadPhoto(photo);
                photo_url = res.url;
            }
            await submitQuote({ ...form, photo_url });
            setDone(true);
            setForm(buildInitial(defaultService, defaultMessage));
            clearPhoto();
            toast.success("Thank you — we'll be in touch shortly.");
        }
        catch (err) {
            toast.error("Something went wrong. Please call us instead.");
        }
        finally {
            setLoading(false);
        }
    };
    if (done) {
        return (_jsxs("div", { "data-testid": "quote-success", className: "py-8 text-center", children: [_jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C8A46A] text-white", children: _jsx(Check, { className: "h-7 w-7" }) }), _jsx("h3", { className: `mt-6 font-serif text-2xl ${onDark ? "text-white" : "text-[#1D1D1F]"}`, children: "Request received" }), _jsx("p", { className: `mt-2 ${onDark ? "text-white/70" : "text-[#6E6E73]"}`, children: "One of our team will call you shortly to arrange your free quote and plan." }), _jsx("button", { onClick: () => setDone(false), "data-testid": "quote-another-btn", className: "mt-6 text-sm font-semibold text-[#C8A46A] link-line", children: "Submit another request" })] }));
    }
    const labelClass = `mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] ${onDark ? "text-white/70" : "text-[#6E6E73]"}`;
    return (_jsxs("form", { onSubmit: handleSubmit, "data-testid": "quote-form", className: "grid gap-5", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "q-name", className: labelClass, children: "Name" }), _jsx(Input, { id: "q-name", "data-testid": "quote-name-input", value: form.name, onChange: (e) => update("name", e.target.value), placeholder: "Your name", className: fieldClass })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "q-phone", className: labelClass, children: "Phone" }), _jsx(Input, { id: "q-phone", "data-testid": "quote-phone-input", value: form.phone, onChange: (e) => update("phone", e.target.value), placeholder: "04xx xxx xxx", className: fieldClass })] })] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "q-email", className: labelClass, children: "Email (optional)" }), _jsx(Input, { id: "q-email", type: "email", "data-testid": "quote-email-input", value: form.email, onChange: (e) => update("email", e.target.value), placeholder: "you@email.com", className: fieldClass })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "q-suburb", className: labelClass, children: "Suburb" }), _jsx(Input, { id: "q-suburb", "data-testid": "quote-suburb-input", value: form.suburb, onChange: (e) => update("suburb", e.target.value), placeholder: "Enter your suburb", className: fieldClass })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Service Required" }), _jsxs(Select, { value: form.service, onValueChange: (v) => update("service", v), children: [_jsx(SelectTrigger, { "data-testid": "quote-service-select", className: "h-12 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus:ring-0 data-[placeholder]:text-[#6E6E73]/60", children: _jsx(SelectValue, { placeholder: "Select a service" }) }), _jsx(SelectContent, { children: SERVICE_OPTIONS.map((s) => _jsx(SelectItem, { value: s, children: s }, s)) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "q-message", className: labelClass, children: "Message (optional)" }), _jsx(Textarea, { id: "q-message", "data-testid": "quote-message-input", value: form.message, onChange: (e) => update("message", e.target.value), placeholder: "Tell us a little about your home or the system you have in mind\u2026", className: "min-h-24 rounded-sm border-0 border-b border-[#E5E5EA] bg-transparent px-0 text-[#1D1D1F] shadow-none focus-visible:border-[#C8A46A] focus-visible:ring-0 placeholder:text-[#6E6E73]/60" })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Photo of your space or unit (optional)" }), _jsx("input", { ref: fileRef, type: "file", accept: "image/*", onChange: onPickPhoto, "data-testid": "quote-photo-input", className: "hidden" }), !photoPreview ? (_jsxs("button", { type: "button", onClick: () => fileRef.current?.click(), "data-testid": "quote-photo-btn", className: `flex h-12 w-full items-center gap-3 rounded-sm border border-dashed px-4 text-sm transition-colors ${onDark ? "border-white/30 text-white/70 hover:border-white/60" : "border-[#C7C7CC] text-[#6E6E73] hover:border-[#C8A46A] hover:text-[#C8A46A]"}`, children: [_jsx(Upload, { className: "h-4 w-4" }), " Add a photo \u2014 it helps us quote accurately"] })) : (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: photoPreview, alt: "Upload preview", className: "h-14 w-14 rounded-md object-cover" }), _jsx("span", { className: `flex-1 truncate text-sm ${onDark ? "text-white/80" : "text-[#1D1D1F]"}`, children: photo?.name }), _jsx("button", { type: "button", onClick: clearPhoto, "data-testid": "quote-photo-clear", className: `flex h-8 w-8 items-center justify-center rounded-full ${onDark ? "text-white/70 hover:bg-white/10" : "text-[#6E6E73] hover:bg-[#F5F5F7]"}`, children: _jsx(X, { className: "h-4 w-4" }) })] }))] }), _jsxs("div", { className: "mt-1 flex flex-col gap-3 sm:flex-row", children: [_jsx("button", { type: "submit", disabled: loading, "data-testid": "quote-submit-btn", className: "flex h-[52px] flex-1 items-center justify-center rounded-sm bg-[#C8A46A] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-70", children: loading ? _jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : submitLabel }), _jsxs("a", { href: PHONE_TEL, "data-testid": "quote-call-btn", className: `flex items-center justify-center gap-2 rounded-sm border px-6 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${onDark ? "border-white/40 text-white hover:bg-white/10" : "border-[#1D1D1F] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white"}`, children: [_jsx(Phone, { className: "h-4 w-4" }), " Call Now"] })] })] }));
};
export default QuoteForm;
