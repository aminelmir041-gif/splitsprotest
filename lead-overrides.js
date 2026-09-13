(function () {
  function runtimeApi() {
    return String(window.SPLITSPRO_LEAD_API_URL || "").replace(/\/$/, "");
  }

  function attribution() {
    var params = new URLSearchParams(window.location.search);
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
    var current = {};
    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) current[key] = value;
    });

    var stored = {};
    try {
      stored = JSON.parse(sessionStorage.getItem("splitspro_attribution") || "{}");
    } catch (_) {}

    var merged = Object.assign({}, stored, current);
    if (!merged.landing_page) merged.landing_page = window.location.href;
    if (!merged.referrer && document.referrer) merged.referrer = document.referrer;
    try {
      sessionStorage.setItem("splitspro_attribution", JSON.stringify(merged));
    } catch (_) {}

    merged.page_url = window.location.href;
    merged.referrer = merged.referrer || document.referrer || "";
    return merged;
  }

  function smsFallback(lead) {
    var body = [
      "Hi SplitsPro, I'd like a quote.",
      "Name: " + lead.name,
      "Phone: " + lead.phone,
      "Email: " + (lead.email || ""),
      "Suburb: " + lead.suburb,
      "Service: " + lead.service,
      "Message: " + (lead.message || "")
    ].join("\n");
    window.location.href = "sms:0414698435?&body=" + encodeURIComponent(body);
  }

  function addEmailField(form) {
    if (document.getElementById("email")) return;
    var message = document.getElementById("message");
    if (!message || !message.parentNode) return;
    var email = document.createElement("input");
    email.className = "field";
    email.id = "email";
    email.type = "email";
    email.placeholder = "Email (optional)";
    message.parentNode.insertBefore(email, message);
  }

  async function submitLead(event) {
    event.preventDefault();
    var form = event.currentTarget || event.target;
    var button = form.querySelector('button[type="submit"]');
    var lead = Object.assign({
      name: (document.getElementById("name") || {}).value || "",
      phone: (document.getElementById("phone") || {}).value || "",
      email: (document.getElementById("email") || {}).value || "",
      suburb: (document.getElementById("suburb") || {}).value || "",
      service: (document.getElementById("service") || {}).value || "Website enquiry",
      message: (document.getElementById("message") || {}).value || ""
    }, attribution());

    var api = runtimeApi();
    if (!api) {
      smsFallback(lead);
      return;
    }

    var original = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }

    try {
      var response = await fetch(api + "/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
      if (!response.ok) throw new Error("Lead service returned " + response.status);

      form.reset();
      var heading = form.querySelector("h3");
      var copy = form.querySelector("p");
      if (heading) heading.textContent = "Request received";
      if (copy) copy.textContent = "Thanks — SplitsPro will contact you shortly.";
      if (button) button.textContent = "Sent ✓";
    } catch (error) {
      console.error("SplitsPro lead submission failed", error);
      if (button) {
        button.disabled = false;
        button.textContent = original;
      }
      smsFallback(lead);
    }
  }

  function init() {
    var form = document.querySelector("form.quote-card");
    if (!form) return;
    addEmailField(form);
    form.onsubmit = submitLead;
    var note = form.querySelector("p[style]");
    if (note) note.textContent = "Your enquiry is sent securely to SplitsPro.";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
