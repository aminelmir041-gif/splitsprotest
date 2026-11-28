/* Catalogue reflects existing SplitsPro brand-page prices; no invented model identifiers. */
(function(){
  const catalog={"ranges":[{"brand":"Rinnai","range":"Inverter Split System","image":"/products/rinnai-px-indoor.webp","features":["HEPA filtration","Wi-Fi & voice","Human sensor","3D airflow"],"warranty":"7-year Rinnai residential warranty","sizes":[["2.5",1700],["3.5",1850],["5.0",2300],["7.1",2600]],"badges":["HEPA Filter"]},{"brand":"Daikin","range":"Cora","image":"/products/daikin-cora.png","features":["Quiet airflow","Enzyme Blue filter","Efficient R32"],"warranty":"5-year Daikin domestic warranty","sizes":[["2.5",2000],["3.5",2200],["5.0",2650],["7.1",3200],["8.0",3650],["9.0",4100]]},{"brand":"Daikin","range":"Alira X","image":"data:image/webp;base64,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","features":["Streamer air cleaning","Built-in Wi-Fi","Coanda airflow"],"warranty":"5-year Daikin domestic warranty","sizes":[["2.5",1990],["3.5",2290],["5.0",2890],["7.1",3390],["8.5",4250],["9.5",5100]],"badges":["Sensitive Choice program"]},{"brand":"Daikin","range":"Zena","image":"/products/zena-white-uploaded.webp","features":["Slim designer finish","Built-in Wi-Fi","Streamer"],"warranty":"5-year Daikin domestic warranty","sizes":[["2.5",2190,"FTXJ25TVMAW / K"],["3.5",2490,"FTXJ35TVMAW / K"],["5.0",3090,"FTXJ50TVMAW / K"],["6.0",3390,"FTXJ60TVMAW / K"]],"badges":["Sensitive Choice program"]},{"brand":"Mitsubishi Electric","range":"AP Series","image":"/products/mitsubishi-electric-ap-indoor.webp","features":["Ultra-quiet","Night mode","Dual Barrier Coating"],"warranty":"5-year Mitsubishi Electric residential warranty","sizes":[["2.5",1890],["3.5",2090],["5.0",2690],["7.1",3190]]},{"brand":"Mitsubishi Heavy Industries","range":"Ciara","image":"/products/mitsubishi-heavy-ciara-indoor.webp","features":["Built-in Wi-Fi","Voice compatible","Allergen Clear"],"warranty":"5-year MHI parts & labour warranty","sizes":[["2.0",1790],["2.5",1890],["3.3",2090],["5.0",2690],["6.3",2890],["7.1",2990]]},{"brand":"Fujitsu","range":"Lifestyle KMTC","image":"/products/fujitsu-kmtc-indoor.webp","features":["Human sensor","Economy mode","Super Quiet"],"warranty":"5-year GENERAL (Fujitsu) domestic warranty","sizes":[["2.5",1890,"ASTG09KMTC"],["3.5",2090,"ASTG12KMTC"],["5.0",2690,"ASTG18KMTC"],["6.0",2890,"ASTG22KMTC"],["7.1",2990,"ASTG24KMTC"]]},{"brand":"Samsung","range":"GEO WindFree","image":"/products/samsung-geo-windfree-indoor.webp","features":["WindFree cooling","SmartThings Wi-Fi","Freeze Wash"],"warranty":"5-year Samsung air conditioner warranty","sizes":[["2.5",1890,"AR09DXEANWKNSA"],["3.5",2090,"AR12DXEANWKNSA"],["5.0",2690,"AR18DXEANWKNSA"],["7.0",2990,"AR24DXEANWKNSA"],["8.0",3290,"AR30DXEANWKNSA"]]}],"metadata":{"roomRanges":{"2.0":"10–18 m²","2.5":"12–25 m²","3.3":"20–32 m²","3.5":"20–35 m²","5.0":"30–50 m²","6.0":"40–60 m²","6.3":"40–62 m²","7.0":"45–70 m²","7.1":"45–70 m²","8.0":"55–80 m²","9.0":"65–90 m²"}}};
  const tabs=document.getElementById('sp-brand-tabs');
  const modelTabs=document.getElementById('sp-model-tabs');
  const viewport=document.getElementById('sp-products-viewport');
  const track=document.getElementById('sp-products-track');
  const title=document.getElementById('sp-selected-brand-title');
  const progress=document.getElementById('sp-slide-progress');
  const prev=document.getElementById('sp-prices-prev');
  const next=document.getElementById('sp-prices-next');
  if(!tabs||!viewport||!track||!prev||!next)return;
  let current='Rinnai',items=[];
  const money=(n)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(n);
  const enc=(v)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const room=(kw)=>catalog.metadata.roomRanges[kw]||'Ask us';
  const sydneyRatings={"ASTG09KMTC": ["AOTG09KMTC", 5, 3], "ASTG12KMTC": ["AOTG12KMTC", 4.5, 3], "ASTG18KMTC": ["AOTG18KMTC", 4.5, 2.5], "ASTG22KMTC": ["AOTG22KMTC", 4, 2.5], "ASTG24KMTC": ["AOTG24KMTC", 3.5, 2.5], "FTXJ25TVMAW / K": ["RXJ25TVMA", 3.5, 3], "FTXJ35TVMAW / K": ["RXJ35TVMA", 3.5, 2.5], "FTXJ50TVMAW / K": ["RXJ50TVMA", 3, 2.5], "FTXJ60TVMAW / K": ["RXJ60TVMA", 2.5, 2.5]};
  function card(range,size){
    const kw=size[0],price=size[1],model=size[2];
    const replacing=Math.round(price*.85);
    const label=(range.manufacturer||range.brand)+' '+range.range;
    const productTitle=enc(label+' '+kw+' kW');
    const modelInfo=model?'Model '+enc(model):'Exact model confirmed on consultation';
    const rating=sydneyRatings[model];
    const energy=rating
      ? '<span class="sp-energy" title="Outdoor unit '+enc(rating[0])+'">Sydney · Cooling '+rating[1]+' ★ · Heating '+rating[2]+' ★</span>'
      : '<small class="sp-rating-note">Sydney energy rating to be confirmed with the exact model pair.</small>';
    const features=range.features.slice(0,3).map(feature=>'<span>'+enc(feature)+'</span>').join('');
    const badges=(range.badges||[]).map(badge=>'<span class="sp-product-special-tag">'+enc(badge)+'</span>').join('');
    const roomText=room(kw)==='Ask us'?'Room sizing to be confirmed':'Approx. '+enc(room(kw))+' room';
    const target=document.getElementById('consult-form') ? '#consult-form' :
      '/split-system-installation-sydney/?'+new URLSearchParams({brand:range.brand,range:range.range,capacity:kw})+'#consult-form';
    return '<article class="sp-product-card" aria-label="'+productTitle+' fully installed prices">'+
      '<div class="sp-product-top"><div><span class="sp-product-maker">'+enc(range.manufacturer||range.brand)+'</span><strong class="sp-product-series">'+enc(range.range)+'</strong></div><span class="sp-product-saving">SAVE 15% ON REPLACEMENTS*</span></div>'+
      '<div class="sp-product-image"><img src="'+range.image+'" alt="'+enc(label)+' indoor split-system unit" loading="lazy" fetchpriority="low" decoding="async"></div>'+
      '<div class="sp-product-body"><span class="sp-product-model">'+modelInfo+'</span>'+energy+'<h3 class="sp-product-size">'+enc(kw)+' kW cooling</h3>'+
      '<div class="sp-product-facts"><span>'+roomText+'</span>'+features+'</div>'+
      (badges?'<div class="sp-product-special-tags">'+badges+'</div>':'')+
      '<p class="sp-product-warranty">✓ '+enc(range.warranty)+'*</p>'+
      '<div class="sp-product-prices"><div><span class="sp-price-label">Fully installed</span><strong>'+money(price)+'</strong><small>standard installation</small></div>'+
      '<div class="sp-replacement-price"><span class="sp-price-label">Eligible replacement*</span><strong>'+money(replacing)+'</strong><small>15% saving</small></div></div>'+
      '<a class="sp-product-cta" href="'+enc(target)+'" data-sp-product="'+productTitle+'" data-sp-capacity="'+enc(kw)+'" data-sp-price="'+price+'" data-sp-replacement="'+replacing+'">Ask about this offer</a></div></article>';
  }
  function update(){
    const children=Array.from(track.children);
    const first=children[0],step=first?first.getBoundingClientRect().width+15:300;
    const index=Math.max(0,Math.min(children.length-1,Math.round(viewport.scrollLeft/step)));
    progress.textContent=children.length?(index+1)+' of '+children.length+' units · swipe to compare':'No prices currently listed';
    prev.disabled=viewport.scrollLeft<5;
    next.disabled=viewport.scrollLeft+viewport.clientWidth>=viewport.scrollWidth-6;
  }
  function render(brand,rangeName){
    current=brand;
    tabs.querySelectorAll('button[data-brand]').forEach(b=>{const selected=b.dataset.brand===brand;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected));});
    const filtered=catalog.ranges.filter(r=>r.brand===brand);
    const chosen=filtered.find(r=>r.range===rangeName)||filtered[0];
    if(!chosen){modelTabs.innerHTML='';track.innerHTML='';title.textContent='No models available';update();return;}
    modelTabs.innerHTML=filtered.map(r=>'<button type="button" class="sp-model-tab'+(r===chosen?' is-active':'')+'" data-range="'+enc(r.range)+'" aria-pressed="'+String(r===chosen)+'">'+enc(r.range)+'</button>').join('');
    items=chosen.sizes.map(size=>({range:chosen,size}));
    title.textContent=(chosen.manufacturer||brand)+' · '+chosen.range+' · '+items.length+' prices';
    track.innerHTML=items.map(row=>card(row.range,row.size)).join('');
    viewport.scrollLeft=0;
    requestAnimationFrame(update);
  }
  tabs.addEventListener('click',event=>{const b=event.target.closest('button[data-brand]');if(b)render(b.dataset.brand);});
  modelTabs.addEventListener('click',event=>{const b=event.target.closest('button[data-range]');if(!b)return;render(current,b.dataset.range);modelTabs.querySelectorAll('button[data-range]').forEach(button=>{if(button.dataset.range===b.dataset.range)button.focus({preventScroll:true});});});
  prev.addEventListener('click',()=>{viewport.scrollBy({left:-Math.round(viewport.clientWidth*.92),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
  next.addEventListener('click',()=>{viewport.scrollBy({left:Math.round(viewport.clientWidth*.92),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
  viewport.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});
  window.addEventListener('resize',update);
  track.addEventListener('click',event=>{
    const link=event.target.closest('[data-sp-product]');
    if(!link)return;
    const form=document.getElementById('consult-form');
    if(!form)return;
    const service=form.querySelector('select[name="service"]');
    const message=form.querySelector('input[name="message"]');
    if(service)service.value='Split System Installation';
    if(message)message.value='Please contact me about '+link.dataset.spProduct+'. Standard installed price '+money(Number(link.dataset.spPrice))+'. Eligible replacement offer '+money(Number(link.dataset.spReplacement))+' (subject to site and existing electrical suitability).';
  });
  document.getElementById('split-features')?.addEventListener('click', event => {
    const link = event.target.closest('a[data-compare-brand]');
    if (link) render(link.dataset.compareBrand, link.dataset.compareRange);
  });
  render(current);
  const query=new URLSearchParams(location.search);
  if(location.hash==='#consult-form' && query.has('capacity') && catalog.ranges.some(r=>r.brand===query.get('brand') && r.range===query.get('range'))){
    render(query.get('brand'),query.get('range'));
    const offer=Array.from(track.querySelectorAll('[data-sp-capacity]')).find(link=>link.dataset.spCapacity===query.get('capacity'));
    if(offer)document.addEventListener('DOMContentLoaded',()=>offer.click(),{once:true});
  }
})();
