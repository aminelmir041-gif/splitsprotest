// GitHub Pages needs an index.html for each public route before React can take over.
const fs = require('node:fs');
const path = require('node:path');
const pages = require('../src/lib/search-pages.json');
const { SPLIT_BRANDS, PRICING_DISCLAIMER } = require('../src/lib/data.js');
const { regionalSplitPages } = require('../src/lib/regionalSplitPages.mjs');
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
  ['/ducted-vs-split-system/', 'Compare ducted and split system air conditioning'],
  ['/aircon-installation-guide/', 'Air conditioner sizing calculator'],
  ['/ducted-air-conditioning-cost-sydney/', 'Ducted installation cost guide'],
];
const brandLinks = SPLIT_BRANDS.map(brand => ['/split-systems/' + brand.slug + '/', brand.brand + ' installed prices']);
const regionLinks = Object.values(regionalSplitPages).map(page => [new URL(page.canonical).pathname, page.regionLabel]);
const buyerLinks = [
  ['/split-systems/', 'Compare split system brands'],
  ['/aircon-installation-guide/', 'Check which size your room needs'],
  ['/installation-guarantee/', 'Read the installation guarantee'],
  ['/contact/', 'Contact SplitsPro'],
];

function brandPricing(brand) {
  return brand.ranges.map(range => {
    const name = range.displayName || brand.brand + ' ' + range.name;
    const rows = range.prices.map(({ kw, price }) =>
      '<tr><th scope="row">' + escapeHtml(kw) + '</th><td>' + escapeHtml(price) + '</td></tr>'
    ).join('');
    return '<table><caption>' + escapeHtml(name) + '</caption><thead><tr><th scope="col">Capacity</th><th scope="col">Supplied and installed</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }).join('') + '<p>' + escapeHtml(PRICING_DISCLAIMER) + '</p>';
}

const routePages = { ...pages };
for (const brand of SPLIT_BRANDS) {
  routePages['/split-systems/' + brand.slug + '/'] = {
    title: brand.metaTitle, description: brand.metaDesc, heading: brand.h1,
    content: brandPricing(brand), links: buyerLinks,
  };
}
for (const page of Object.values(regionalSplitPages)) {
  routePages[new URL(page.canonical).pathname] = {
    title: page.metaTitle, description: page.metaDescription, heading: page.heroTitle,
    content: '<p>' + escapeHtml(page.introBody) + '</p>', links: brandLinks,
  };
}
routePages['/split-systems/'] = { ...pages['/split-systems/'], links: [...brandLinks, ...primaryLinks] };
routePages['/service-areas/'] = { ...pages['/service-areas/'], links: [...primaryLinks, ...regionLinks] };
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
  const meta = routePages[route];
  if (meta) {
    html = html.replace(/<title>[^<]*<\/title>/i, '<title>' + escapeHtml(meta.title) + '</title>');
    html = html.replace(/<meta\b[^>]*(?:name=(?:"description"|description)|property=(?:"og:description"|og:description))[^>]*>/gi,
      tag => tag.replace(/content="[^"]*"/i, 'content="' + escapeHtml(meta.description) + '"'));
    html = html.replace(/<meta\b[^>]*property=(?:"og:title"|og:title)[^>]*>/gi,
      tag => tag.replace(/content="[^"]*"/i, 'content="' + escapeHtml(meta.title) + '"'));
    const links = (meta.links || primaryLinks).filter(([href]) => href !== route)
      .map(([href, name]) => '<li><a href="' + escapeHtml(href) + '">' + escapeHtml(name) + '</a></li>').join('');
    const heading = escapeHtml(meta.heading || meta.title.split(' | ')[0]);
    html = html.replace(rootElement, () => '<div id="root"><main><h1>' + heading + '</h1><p>' + escapeHtml(meta.description) + '</p>' +
      (meta.content || '') + '<nav aria-label="SplitsPro services"><ul>' + links + '</ul></nav></main></div>');
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

// Put the guide and coverage links in the HTML so they also work before React starts.
const splitPage = fs.readFileSync(path.join(build, 'split-system-installation-sydney/index.html'), 'utf8');
const guides = splitPage.match(/<div class="footer-guides">[\s\S]*?<\/div>/)?.[0];
if (!guides) throw new Error('Missing Sydney guides navigation');
const areas = regionLinks.concat([[localRoute, 'Bass Hill & Bankstown'], ['/service-areas/', 'All Sydney service areas']]);
const areaLinks = areas.map(([href, label]) => '<a href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>').join('\n');
const directory = `<footer class="sp-local-directory" aria-label="Sydney areas and expert guides"><div class="sp-local-columns">
<div><h3>Air conditioning across Sydney</h3><iframe title="SplitsPro service area map" loading="lazy" width="420" height="220" src="https://www.google.com/maps?q=Bass+Hill+NSW+Australia&amp;z=10&amp;output=embed"></iframe></div>
<nav aria-label="Installation areas"><h3>Service areas</h3>${areaLinks}</nav>${guides}</div></footer>`;
function addDirectory(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { addDirectory(file); continue; }
    if (entry.name !== 'index.html' && entry.name !== '404.html') continue;
    const html = fs.readFileSync(file, 'utf8');
    if (/http-equiv=["']?refresh/i.test(html) || html.includes('class="footer-guides"')) continue;
    fs.writeFileSync(file, html.replace(/<\/head>/i, '<link rel="stylesheet" href="/local-directory.css"></head>')
      .replace(/<\/body>/i, () => directory + '</body>'));
  }
}
addDirectory(build);
