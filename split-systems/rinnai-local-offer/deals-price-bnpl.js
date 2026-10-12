/* SplitsPro live deals price + payment selector. Uses only existing booking and payment routes. */
(function () {
  "use strict";
  if (!/\/(?:deals|split-systems\/rinnai-local-offer)\/?$/.test(location.pathname)) return;
  var groups = [
    {name:"Rinnai", key:"rinnai-local", warranty:"7-year manufacturer warranty", units:[
      ["2.5kW",1700],["3.5kW",1850],["5.0kW",2300],["7.0kW",2600],["8.0kW",3000]
    ]},
    {name:"Daikin Cora", key:"daikin-lite-local", warranty:"5-year manufacturer warranty", units:[
      ["2.5kW",2000],["3.5kW",2200],["5.0kW",2650],["7.0kW",3200],["8.0kW",3650],["9.0kW",4100]
    ]}
  ];
  var currency = function (n) {return "$" + n.toLocaleString("en-AU");};
  var css = ".sp-deals-refresh{font-family:Inter,system-ui,-apple-system,sans-serif;background:#fff;color:#121923;padding:58px 0 40px;scroll-margin-top:110px}.sp-deals-refresh *{box-sizing:border-box}.sp-deals-refresh .wrap{width:min(1120px,calc(100% - 36px));margin:auto}.sp-deals-refresh .eyebrow{color:#83602b;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.16em}.sp-deals-refresh h2{font:600 clamp(32px,4.5vw,54px)/1.08 Georgia,serif;letter-spacing:-.03em;margin:9px 0 10px}.sp-deals-refresh .sub{font-size:15px;color:#4f5660;line-height:1.6;max-width:800px}.sp-deals-refresh .lead{display:flex;align-items:end;justify-content:space-between;gap:20px;flex-wrap:wrap}.sp-deals-refresh .lead a{background:#121923;color:#fff;padding:12px 18px;border-radius:6px;font-size:13px;font-weight:800}.sp-deals-refresh .lead a:hover{background:#303f56}.sp-deals-refresh .brands{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px;margin-top:33px}.sp-deals-refresh .brand{border-top:4px solid #c8a46a;padding-top:16px}.sp-deals-refresh .brand-top{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.sp-deals-refresh .brand h3{font:600 27px/1.15 Georgia,serif;margin:0}.sp-deals-refresh .brand .warranty{color:#666;font-size:11px;margin:8px 0 11px}.sp-deals-refresh .unit{border-bottom:1px solid #e5e1d9;padding:12px 0}.sp-deals-refresh .unit-top{display:flex;justify-content:space-between;align-items:center;gap:12px}.sp-deals-refresh .size{font-size:15px;font-weight:750}.sp-deals-refresh .price{font-size:26px;letter-spacing:-.04em;font-weight:850;color:#101820;font-variant-numeric:tabular-nums}.sp-deals-refresh .unit-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px;flex-wrap:wrap}.sp-deals-refresh .unit-actions a{font-size:12px;font-weight:800;text-decoration:none}.sp-deals-refresh .book{color:#8b642f}.sp-deals-refresh .finance{color:#08778d;text-decoration:underline!important;text-underline-offset:3px}.sp-deals-refresh a:focus-visible{outline:3px solid #088ca7;outline-offset:3px}.sp-deals-refresh .payments{background:#eef8fa;padding:20px 24px;margin-top:29px;border-left:4px solid #087d94}.sp-deals-refresh .payments strong{font-size:18px}.sp-deals-refresh .payments .method{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0}.sp-deals-refresh .payments .method span{font-size:12px;font-weight:800;background:white;border-radius:4px;padding:7px 10px;color:#163549}.sp-deals-refresh .payments p{font-size:12px;color:#374b55;line-height:1.55;margin:9px 0}.sp-deals-refresh .payments a{display:inline-block;color:#003f58;font-size:13px;font-weight:800;text-decoration:underline;text-underline-offset:3px}.sp-deals-refresh .conditions{font-size:12px;color:#5b6068;line-height:1.65;margin-top:18px}.sp-deals-refresh .conditions strong{color:#222}.sp-deals-refresh .legal{color:#717780;font-size:11px;line-height:1.55;margin-top:10px}@media(max-width:700px){.sp-deals-refresh{padding:35px 0}.sp-deals-refresh .brands{grid-template-columns:1fr;gap:34px;margin-top:24px}.sp-deals-refresh .brand h3{font-size:26px}.sp-deals-refresh .price{font-size:25px}.sp-deals-refresh .payments{padding:17px 15px}.sp-deals-refresh .lead a{width:100%;text-align:center}}";
  function mount() {
    var old = document.querySelector('[data-testid="compact-installed-price-picker"]');
    if (!old || document.getElementById("sp-live-deals-revamp")) return;
    var style = document.createElement("style");
    style.id = "sp-live-deals-style";
    style.textContent = css;
    document.head.appendChild(style);
    var section = document.createElement("section");
    section.id = "sp-live-deals-revamp";
    section.className = "sp-deals-refresh";
    section.setAttribute("aria-label","Current air conditioner prices and ways to pay");
    section.setAttribute("data-testid","live-deals-prices-payment");
    var parts = [
      '<div class="wrap"><div class="lead"><div>',
      '<div class="eyebrow">SplitsPro · New deals · Sydney, Central Coast &amp; Wollongong</div>',
      '<h2>New installed prices.<br>More ways to pay.</h2>',
      '<p class="sub">No guessing, no chasing trades. Pick your aircon below and choose to book at the advertised installed price or explore instalment payments for the unit.</p>',
      '</div><a href="#sp-pay-later">See pay-later options ↓</a></div><div class="brands">'
    ];
    groups.forEach(function(group){
      parts.push('<div class="brand"><div class="brand-top"><h3>' + group.name + '</h3><span class="eyebrow">Installed</span></div><p class="warranty">' + group.warranty + ' · Installation guarantee · 2-day installation offer*</p>');
      group.units.forEach(function(unit){
        var size=unit[0], price=unit[1], product=encodeURIComponent(group.key), sizeQ=encodeURIComponent(size);
        var booking="/book-installation?product="+product+"&size="+sizeQ;
        var finance="/payment-options?product="+product+"&size="+sizeQ;
        parts.push('<div class="unit"><div class="unit-top"><span class="size">'+size+'</span><strong class="price">'+currency(price)+'</strong></div><div class="unit-actions"><a class="book" href="'+booking+'">Book installed ↗</a><a class="finance" href="'+finance+'">Pay-later options →</a></div></div>');
      });
      parts.push('</div>');
    });
    parts.push('</div><div class="payments" id="sp-pay-later"><strong>Buy now. Pay later. Stay cool.</strong>',
      '<div class="method"><span>Afterpay</span><span>Klarna</span><span>Zip</span><span>Cards via Stripe</span><span>PayPal Pay in 4*</span></div>',
      '<p><strong>Stripe</strong> handles the available card, Afterpay, Klarna and Zip options through your secure checkout. <strong>PayPal</strong> is a separate checkout, and PayPal Pay in 4 is only offered for eligible air conditioners priced at $2,000 or less. Not every option is available for every purchase.</p>',
      '<a href="/payment-options?product=rinnai-local&size=2.5kW">Choose a unit and view payment options →</a>',
      '<p>Payment plans apply to the equipment purchase where offered; installation is selected by default on the payment page and is billed separately. Eligibility and approval are determined by your payment provider.</p></div>',
      '<p class="conditions"><strong>Our “No More to Pay” installation model:</strong> advertised supplied-and-installed prices include the air conditioner, labour, commissioning, up to <strong>3m of refrigeration pipework</strong>, a suitable wall bracket/floor placement, an isolator, and up to <strong>20m of electrical cable and a dedicated circuit from the switchboard where required</strong>. Extra or non-standard work is quoted before proceeding.</p>',
      '<p class="legal">*Subject to location, appointment availability and qualifying installation conditions. Pay-later availability depends on the provider, purchase amount and approval. Installed price is not the equipment-only finance amount; separate pricing is confirmed before checkout.</p>',
      '</div>');
    section.innerHTML = parts.join("");
    old.parentNode.insertBefore(section, old);
    // The compact React price picker is superseded by this clearer selector.
    // Do not touch the installation booking or payment system.
    old.style.display="none";
    old.removeAttribute("id");
    section.id = "installed-prices";
    section.dataset.liveDealsRevamp = "1";
    // Keep a stable marker when the id belongs to the published anchor.
    section.setAttribute("data-live-revamp","1");
  }
  var tries=0;
  var watcher=new MutationObserver(function(){
    mount();
    tries++;
    if(document.getElementById("installed-prices")?.dataset.liveRevamp==="1" || tries>450){watcher.disconnect();}
  });
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){mount();watcher.observe(document.body,{childList:true,subtree:true});});
  else {mount();watcher.observe(document.body,{childList:true,subtree:true});}
})();