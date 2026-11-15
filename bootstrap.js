(() => {
  'use strict';
  const KEY='qia.pbz.language.v1',RESUME='qia.pbz.language.resume';
  let preference='system';
  try {preference=localStorage.getItem(KEY)||'system';}catch(_){}
  if(!['system','zh','en'].includes(preference))preference='system';
  const locale=preference==='system'?(/^zh/i.test(navigator.language)?'zh':'en'):preference,en=locale==='en';
  if(window.QiaNative?.setLanguage)window.QiaNative.setLanguage(locale);
  document.documentElement.lang=en?'en':'zh-Hans';document.title=en?'PBZ Routebook · 1.0':'影之刃零路书 · 正式版 1.0';
  const label=en?'Language':'语言';
  const options=()=>[['system',en?'Follow system':'跟随系统'],['zh','中文'],['en','English']].map(([v,l])=>`<option value="${v}" ${v===preference?'selected':''}>${l}</option>`).join('');
  window.PBZ={locale,
    languageButton:()=>`<button class="language-button" data-language-open aria-label="${label}">${en?'EN':'中'}<span aria-hidden="true">⌄</span></button>`,
    settingsCard:()=>`<section class="settings-card language-card"><h2>${label}</h2><label>${en?'Guide & interface':'攻略与界面'}<select class="language-select" aria-label="${label}">${options()}</select></label><p class="about-text">${en?'Switching keeps your checks, notes and reading position. Expand the original text to compare.':'切换后保留勾选、笔记和阅读位置。可展开中文原文对照。'}</p><p class="about-text" id="offline-status">${window.QiaNative?(en?'Guide and maps are bundled for offline use.':'攻略与地图已内置，可离线使用。'):(en?'Preparing offline files…':'正在准备离线文件…')}</p>${window.QiaNative?'':`<p class="about-text">${en?'iPhone: Safari → Share → Add to Home Screen. Export a backup before changing devices.':'iPhone：Safari → 分享 → 添加到主屏幕。换设备前请先导出备份。'}</p>`}</section>`,
    takeResume:()=>{try{const raw=sessionStorage.getItem(RESUME);sessionStorage.removeItem(RESUME);return raw?JSON.parse(raw):null;}catch(_){return null;}}
  };
  function switchTo(value){
    if(!['system','zh','en'].includes(value))return;
    try{localStorage.setItem(KEY,value);sessionStorage.setItem(RESUME,JSON.stringify(window.App?.snapshot()||{}));}
    catch(_){window.App?.notify(en?'Could not save language. Export a backup and check browser storage.':'语言设置无法保存，请导出备份并检查浏览器存储。');return;}
    location.reload();
  }
  document.addEventListener('change',e=>{if(e.target.matches('.language-select'))switchTo(e.target.value);});
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-language-open]')){
      const root=document.getElementById('language-modal');root.innerHTML=`<div class="overlay"><section class="dialog language-dialog" role="dialog" aria-modal="true" aria-label="${label}"><h2>${label}</h2><select class="language-select" aria-label="${label}">${options()}</select><p>${en?'Progress and notes stay on this device.':'勾选与笔记保留在本机。'}</p><button class="btn primary" data-language-close>${en?'Close':'关闭'}</button></section></div>`;root.querySelector('select').focus();
    }
    if(e.target.closest('[data-language-close]'))document.getElementById('language-modal').innerHTML='';
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('language-modal').innerHTML='';});
  function load(src){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=reject;document.body.appendChild(el);});}
  (async()=>{
    try{await load('data.'+locale+'.js');await load('app.'+locale+'.js');}
    catch(_){document.getElementById('app').textContent=en?'Could not load the guide. Reopen when connected.':'攻略未能加载，请联网后重新打开。';}
    if(!window.QiaNative&&'serviceWorker' in navigator&&location.protocol==='https:'){
      try{
        const registration=await navigator.serviceWorker.register('sw.js');
        const status=()=>{const e=document.getElementById('offline-status');if(e)e.textContent=navigator.serviceWorker.controller?(en?'Offline files ready. Export progress regularly.':'离线文件已就绪，请定期导出进度。'):(en?'Preparing offline files; keep this page open briefly.':'正在准备离线文件，请稍候再关闭页面。');};
        navigator.serviceWorker.addEventListener('controllerchange',status);new MutationObserver(status).observe(document.getElementById('app'),{childList:true});status();registration.update().catch(()=>{});
      }catch(_){const e=document.getElementById('offline-status');if(e)e.textContent=en?'Offline setup unavailable. Keep an exported backup.':'暂时无法启用离线缓存，请保留导出备份。';}
    }
  })();
})();
