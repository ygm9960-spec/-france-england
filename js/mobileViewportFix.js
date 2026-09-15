/* v0.42 - full viewport / clean title fix */
(()=>{
  'use strict';
  const root=document.documentElement;
  const $=q=>document.querySelector(q);
  document.title='태양왕이 여왕이 되었다 · v0.42';
  const versionTag=document.querySelector('.version-tag');
  if(versionTag)versionTag.textContent='GAME / FULL EVENT SCENE · v0.42';

  function syncViewport(){
    const vv=window.visualViewport;
    const h=Math.round(vv?.height||window.innerHeight||document.documentElement.clientHeight);
    const w=Math.round(vv?.width||window.innerWidth||document.documentElement.clientWidth);
    const top=Math.max(0,Math.round(vv?.offsetTop||0));
    root.style.setProperty('--app-h',`${h}px`);
    root.style.setProperty('--app-w',`${w}px`);
    root.style.setProperty('--viewport-top',`${top}px`);
    // Dialogue geometry follows the visible 16:9 artwork rather than the full
    // ultra-wide viewport, so the panel never stretches into side gutters.
    const hudH=h<=420?44:48;
    const stageH=Math.max(1,h-hudH);
    const artworkW=Math.min(w,stageH*(16/9));
    const dialogW=Math.max(280,Math.min(w-28,1100,artworkW*.82));
    root.style.setProperty('--story-art-w',`${Math.round(artworkW)}px`);
    root.style.setProperty('--dialog-w',`${Math.round(dialogW)}px`);
  }

  function fullscreenElement(){
    return document.fullscreenElement||document.webkitFullscreenElement||null;
  }

  function syncFullscreenLabels(){
    const active=!!fullscreenElement();
    const title=$('#fullscreenBtn');
    const menu=$('#menuFullscreen');
    if(title)title.textContent=active?'전체화면 종료':'전체화면';
    if(menu)menu.textContent=active?'전체화면 종료':'전체화면으로 보기';
    const story=$('#storyFullscreenBtn');
    if(story){story.setAttribute('aria-label',active?'전체화면 종료':'전체화면 전환');story.title=active?'전체화면 종료':'전체화면';}
  }

  function showFullscreenHint(){
    let toast=$('#fullscreenHintToast');
    if(!toast){
      toast=document.createElement('div');
      toast.id='fullscreenHintToast';
      Object.assign(toast.style,{
        position:'fixed',left:'50%',bottom:'max(18px, env(safe-area-inset-bottom))',transform:'translateX(-50%)',zIndex:'9999',
        maxWidth:'82vw',padding:'9px 14px',borderRadius:'999px',background:'rgba(7,9,13,.92)',color:'#eee9dd',
        border:'1px solid rgba(238,210,146,.28)',fontSize:'11px',textAlign:'center',boxShadow:'0 8px 28px rgba(0,0,0,.4)'
      });
      document.body.appendChild(toast);
    }
    toast.textContent='이 브라우저는 웹 전체화면을 제한합니다. 브라우저 메뉴의 “홈 화면에 추가”로 실행하면 화면을 더 넓게 사용할 수 있습니다.';
    toast.style.display='block';
    clearTimeout(showFullscreenHint.t);
    showFullscreenHint.t=setTimeout(()=>{toast.style.display='none'},3600);
  }

  async function enterFullscreen(){
    syncViewport();
    if(fullscreenElement())return true;
    try{
      const request=root.requestFullscreen||root.webkitRequestFullscreen;
      if(!request){root.classList.add('pseudo-fullscreen');showFullscreenHint();return false;}
      let result;
      try{result=request.call(root,{navigationUI:'hide'});}catch{result=request.call(root);}
      if(result&&typeof result.then==='function')await result;
      try{await screen.orientation?.lock?.('landscape')}catch{}
      root.classList.remove('pseudo-fullscreen');
      setTimeout(syncViewport,60);
      setTimeout(syncViewport,260);
      return true;
    }catch{
      root.classList.add('pseudo-fullscreen');
      showFullscreenHint();
      syncViewport();
      return false;
    }finally{
      syncFullscreenLabels();
    }
  }

  async function exitFullscreen(){
    try{
      const exit=document.exitFullscreen||document.webkitExitFullscreen;
      if(fullscreenElement()&&exit){const r=exit.call(document);if(r&&typeof r.then==='function')await r;}
    }catch{}
    root.classList.remove('pseudo-fullscreen');
    syncViewport();
    syncFullscreenLabels();
  }

  async function toggleFullscreen(e){
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if(fullscreenElement()||root.classList.contains('pseudo-fullscreen'))await exitFullscreen();
    else await enterFullscreen();
  }

  ['fullscreenBtn','storyFullscreenBtn','menuFullscreen'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener('click',toggleFullscreen,{passive:false});
  });

  // Fullscreen request is most reliable when fired directly from the first user gesture.
  const start=$('#startBtn'),cont=$('#continueBtn');
  [start,cont].forEach(btn=>btn?.addEventListener('pointerdown',()=>{if(!fullscreenElement())enterFullscreen()},{passive:true}));

  syncViewport();
  syncFullscreenLabels();
  window.visualViewport?.addEventListener('resize',syncViewport,{passive:true});
  window.visualViewport?.addEventListener('scroll',syncViewport,{passive:true});
  window.addEventListener('resize',syncViewport,{passive:true});
  window.addEventListener('orientationchange',()=>{syncViewport();setTimeout(syncViewport,120);setTimeout(syncViewport,420)},{passive:true});
  document.addEventListener('fullscreenchange',()=>{syncViewport();syncFullscreenLabels()});
  document.addEventListener('webkitfullscreenchange',()=>{syncViewport();syncFullscreenLabels()});
})();
