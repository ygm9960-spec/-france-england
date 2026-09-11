(()=>{
  'use strict';
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(window.__SUN_KING_V021_FLOW__)return;
    window.__SUN_KING_V021_FLOW__=true;

    const $=s=>document.querySelector(s);
    const story=$('#storyScreen');
    const stage=$('#stage');
    const panel=$('#dialoguePanel');
    const text=$('#dialogueText');
    const sceneLabel=$('#sceneLabel');
    const speaker=$('#speakerName');
    const specialLayer=$('#specialLayer');
    const specialImage=$('#specialImage');
    const specialLabel=$('#specialLabel');
    const sceneTransition=$('#sceneTransition');
    if(!story||!stage||!panel||!text||!sceneLabel)return;

    const sceneNumber=()=>{
      const m=String(sceneLabel.textContent||'').match(/SCENE\s*(\d+)/i);
      return m?Number(m[1]):0;
    };

    // ---------- Fullscreen / landscape ----------
    async function enterFullscreen(){
      try{
        if(!document.fullscreenElement){
          const root=document.documentElement;
          if(root.requestFullscreen){
            try{await root.requestFullscreen({navigationUI:'hide'})}catch{await root.requestFullscreen()}
          }else if(root.webkitRequestFullscreen){root.webkitRequestFullscreen()}
        }
      }catch{}
      try{await screen.orientation?.lock?.('landscape')}catch{}
      setTimeout(()=>{try{window.scrollTo(0,1)}catch{}},80);
    }
    ['startBtn','continueBtn','restartBtn','endRestartBtn'].forEach(id=>{
      document.getElementById(id)?.addEventListener('click',enterFullscreen,{capture:true});
    });

    // ---------- Safer portrait layout: never sacrifice the top of the head ----------
    const metrics=window.PORTRAIT_METRICS;
    if(metrics){
      window.portraitFrames=function(cast,width,height){
        const known=cast.filter(e=>metrics[e.id]);
        if(!known.length)return cast.map(()=>null);
        const count=cast.length;
        const cap=count>=3?.40:count===2?.52:.60;
        const targetFace=Math.min(
          height*.165,
          ...known.map(e=>{const m=metrics[e.id];return width*cap*m[2]/m[0]})
        );
        const centers=count===1?{left:.50,center:.50,right:.50}:count===2?{left:.38,center:.50,right:.62}:{left:.29,center:.50,right:.71};
        const safeTop=8;
        const commonEye=Math.max(height*.29, safeTop + Math.max(...known.map(e=>metrics[e.id][3]*targetFace/metrics[e.id][2])));
        return cast.map(e=>{
          const m=metrics[e.id];if(!m)return null;
          const scale=targetFace/m[2];
          const w=m[0]*scale,h=m[1]*scale;
          const center=centers[e.slot]??.5;
          const top=Math.max(safeTop,commonEye-m[3]*scale);
          const left=Math.max(4,Math.min(width-w-4,width*center-m[4]*scale));
          return {id:e.id,width:w,height:h,left,top,face:targetFace};
        });
      };
    }

    // ---------- Opening narration: whole sentence, auto fade, no player skip ----------
    const openingBeats=[
      {text:'17세기 후반, 프랑스 베르사유 궁전.',hold:1350},
      {text:'유럽의 강력한 군주 가운데 한 명, 루이 14세. 사람들은 그를 태양왕이라 불렀다.',hold:2450},
      {text:'루이는 세금 징수와 국가 업무를 수행하는 관료제를 강화했다.',hold:2200}
    ];
    const openingOverlay=document.createElement('div');
    openingOverlay.id='flowOpeningOverlay';
    openingOverlay.setAttribute('aria-hidden','true');
    openingOverlay.innerHTML='<div class="flow-opening-text"></div>';
    story.append(openingOverlay);
    const openingText=openingOverlay.querySelector('.flow-opening-text');
    let openingBusy=false,openingKey='',openA=null,openB=null;

    function matchOpeningBeat(){
      if(sceneNumber()!==1||!panel.classList.contains('narration'))return null;
      const now=String(text.textContent||'').trim();
      if(!now)return null;
      for(let i=0;i<openingBeats.length;i++){
        const beat=openingBeats[i];
        if(beat.text===now||beat.text.startsWith(now))return {...beat,index:i};
      }
      return null;
    }
    function startOpeningBeat(){
      const beat=matchOpeningBeat();
      if(!beat)return;
      const key=`1:${beat.index}`;
      if(openingBusy||openingKey===key)return;
      openingBusy=true;openingKey=key;
      clearTimeout(openA);clearTimeout(openB);
      story.classList.add('flow-opening-auto');
      openingText.textContent=beat.text;
      openingOverlay.classList.remove('show','fade');
      openingOverlay.setAttribute('aria-hidden','false');
      // Finish the hidden native typewriter immediately; the visible line is our static overlay.
      panel.click();
      requestAnimationFrame(()=>requestAnimationFrame(()=>openingOverlay.classList.add('show')));
      openA=setTimeout(()=>{
        openingOverlay.classList.add('fade');
        openB=setTimeout(()=>{
          openingOverlay.classList.remove('show','fade');
          openingOverlay.setAttribute('aria-hidden','true');
          story.classList.remove('flow-opening-auto');
          openingBusy=false;
          panel.click();
        },380);
      },beat.hold);
    }
    new MutationObserver(startOpeningBeat).observe(text,{subtree:true,childList:true,characterData:true});
    ['pointerdown','click','touchend'].forEach(type=>story.addEventListener(type,e=>{
      if(story.classList.contains('flow-opening-auto')&&e.isTrusted){e.preventDefault();e.stopImmediatePropagation()}
    },true));

    // ---------- Tap anywhere on the story canvas ----------
    story.addEventListener('click',e=>{
      if(!e.isTrusted||!story.classList.contains('active')||story.classList.contains('flow-opening-auto'))return;
      if(e.target.closest('button,dialog,#dialoguePanel,#intertitleOverlay,#specialLayer,.icon-btn,.prop-layer,.flow-pinned-document'))return;
      panel.click();
    });

    // ---------- Persistent Fronde memory ----------
    let frondeLayer=null;
    function removeFronde(){frondeLayer?.remove();frondeLayer=null;story.classList.remove('flow-fronde-persistent')}
    function mountFronde(){
      if(frondeLayer||sceneNumber()!==2)return;
      const path=window.resolveSpecialMeta?.('young_louis_fronde')?.path||specialImage?.getAttribute('src');
      if(!path)return;
      frondeLayer=document.createElement('div');frondeLayer.className='flow-persistent-special';
      const img=document.createElement('img');img.src=path;img.alt='프롱드의 기억';frondeLayer.append(img);
      stage.append(frondeLayer);story.classList.add('flow-fronde-persistent');
    }
    if(specialLayer){
      new MutationObserver(()=>{
        if(sceneNumber()===2&&!specialLayer.classList.contains('hidden')&&String(specialLabel?.textContent||'').includes('프롱드'))mountFronde();
      }).observe(specialLayer,{subtree:true,childList:true,attributes:true,attributeFilter:['class','src']});
    }

    // ---------- Anne accession report remains for SCENE 04 ----------
    let anneDoc=null;
    function removeAnneDoc(){anneDoc?.remove();anneDoc=null;story.classList.remove('flow-anne-doc')}
    function mountAnneDoc(){
      if(anneDoc||sceneNumber()!==4)return;
      const meta=window.resolveDocumentMeta?.('anne_accession');if(!meta?.path)return;
      anneDoc=document.createElement('aside');anneDoc.className='flow-pinned-document';anneDoc.setAttribute('aria-hidden','true');
      anneDoc.innerHTML=`<img src="${meta.path}" alt=""><span>앤 여왕 즉위 보고서</span>`;
      stage.append(anneDoc);story.classList.add('flow-anne-doc');
    }

    // ---------- Scene transitions: remove redundant full-screen cards ----------
    let previousScene=sceneNumber();
    const bridgeScenes=new Set([5,13,14,18,20,26,28,37]);
    const majorScenes=new Set([29,35]);
    if(sceneTransition){
      new MutationObserver(()=>{
        if(sceneTransition.classList.contains('active')){
          sceneTransition.classList.remove('flow-transition-bridge','flow-transition-major','flow-transition-soft');
          if(bridgeScenes.has(previousScene))sceneTransition.classList.add('flow-transition-bridge');
          else if(majorScenes.has(previousScene))sceneTransition.classList.add('flow-transition-major');
          else sceneTransition.classList.add('flow-transition-soft');
        }else{
          sceneTransition.classList.remove('flow-transition-bridge','flow-transition-major','flow-transition-soft');
        }
      }).observe(sceneTransition,{attributes:true,attributeFilter:['class','data-kind']});
    }

    // ---------- Scene-level cleanup / persistent overlays ----------
    new MutationObserver(()=>{
      const now=sceneNumber();
      if(now!==previousScene){
        if(previousScene===2)removeFronde();
        if(previousScene===4)removeAnneDoc();
        previousScene=now;
        if(now===4)mountAnneDoc();
        requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
      }
    }).observe(sceneLabel,{subtree:true,childList:true,characterData:true});

    // When continuing directly into SCENE 04 from a saved game.
    if(sceneNumber()===4)mountAnneDoc();

    // ---------- Narration cleanup ----------
    // Action narration should read as scene description, not as a character named "장면".
    new MutationObserver(()=>{
      const isAction=panel.classList.contains('narration-action');
      story.classList.toggle('flow-action-narration',isAction);
      const isUnknown=panel.dataset.speakerGroup==='unknown';
      story.classList.toggle('flow-unknown-speaking',isUnknown);
    }).observe(panel,{attributes:true,attributeFilter:['class','data-speaker-group']});

    document.title='태양왕이 여왕이 되었다 · v0.21';
    const tag=document.querySelector('.version-tag');if(tag)tag.textContent='GAME / FULL FLOW INTEGRATED · v0.21';
  });
})();
