/* SplitsPro: PayPal Pay in 4 is reserved for deals <= $2,000 and equipment purchases below $2,000. */
(function(){
  "use strict";
  function sync(){
    var model=document.getElementById("finance-model");
    if(!model || !model.selectedOptions.length) return;
    var label=model.selectedOptions[0].textContent||"";
    var matched=label.match(/\$([\d,]+)\s+installed/i);
    if(!matched) return;
    var installed=Number(matched[1].replace(/,/g,""));
    var option=document.querySelector('[data-testid="finance-method-paypal"]');
    if(!option) return;
    var hide=installed>2000;
    if(hide && option.getAttribute("aria-checked")==="true"){
      var stripe=document.querySelector('[data-testid="finance-method-stripe"]');
      if(stripe) stripe.click();
    }
    var display=hide?"none":"";
    if(option.style.display!==display)option.style.display=display;
    var text=option.querySelector("span:last-child span");
    if(text && !text.dataset.spPayPalRule){
      text.dataset.spPayPalRule="1";
      text.textContent="Eligible equipment purchases under $2,000; installed deal must be $2,000 or less";
    }
  }
  var observer=new MutationObserver(sync);
  function start(){
    sync();
    // React can mount after DOMContentLoaded, so watch the root for the selector.
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["aria-checked"]});
    document.addEventListener("change",function(event){if(event.target && event.target.id==="finance-model")sync();},true);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);
  else start();
})();