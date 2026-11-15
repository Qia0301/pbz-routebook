(() => {
  'use strict';
  // User-supplied QR codes, with personal photos blurred. Recipient payloads are verified unchanged.
  const methods = [
    {id:'wechat',zh:'微信支付',en:'WeChat Pay',mark:'微',image:'images/support/wechat.png',width:412,crop:[0,0,412],link:null},
    {id:'alipay',zh:'支付宝',en:'Alipay',mark:'支',image:'images/support/alipay.png',width:1148,crop:[0,0,1148],link:'https://qr.alipay.com/fkx14863i1rwcfatqxhto1b'},
    {id:'cashapp',zh:'Cash App',en:'Cash App',mark:'$',image:'images/support/cashapp.png',width:1144,crop:[0,0,1144],link:'https://cash.app/$QingyaWang7?qr=1'},
    {id:'paypal',zh:'PayPal',en:'PayPal',mark:'P',image:'images/support/paypal.png',width:900,crop:[0,0,900],link:'https://www.paypal.com/qrcodes/p2pqrc/T7ZV59UDJMUHL'}
  ];
  const isEnglish=()=>window.PBZ?.locale==='en';
  const copy={
    zh:{eyebrow:'谢谢每一份心意',title:'这份攻略帮到你了？',body:'如果它帮你少绕了路、少漏了收集，可以请作者喝杯咖啡。你的支持，是作者继续查资料、补路线、做下一份攻略的动力。',foot:'随心支持，金额由你决定。谢谢每一份心意。',button:'支持作者',close:'返回我的',thanks:'谢谢你支持这份手搓攻略。',open:'打开收款页面',original:'查看大图',save:'保存收款码',note:'支持金额由你在支付 App 中填写。',scan:'用对应 App 扫描收款码。也可以在另一台设备上打开本页，再扫码支持。',wechat:'微信扫一扫可识别此收款码。同一部手机可先保存图片，再从微信扫一扫里选择相册。'},
    en:{eyebrow:'THANK YOU FOR YOUR SUPPORT',title:'Did this guide help you?',body:'If this guide saved you time or helped you find a missing collectible, consider buying the creator a coffee. Your support helps the creator keep improving this guide and make the next one.',foot:'Any amount is appreciated. Thank you for supporting the creator.',button:'Support the creator',close:'Back to My',thanks:'Thank you for supporting this handmade guide.',open:'Open payment page',original:'View larger code',save:'Save QR code',note:'Choose your own amount in the payment app.',scan:'Scan this code with the matching app. You can also open this page on another device to scan it.',wechat:'Scan with WeChat Pay. On the same phone, save the image first, then choose it from Photos in WeChat’s scanner.'}
  };
  let active=null,previousFocus=null;
  const root=()=>document.getElementById('support-modal');
  const wording=()=>copy[isEnglish()?'en':'zh'];
  const name=m=>m[isEnglish()?'en':'zh'];
  window.QiaSupport={
    card:()=>{const c=wording();return `<section class="settings-card support-card" aria-labelledby="support-title"><div class="support-eyebrow">${c.eyebrow}</div><h2 id="support-title">${c.title}</h2><p class="support-intro">${c.body}</p><div class="support-methods">${methods.map(m=>`<button class="support-method ${m.id}" data-support-method="${m.id}" aria-label="${c.button} · ${name(m)}"><span class="support-mark" aria-hidden="true">${m.mark}</span><span><strong>${name(m)}</strong><small>${c.button}</small></span><span class="support-chevron" aria-hidden="true">›</span></button>`).join('')}</div><p class="support-foot">${c.foot}</p></section>`;},
    close:()=>{if(!active)return false;active=null;root().innerHTML='';previousFocus?.focus?.();return true;}
  };
  function show(id){
    const m=methods.find(x=>x.id===id);if(!m)return;
    const c=wording();active=m;previousFocus=document.activeElement;
    const [x,y,size]=m.crop;
    const style=`width:${m.width/size*100}%;left:${-x/size*100}%;top:${-y/size*100}%;`;
    root().innerHTML=`<div class="overlay support-overlay"><section class="dialog support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-dialog-title"><div class="support-dialog-top"><span class="support-eyebrow">${isEnglish()?'SUPPORT THE CREATOR':'支持作者'}</span><button class="support-close" data-support-close aria-label="${c.close}">×</button></div><h2 id="support-dialog-title">${isEnglish()?'Support the creator with '+name(m):'用'+name(m)+'支持作者'}</h2><p class="support-thanks">${c.thanks}</p><div class="support-qr"><img src="${m.image}" style="${style}" alt="${name(m)} ${isEnglish()?'creator’s payment QR code':'作者提供的收款码'}" draggable="false"></div><p class="support-instruction">${m.id==='wechat'?c.wechat:c.scan}</p><div class="support-links">${m.link?`<a class="btn support-payment-link ${m.id}" href="${m.link}" target="_blank" rel="noopener noreferrer" data-support-payment="${m.id}">${c.open} ↗</a>`:''}<a class="btn" href="${m.image}" target="_blank" rel="noopener noreferrer" data-support-original="${m.id}">${c.original}</a><a class="btn" href="${m.image}" download="creator_${m.id}_QR.png" data-support-original="${m.id}">${c.save}</a></div><p class="support-foot">${c.note}</p></section></div>`;
    root().querySelector('[data-support-close]').focus();
  }
  document.addEventListener('click',e=>{
    const method=e.target.closest('[data-support-method]');if(method){show(method.dataset.supportMethod);return;}
    if(e.target.closest('[data-support-close]')){window.QiaSupport.close();return;}
    if(e.target.classList.contains('support-overlay')){window.QiaSupport.close();return;}
    const original=e.target.closest('[data-support-original]');
    if(original&&window.QiaNative?.shareSupportCode){e.preventDefault();window.QiaNative.shareSupportCode(original.dataset.supportOriginal);return;}
    const payment=e.target.closest('[data-support-payment]');
    if(payment&&window.QiaNative){e.preventDefault();window.QiaNative.openSource(methods.find(m=>m.id===payment.dataset.supportPayment).link);}
  });
  document.addEventListener('keydown',e=>{
    if(!active)return;
    if(e.key==='Escape'){e.preventDefault();window.QiaSupport.close();return;}
    if(e.key!=='Tab')return;
    const focusable=[...root().querySelectorAll('button,a[href]')],first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
})();
