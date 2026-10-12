// Exercise the real static-homepage JavaScript, not a rewritten menu handler.
// Catch JS syntax regressions and check opening/closing the mobile navigation.
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const inline = [...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1]);
const script = inline.find((src) => src.includes("function setMenu("));
assert.ok(script, "Homepage menu script not found");
assert.ok(html.includes(".mobilemenu.open{"), "Mobile menu open style missing");
assert.ok(html.includes(".mobilemenu{display:block}"), "Mobile menu display override missing");

function element() {
  const items = new Set();
  const handlers = {};
  const attributes = {};
  return {
    classList: {
      toggle(key, force) {
        const enable = force === undefined ? !items.has(key) : !!force;
        if (enable) items.add(key);
        else items.delete(key);
        return enable;
      },
      contains(key) { return items.has(key); },
      add(key) { items.add(key); },
      remove(key) { items.delete(key); },
    },
    textContent: "",
    setAttribute(key, value) { attributes[key] = value; },
    getAttribute(key) { return attributes[key]; },
    addEventListener(key, fn) { handlers[key] = fn; },
    querySelectorAll() { return []; },
    handlers,
  };
}

const els = {
  header: element(),
  float: element(),
  hamb: element(),
  mobilemenu: element(),
};
const mobileLink = element();
els.mobilemenu.querySelectorAll = (sel) => sel === "a" ? [mobileLink] : [];
const documentEvents = {};
const document = {
  getElementById: (id) => els[id] || null,
  querySelectorAll: () => [],
  addEventListener: (key, fn) => { documentEvents[key] = fn; },
};
const window = {
  scrollY: 0,
  innerHeight: 800,
  innerWidth: 390,
  addEventListener: () => {},
  location: { href: "https://splitspro.com.au/" },
};
vm.runInNewContext(script, { document, window, console, setTimeout }, {
  filename: "index.html homepage inline menu script",
  timeout: 1000,
});

assert.equal(typeof els.hamb.handlers.click, "function", "Hamburger click handler missing");
els.hamb.handlers.click();
assert.equal(els.mobilemenu.classList.contains("open"), true, "Menu did not open on tap");
assert.equal(els.hamb.getAttribute("aria-expanded"), "true", "Menu aria state wrong when open");
assert.equal(els.header.classList.contains("solid"), true, "Menu background did not become visible");
mobileLink.handlers.click();
assert.equal(els.mobilemenu.classList.contains("open"), false, "Menu did not close on link click");
els.hamb.handlers.click();
assert.equal(els.mobilemenu.classList.contains("open"), true, "Menu did not reopen");
documentEvents.keydown({ key: "Escape" });
assert.equal(els.mobilemenu.classList.contains("open"), false, "Escape did not close menu");
assert.equal(els.hamb.getAttribute("aria-expanded"), "false");
console.log("SplitsPro homepage menu interaction passed");
