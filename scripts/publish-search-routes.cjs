// GitHub Pages needs an index.html for each public route before React can take over.
const fs = require('node:fs');
const path = require('node:path');
const pages = require('../src/lib/search-pages.json');
const origin = 'https://splitspro.com.au';
const build = path.resolve('build');
const shell = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
const sitemap = fs.readFileSync(path.join(build, 'sitemap.xml'), 'utf8');
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const urlFor = route => new URL(route, origin).href;
const localRoute = '/split-systems/bass-hill-bankstown/';
const primaryLinks = [
  [localRoute, 'Split system installation in Bass Hill and Bankstown'],
  ['/split-system-cleaning/', 'Split system cleaning'],
  ['/ducted/daikin-rinnai/', 'Ducted air conditioning packages'],
  ['/installation-guarantee/', 'Installation guarantee'],
  ['/contact/', 'Contact SplitsPro'],
];
const rootElement = /<div\s+id=(?:"root"|'root'|root)\s*>\s*<\/div>/i;
if (!rootElement.test(shell)) throw new Error('Expected the original React build before generating search routes');

fs.writeFileSync(path.join(build, '404.html'), shell);
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
for (const url of locations) {
  if (url.origin !== origin || !url.pathname.endsWith('/')) throw new Error('Unexpected sitemap URL: ' + url.href);
  const route = url.pathname;
  const file = path.join(build, route.slice(1), 'index.html');
  const existing = fs.existsSync(file) && fs.readFileSync(file, 'utf8');
  // Standalone pages contain their own images, pricing, forms and tracking.
  if (existing && existing !== shell) continue;
  let html = shell;
  const meta = pages[route];
  if (meta) {
    html = html.replace(/<title>[^<]*<\/title>/i, '<title>' + escapeHtml(meta.title) + '</title>');
    html = html.replace(/<meta\b[^>]*(?:name=(?:"description"|description)|property=(?:"og:description"|og:description))[^>]*>/gi,
      tag => tag.replace(/content="[^"]*"/i, 'content="' + escapeHtml(meta.description) + '"'));
    html = html.replace(/<meta\b[^>]*property=(?:"og:title"|og:title)[^>]*>/gi,
      tag => tag.replace(/content="[^"]*"/i, 'content="' + escapeHtml(meta.title) + '"'));
    const links = primaryLinks.filter(([href]) => href !== route).map(([href, name]) => '<li><a href="' + href + '">' + name + '</a></li>').join('');
    html = html.replace(rootElement, '<div id="root"><main><h1>' + escapeHtml(meta.title.split(' | ')[0]) + '</h1><p>' + escapeHtml(meta.description) + '</p><nav aria-label="SplitsPro services"><ul>' + links + '</ul></nav></main></div>');
  }
  html = html.replace('</head>', '<link data-rh="true" rel="canonical" href="' + escapeHtml(urlFor(route)) + '"></head>');
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, html);
}
// Preserve direct entry to old Mitsubishi links; the app redirects them to the current range.
for (const alias of ['mitsubishi-electric', 'mitsubishi-heavy-industries']) {
  const directory = path.join(build, 'split-systems', alias);
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, 'index.html'), '<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>Mitsubishi split systems | SplitsPro</title><link rel="canonical" href="' + origin + '/split-systems/mitsubishi/"><meta http-equiv="refresh" content="0;url=/split-systems/mitsubishi/"></head><body><a href="/split-systems/mitsubishi/">View Mitsubishi split systems</a></body></html>');
}
console.log('Published ' + locations.length + ' sitemap routes.');
