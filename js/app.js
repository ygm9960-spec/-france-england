(()=>{
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const APP_VERSION='v0.48';
  const STORAGE_KEY='sun-king-queen-v0.27'; // preserve existing classroom progress
  const LEGACY_KEYS=['sun-king-queen-v0.26','sun-king-queen-v0.25','sun-king-queen-v0.24','sun-king-queen-v0.23','sun-king-queen-v0.22','sun-king-queen-v0.21','sun-king-queen-v0.20','sun-king-queen-v0.19','sun-king-queen-v0.18','sun-king-queen-v0.17','sun-king-queen-v0.16','sun-king-queen-v0.15','sun-king-queen-v0.14','sun-king-queen-v0.13','sun-king-queen-v0.12','sun-king-queen-v0.11','sun-king-queen-v0.10','sun-king-queen-v0.9','sun-king-queen-v0.8','sun-king-queen-v0.7','sun-king-queen-v0.6','sun-king-queen-v0.5','sun-king-queen-v0.4','sun-king-queen-v0.3','sun-king-queen-v0.2'];
  const TOTAL_BULLETS=LOGIC_BULLETS.length;
  const HISTORY_LIMIT=500;

  const screens={
    title:$('#titleScreen'),story:$('#storyScreen'),debate:$('#debateScreen'),end:$('#endScreen')
  };
  const els={
    continue:$('#continueBtn'),start:$('#startBtn'),restart:$('#restartBtn'),music:$('#musicBtn'),sound:$('#soundBtn'),
    chapter:$('#chapterLabel'),scene:$('#sceneLabel'),progress:$('#progressBar'),stage:$('#stage'),sceneBackground:$('#sceneBackground'),place:$('#placeCard'),
    actorLayer:$('#actorLayer'),panel:$('#dialoguePanel'),lineMode:$('#lineMode'),speaker:$('#speakerName'),text:$('#dialogueText'),hint:$('#nextHint'),
    sun:$('#sunOverlay'),finalBulletBadge:$('#finalBulletBadge'),
    intertitle:$('#intertitleOverlay'),interKicker:$('#intertitleKicker'),interTitle:$('#intertitleTitle'),interSub:$('#intertitleSubtitle'),
    debateNumber:$('#debateNumber'),debateTopic:$('#debateTopic'),count:$('#bulletCount'),arena:$('#debateArena'),rail:$('#statementRail'),statement:$('#statementText'),debatePrompt:$('#debatePrompt'),aim:$('#aimPulse'),impact:$('#impactText'),deck:$('#bulletDeck'),
    rebuttal:$('#debateRebuttal'),rebuttalLabel:$('#rebuttalLabel'),rebuttalTitle:$('#rebuttalTitle'),rebuttalLogic:$('#rebuttalLogic'),rebuttalText:$('#rebuttalText'),rebuttalNext:$('#rebuttalNext'),
    history:$('#historyDialog'),historyList:$('#historyList'),concept:$('#conceptDialog'),conceptList:$('#conceptList'),menu:$('#menuDialog'),menuMusic:$('#menuMusic'),
    teacher:$('#teacherDialog'),teacherNav:$('#teacherNav'),teacherDebug:$('#teacherDebug'),teacherPreviewBadge:$('#teacherPreviewBadge'),
    teacherExitPreview:$('#teacherExitPreview'),teacherCacheRefresh:$('#teacherCacheRefresh'),
    propLayer:$('#propLayer'),propCard:$('#propCard'),propImage:$('#propImage'),propFallback:$('#propFallback'),
    specialLayer:$('#specialLayer'),specialImage:$('#specialImage'),specialLabel:$('#specialLabel'),specialContinue:$('#specialContinue'),flashbackLayer:$('#flashbackLayer'),flashbackImage:$('#flashbackImage'),flashbackFallback:$('#flashbackFallback'),flashbackLabel:$('#flashbackLabel'),finalLockFx:$('#finalLockFx'),sunImage:$('#sunEmblemImage'),
    loadedBullet:$('#loadedBullet'),shotTrail:$('#shotTrail'),debateAnneImage:$('#debateAnneImage'),debateMpImage:$('#debateMpImage'),debateTutorial:$('#debateTutorial'),tutorialStartBtn:$('#tutorialStartBtn'),
    teacherFastToggle:$('#teacherFastToggle'),teacherTutorialPreview:$('#teacherTutorialPreview'),teacherCopyLocation:$('#teacherCopyLocation'),
    openingOverlay:$('#openingNarrationOverlay'),openingText:$('#openingNarrationText'),persistentSceneLayer:$('#persistentSceneLayer'),persistentSceneImage:$('#persistentSceneImage'),pinnedSceneDoc:$('#pinnedSceneDoc'),pinnedSceneDocImage:$('#pinnedSceneDocImage'),pinnedSceneDocLabel:$('#pinnedSceneDocLabel'),conceptToast:$('#conceptAcquireToast'),actionBeatOverlay:$('#actionBeatOverlay'),actionBeatText:$('#actionBeatText'),sceneFadeOverlay:$('#sceneFadeOverlay'),sceneFadeLabel:$('#sceneFadeLabel')
  };

  const baseState=()=>({
    version:31,started:false,sceneIndex:0,lineIndex:0,usedBullets:[],unlockedConcepts:[],debate:null,history:[],haptics:true,audio:{enabled:true,volume:.58},debateTutorialSeen:false,endingSeen:false
  });

  let teacherPreviewMode=false;
  let teacherSnapshot=null;
  let state=load();
  let typing=null;
  let busy=false;
  let directionTimer=null;
  let tapCount=0,tapTimer=null;
  let beforeBeatKey=null,afterBeatKey=null;
  let teacherFastMode=false;
  let finalLockScenePlayed=null;
  let specialTimer=null,specialReadyTimer=null,specialDone=null,specialReady=false,flashbackDone=null;
  let openingTimerA=null,openingTimerB=null,conceptToastTimer=null,propHideTimer=null,propExitTimer=null,propReleaseTimer=null,actionBeatTimerA=null,actionBeatTimerB=null,sceneEntryTimer=null,sceneExitTimer=null,pendingSceneEntryHold=0,debateReadTimer=null,debateReadKey=null,debateReadLocked=false,debateExitTimer=null;
  let lastStoryInputAt=0;
  const assetPreloadCache=new Map();

  function clone(v){return JSON.parse(JSON.stringify(v))}
  function readRawState(){
    for(const key of [STORAGE_KEY,...LEGACY_KEYS]){
      const raw=localStorage.getItem(key);
      if(raw)return {key,raw};
    }
    return null;
  }
  function normalizeState(raw={}){
    const merged=Object.assign(baseState(),raw);
    if(!Array.isArray(merged.usedBullets))merged.usedBullets=[];
    if(!Array.isArray(merged.unlockedConcepts))merged.unlockedConcepts=[];
    if(!Array.isArray(merged.history))merged.history=[];
    merged.history=merged.history.slice(-HISTORY_LIMIT);
    if(merged.debate)merged.debate=Object.assign({round:0,wrong:0,phase:'aim',selected:null},merged.debate);
    if(!merged.audio||typeof merged.audio!=='object')merged.audio={enabled:true,volume:.58};
    merged.audio.enabled=merged.audio.enabled!==false;
    merged.audio.volume=Math.max(0,Math.min(1,Number(merged.audio.volume??.58)));
    merged.debateTutorialSeen=!!merged.debateTutorialSeen;
    merged.sceneIndex=Math.max(0,Math.min(STORY_DATA.length,Number(merged.sceneIndex)||0));
    if(merged.sceneIndex<STORY_DATA.length){
      const scene=STORY_DATA[merged.sceneIndex];
      merged.lineIndex=Math.max(0,Math.min(scene.lines.length,Number(merged.lineIndex)||0));
      const line=scene.lines[merged.lineIndex];
      if(merged.debate){
        const d=DEBATE_DATA?.[merged.debate.id];
        const validLine=line?.type==='debate'&&line.debateId===merged.debate.id;
        if(!d||!validLine)merged.debate=null;
        else{
          merged.debate.round=Math.max(0,Math.min(d.rounds.length-1,Number(merged.debate.round)||0));
          if(!['aim','rebuttal','clear'].includes(merged.debate.phase))merged.debate.phase='aim';
          merged.debate.selected=null; // never resume with a stale armed shot
          merged.debate.wrong=Math.max(0,Number(merged.debate.wrong)||0);
        }
      }
    }else{merged.lineIndex=0;merged.debate=null;merged.endingSeen=true;}
    merged.version=28;
    return merged;
  }
  function load(){
    try{
      const found=readRawState();
      return normalizeState(found?JSON.parse(found.raw):{});
    }catch{return baseState()}
  }
  function save(force=false){
    if(!teacherPreviewMode||force){
      try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}
    }
    updateTitle();
    updateTeacherPreviewBadge();
  }
  function clearPersistent(){
    try{localStorage.removeItem(STORAGE_KEY);LEGACY_KEYS.forEach(k=>localStorage.removeItem(k))}catch{}
  }
  function reset(){
    clearTyping();clearDirectionTimer();clearSpecialState();clearOpeningNarration();hidePersistentSceneVisual();hidePinnedSceneDoc();screens.story?.classList.remove('ending-fade','opening-black','unknown-voice-mode','eye-opening','event-backdrop-mode','dream-memory-mode');els.sceneFadeOverlay?.classList.add('hidden');hideConceptToast();clearActionBeat();hideProp({immediate:true});clearDebateReadWindow();if(propReleaseTimer)clearTimeout(propReleaseTimer);propReleaseTimer=null;if(sceneEntryTimer)clearTimeout(sceneEntryTimer);if(sceneExitTimer)clearTimeout(sceneExitTimer);if(debateExitTimer)clearTimeout(debateExitTimer);sceneEntryTimer=null;sceneExitTimer=null;debateExitTimer=null;pendingSceneEntryHold=0;
    if(!teacherPreviewMode)clearPersistent();
    const keepHaptics=state?.haptics!==false;const keepAudio=clone(state?.audio||{enabled:true,volume:.58});
    AudioManager?.stopAll?.();state=baseState();state.haptics=keepHaptics;state.audio=keepAudio;busy=false;beforeBeatKey=null;afterBeatKey=null;updateTitle();
  }
  function haptic(pattern=8){if(state.haptics&&navigator.vibrate)navigator.vibrate(pattern)}
  function qaDelay(ms){return teacherPreviewMode&&teacherFastMode?Math.max(12,Math.round(ms*.08)):ms}

  // v0.27 CONTINUITY & IMMERSION PASS ----------------------------------
  const HISTORY_NARRATION_KEYS=new Set(['scene-22:0']);
  const ATMOSPHERE_HINT=/며칠|아침|오전|저녁|밤|늦은 밤|새벽|식탁|집무실|왕궁|왕좌실|거울의 방|촛불|정적|침묵|눈부신 빛|꿈|복도|의회 중앙|의회에 들어서기 전|돌아온|돌아와|방으로 돌아온/;
  function narrationTier(line){
    if(!line||line.type!=='narration')return 'none';
    const text=String(line.text||''),actionKey=!!ACTION_NARRATION_KEYS?.has(lineKey());
    if(HISTORY_NARRATION_KEYS.has(lineKey())||text.length>=96)return 'history';
    if((state.lineIndex===0&&text.length<=95)||ATMOSPHERE_HINT.test(text))return 'atmosphere';
    if(actionKey)return 'action';
    return 'history';
  }
  function keyQuietTiming(line){
    const t=String(line?.text||'');
    if(!isKeyLine(t))return null;
    if(t.includes('그리고 영국은 왕도 처형했습니다.'))return {before:420,after:1250};
    if(t.includes('그건 프랑스입니다.'))return null;
    if(t.includes('짐이 곧 국가다!'))return {before:300,after:760};
    if(t.includes('짐은 태양이다!'))return {before:280,after:520};
    if(t.includes('국가는 왕 한 사람보다 큽니다.'))return {before:320,after:650};
    if(t.includes('하늘 없이 혼자 뜨는 것은 아니었군.'))return {before:300,after:1400};
    if(t.includes('태양도…'))return {before:240,after:700};
    return {before:220,after:460};
  }
  function sceneOutroHoldFor(from,to){
    if(!from||!to||teacherPreviewMode&&teacherFastMode)return 0;
    if(from.chapter==='FINAL'||from.chapter==='REALIZATION'||String(from.chapter||'').includes('MEMORY')||from.tone==='dream')return 360;
    if(from.id==='scene-40')return 0;
    return 240;
  }
  function clearOpeningNarration(){
    if(openingTimerA)clearTimeout(openingTimerA);if(openingTimerB)clearTimeout(openingTimerB);openingTimerA=null;openingTimerB=null;
    els.openingOverlay?.classList.add('hidden');els.openingOverlay?.classList.remove('show','fade');els.openingOverlay?.setAttribute('aria-hidden','true');
  }
  function isOpeningAutoLine(line){return currentScene()?.id==='scene-01'&&line?.type==='narration'&&state.lineIndex>=0&&state.lineIndex<=2}
  function openingHoldFor(index){return [1350,2450,2200][index]||1800}
  function requestFullscreenSafe(){
    try{
      const root=document.documentElement;
      if(!document.fullscreenElement&&root.requestFullscreen){
        let promise;try{promise=root.requestFullscreen({navigationUI:'hide'})}catch{promise=root.requestFullscreen()}
        Promise.resolve(promise).then(()=>{try{const q=screen.orientation?.lock?.('landscape');q?.catch?.(()=>{})}catch{}}).catch(()=>{});
      }else if(!document.fullscreenElement&&root.webkitRequestFullscreen){try{root.webkitRequestFullscreen()}catch{}}
    }catch{}
    setTimeout(()=>{try{window.scrollTo(0,1)}catch{}},80);
  }
  function hidePersistentSceneVisual(){
    els.persistentSceneLayer?.classList.add('hidden');els.persistentSceneLayer?.setAttribute('aria-hidden','true');
    els.persistentSceneImage?.classList.remove('event-visual-ready');
    if(els.persistentSceneImage)els.persistentSceneImage.removeAttribute('src');if(els.persistentSceneLayer)delete els.persistentSceneLayer.dataset.memoryKind;
  }
  function showPersistentSceneVisual(key){
    const meta=resolveSpecialMeta?.(key);if(!meta?.path||!els.persistentSceneLayer||!els.persistentSceneImage)return false;
    els.persistentSceneImage.classList.remove('event-visual-ready');
    els.persistentSceneLayer.dataset.memoryKind=key==='young_louis_fronde'?'fronde':key;
    els.persistentSceneLayer.classList.remove('hidden');els.persistentSceneLayer.setAttribute('aria-hidden','false');
    setResilientImage(els.persistentSceneImage,meta.path,{onLoad:()=>requestAnimationFrame(()=>els.persistentSceneImage?.classList.add('event-visual-ready')),onError:()=>hidePersistentSceneVisual()});
    return true;
  }
  function hidePinnedSceneDoc(){
    els.pinnedSceneDoc?.classList.add('hidden');els.pinnedSceneDoc?.setAttribute('aria-hidden','true');if(els.pinnedSceneDocImage)els.pinnedSceneDocImage.removeAttribute('src');
  }
  function showPinnedSceneDoc(key,label=''){
    const meta=resolveDocumentMeta?.(key);if(!meta?.path||!els.pinnedSceneDoc||!els.pinnedSceneDocImage)return false;
    els.pinnedSceneDocImage.src=meta.path;els.pinnedSceneDocLabel.textContent=label||meta.label||'';els.pinnedSceneDoc.classList.remove('hidden');els.pinnedSceneDoc.setAttribute('aria-hidden','false');return true;
  }
  function hideConceptToast(){if(conceptToastTimer)clearTimeout(conceptToastTimer);conceptToastTimer=null;els.conceptToast?.classList.remove('show');}
  function showConceptToast(title){
    const bullet=LOGIC_BULLETS?.find?.(b=>b.name===title);if(!bullet||!els.conceptToast)return;
    hideConceptToast();els.conceptToast.innerHTML=`<small>LOGIC NOTE</small><strong>${escapeHtml(bullet.name)}</strong><span>${escapeHtml(bullet.definition)}</span>`;
    els.conceptToast.classList.add('show');conceptToastTimer=setTimeout(()=>hideConceptToast(),qaDelay(1300));
  }

  // v0.43 persistent event-scene grammar -------------------------------------
  // Event illustrations are not disposable cutaways. Once an event image arrives,
  // it becomes the scene background while the following dialogue/narration plays.
  const EVENT_BACKDROP_RANGES={
    'scene-02':{start:6,end:9,key:'young_louis_fronde'},
    'scene-06':{start:0,end:2,key:'louis_wakes_as_anne'},
    'scene-09':{start:12,end:14,key:'summon_parliament_event'},
    'scene-20':{start:4,end:11,key:'charles_door_flash'},
    'scene-28':{start:2,end:7,key:'dream_crown_offer'},
    'scene-32':{start:5,end:9,key:'charles_door_flash'},
    'scene-33':{start:6,end:7,key:'sun_king_outburst'},
    'scene-36':{start:10,end:15,key:'realization_montage'},
    'scene-40':{start:2,end:3,key:'mirror_return'}
  };
  const EVENT_BACKDROP_KEYS=new Set(Object.values(EVENT_BACKDROP_RANGES).map(v=>v.key));
  function backdropEventFor(scene,index){
    const cfg=scene?EVENT_BACKDROP_RANGES[scene.id]:null;
    return cfg&&index>=cfg.start&&index<=cfg.end?cfg:null;
  }
  function syncBackdropEventMode(){
    const scene=currentScene(),cfg=backdropEventFor(scene,state.lineIndex),active=!!cfg;
    screens.story?.classList.toggle('event-backdrop-mode',active);
    if(active){
      if(els.persistentSceneLayer?.dataset?.memoryKind!==cfg.key||els.persistentSceneLayer.classList.contains('hidden'))showPersistentSceneVisual(cfg.key);
      hideSpecial();hideProp({immediate:true});hidePinnedSceneDoc();hideFlashback();
    }else{
      const kind=els.persistentSceneLayer?.dataset?.memoryKind;
      if(kind&&EVENT_BACKDROP_KEYS.has(kind))hidePersistentSceneVisual();
    }
  }
  function transitionLabelFor(from,to){
    if(!to)return '';
    const title=String(to.title||''),place=String(to.place||'');
    const time=(title.match(/그날\s*밤|그날\s*아침|다음\s*날|새벽|아침|오전|오후|저녁|밤/)||[])[0]||'';
    const placeChanged=!!from&&from.place!==to.place;
    if(time&&placeChanged)return `${place} · ${time.replace(/\s+/g,' ')}`;
    if(time)return time.replace(/\s+/g,' ');
    return placeChanged?place:'';
  }
  function shouldPlayPassage(from,to){
    if(!from||!to)return false;
    const label=transitionLabelFor(from,to);
    const chapterChanged=from.chapter!==to.chapter;
    const countryChanged=from.country!==to.country;
    const timeShift=/그날|다음|새벽|아침|오전|오후|저녁|밤|며칠/.test(label||String(to.title||''));
    return chapterChanged||countryChanged||timeShift;
  }
  function runSceneFade(from,to,onBlack){
    const overlay=els.sceneFadeOverlay,labelEl=els.sceneFadeLabel;
    if(!overlay||teacherPreviewMode&&teacherFastMode){onBlack();return;}
    const label=transitionLabelFor(from,to);
    if(labelEl)labelEl.textContent=label;
    if(shouldPlayPassage(from,to))AudioManager?.stinger?.('PASSAGE');
    overlay.classList.remove('hidden','fade-out');
    overlay.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('active')));
    setTimeout(()=>{onBlack();},qaDelay(680));
    setTimeout(()=>overlay.classList.add('fade-out'),qaDelay(1680));
    setTimeout(()=>{overlay.classList.remove('active','fade-out');overlay.classList.add('hidden');overlay.setAttribute('aria-hidden','true')},qaDelay(2380));
  }

  // v0.25 DETAIL PASS ----------------------------------------------------
  // Props remain on screen while the surrounding dialogue is still about them.
  // Ranges are inclusive and can continue across adjacent scenes using the same prop key.
  const PROP_HOLD_RANGES={
    'scene-08':[{start:0,end:10,key:'english_meal'}],
    'scene-16':[{start:8,end:14,key:'palace_blueprint'}],
    'scene-17':[{start:0,end:5,key:'palace_blueprint'}],
    'scene-18':[{start:0,end:6,key:'palace_blueprint'}],
    'scene-22':[{start:0,end:1,key:'europe_war_map'}],
    'scene-23':[{start:0,end:16,key:'europe_war_map'}],
    'scene-24':[{start:0,end:7,key:'europe_war_map'}],
    'scene-30':[{start:4,end:8,key:'bill_of_rights'}],
    'scene-31':[{start:2,end:11,key:'bill_of_rights'}],
    'scene-32':[{start:0,end:9,key:'bill_of_rights'}],
    'scene-33':[{start:0,end:7,key:'bill_of_rights'}],
    'scene-34':[{start:0,end:10,key:'bill_of_rights'}],
    'scene-37':[{start:0,end:0,key:'crown'}]
  };
  function persistentPropFor(sceneId,index){
    return (PROP_HOLD_RANGES[sceneId]||[]).find(r=>index>=r.start&&index<=r.end)||null;
  }
  function clearActionBeat(){
    if(actionBeatTimerA)clearTimeout(actionBeatTimerA);if(actionBeatTimerB)clearTimeout(actionBeatTimerB);actionBeatTimerA=null;actionBeatTimerB=null;
    els.actionBeatOverlay?.classList.add('hidden');els.actionBeatOverlay?.classList.remove('show','fade');els.actionBeatOverlay?.setAttribute('aria-hidden','true');
  }
  function isShortActionBeat(line){
    // v0.34: all non-opening narration is read inside the regular dialogue panel.
    // The old floating action-beat overlay caused narration to appear above the dialogue box.
    return false;
  }
  function renderActionBeat(line){
    delete els.actorLayer.dataset.shotPhase;clearTyping();els.panel.classList.add('hidden');els.intertitle.classList.add('hidden');activateActor(null);record(line);updateProgress();save();busy=true;clearActionBeat();
    if(!els.actionBeatOverlay||!els.actionBeatText){busy=false;return renderVisibleLine(line,true)}
    els.actionBeatText.textContent=line.text||'';els.actionBeatOverlay.classList.remove('hidden','fade');els.actionBeatOverlay.classList.add('show');els.actionBeatOverlay.setAttribute('aria-hidden','false');
    const hold=Math.min(1650,Math.max(1050,800+String(line.text||'').length*15));
    actionBeatTimerA=setTimeout(()=>{els.actionBeatOverlay.classList.add('fade');actionBeatTimerB=setTimeout(()=>{clearActionBeat();busy=false;state.lineIndex++;beforeBeatKey=null;afterBeatKey=null;save();renderCurrent()},qaDelay(230))},qaDelay(hold));
  }
  const MEMORY_DETAIL={
    'scene-13':{code:'1',theme:'cold',label:'ENGLISH MEMORY I'},'scene-14':{code:'1',theme:'cold',label:'ENGLISH MEMORY I'},
    'scene-19':{code:'2',theme:'cold',label:'ENGLISH MEMORY II'},'scene-20':{code:'2',theme:'cold',label:'ENGLISH MEMORY II'},
    'scene-27':{code:'3',theme:'seal',label:'ENGLISH MEMORY III'},'scene-28':{code:'3',theme:'seal',label:'ENGLISH MEMORY III'}
  };
  function syncFinalPressure(){
    const s=currentScene(),i=state.lineIndex,root=screens.story;
    root.classList.remove('final-history-shock','final-sun-claim','final-france-rebuttal');
    if(!s||s.chapter!=='FINAL')return;
    if(s.number>32||(s.number===32&&i>=6))root.classList.add('final-history-shock');
    if(s.number>33||(s.number===33&&i>=6))root.classList.add('final-sun-claim');
    if(s.number>34||(s.number===34&&i>=0))root.classList.add('final-france-rebuttal');
  }
  function clearDebateReadWindow(){if(debateReadTimer)clearTimeout(debateReadTimer);debateReadTimer=null;debateReadLocked=false;screens.debate.classList.remove('reading-first')}
  const AudioManager=(()=>{
    const channels=[new Audio(),new Audio()];
    channels.forEach(a=>{a.loop=true;a.preload='auto'});
    const sting=new Audio();sting.loop=false;sting.preload='auto';
    let active=0,currentKey=null,unlocked=false,fadeToken=0,stingerToken=0,duck=1;
    function cfgFor(key){return AUDIO_MAP?.bgm?.[key]||null}
    function targetFor(key){const cfg=cfgFor(key);return state.audio.enabled&&cfg?Math.min(1,(cfg.volume??1)*state.audio.volume*duck):0}
    function rampVolume(audio,target,dur=420,tokenGuard=null){
      const startVol=Number(audio.volume)||0,start=performance.now();
      const token=tokenGuard;
      const step=now=>{if(token&&token()===false)return;const x=Math.min(1,(now-start)/Math.max(1,dur));audio.volume=startVol+(target-startVol)*x;if(x<1)requestAnimationFrame(step)};
      requestAnimationFrame(step);
    }
    function unlock(){unlocked=true}
    function setVolume(v){
      state.audio.volume=Math.max(0,Math.min(1,Number(v)||0));
      if(currentKey&&!channels[active].paused)rampVolume(channels[active],targetFor(currentKey),260);
    }
    function stopAll(){
      fadeToken++;stingerToken++;channels.forEach(a=>{try{a.pause();a.currentTime=0;a.volume=0}catch{}});
      try{sting.pause();sting.currentTime=0;sting.volume=0}catch{}
      currentKey=null;duck=1;channels.forEach(a=>{a._bgmPath=''})
    }
    function play(key){
      const cfg=cfgFor(key),path=cfg?.path;
      currentKey=key;
      if(!state.audio.enabled||!unlocked||!path)return;
      const from=channels[active],pending=channels[1-active];
      const target=targetFor(key);
      // If the requested key is already the active music, just normalize volume and silence the spare channel.
      if(currentKey===key&&from._bgmPath===path&&!from.paused){
        const keepToken=++fadeToken;
        rampVolume(from,target,260);
        if(!pending.paused){rampVolume(pending,0,220);setTimeout(()=>{if(keepToken!==fadeToken)return;try{pending.pause();pending.currentTime=0;pending._bgmPath=''}catch{}},240)}
        return;
      }
      // TITLE and FRANCE intentionally share the same recording: keep playing without a restart.
      if(from._bgmPath===path&&!from.paused){
        const keepToken=++fadeToken;
        rampVolume(from,target,320);
        if(!pending.paused){rampVolume(pending,0,260);setTimeout(()=>{if(keepToken!==fadeToken)return;try{pending.pause();pending.currentTime=0;pending._bgmPath=''}catch{}},280)}
        return;
      }
      // If the requested track is already fading in on the other channel, finish that crossfade instead of layering more audio.
      if(pending._bgmPath===path&&!pending.paused){
        const token=++fadeToken,start=performance.now(),dur=teacherFastMode?80:420,fromStart=Number(from.volume)||0,pendingStart=Number(pending.volume)||0;
        const step=now=>{if(token!==fadeToken)return;const x=Math.min(1,(now-start)/dur);pending.volume=pendingStart+(target-pendingStart)*x;from.volume=Math.max(0,fromStart*(1-x));if(x<1)requestAnimationFrame(step);else{try{from.pause();from.currentTime=0;from._bgmPath=''}catch{}active=1-active}};
        requestAnimationFrame(step);
        return;
      }
      const next=1-active,to=channels[next],token=++fadeToken;
      try{
        try{sting.pause();sting.currentTime=0;sting.volume=0}catch{}
        to.src=path;to._bgmPath=path;to.loop=true;to.currentTime=0;to.volume=0;
        const pr=to.play();
        if(pr&&pr.catch)pr.catch(()=>{
          if(token!==fadeToken)return;
          try{from.pause();from.src=path;from._bgmPath=path;from.loop=true;from.currentTime=0;from.volume=target;const retry=from.play();if(retry&&retry.catch)retry.catch(()=>{});active=active}catch{}
        });
      }catch{return}
      const start=performance.now(),dur=teacherFastMode?80:900,fromStart=Number(from.volume)||0;
      const step=now=>{if(token!==fadeToken)return;const x=Math.min(1,(now-start)/dur);to.volume=target*x;from.volume=Math.max(0,fromStart*(1-x));if(x<1)requestAnimationFrame(step);else{try{from.pause();from.currentTime=0;from._bgmPath=''}catch{}active=next}};
      requestAnimationFrame(step);
    }
    function stinger(key){
      const cfg=AUDIO_MAP?.stingers?.[key];if(!state.audio.enabled||!unlocked||!cfg?.path)return;
      const token=++stingerToken,maxMs=Math.max(1800,Number(cfg.maxMs)||6500);
      try{sting.pause();sting.src=cfg.path;sting.currentTime=0;sting.volume=0}catch{}
      duck=.42;
      if(currentKey&&!channels[active].paused)rampVolume(channels[active],targetFor(currentKey),360);
      try{const pr=sting.play();if(pr&&pr.catch)pr.catch(()=>{})}catch{}
      const peak=Math.min(1,(cfg.volume??1)*state.audio.volume);
      rampVolume(sting,peak,420,()=>token===stingerToken);
      const finish=()=>{
        if(token!==stingerToken)return;
        rampVolume(sting,0,600,()=>token===stingerToken);
        setTimeout(()=>{if(token!==stingerToken)return;try{sting.pause();sting.currentTime=0}catch{}duck=1;if(currentKey&&!channels[active].paused)rampVolume(channels[active],targetFor(currentKey),700)},620);
      };
      setTimeout(finish,teacherFastMode?180:maxMs);
    }
    function sfx(key){const cfg=AUDIO_MAP?.sfx?.[key];if(!state.audio.enabled||!unlocked||!cfg?.path)return;try{const a=new Audio(cfg.path);a.volume=Math.min(1,(cfg.volume??1)*state.audio.volume);a.play().catch(()=>{})}catch{}}
    function enabled(v){
      state.audio.enabled=!!v;
      if(!state.audio.enabled){stopAll();return}
      unlock();
    }
    return {unlock,play,stinger,sfx,stopAll,setVolume,enabled,get currentKey(){return currentKey}};
  })();
  document.addEventListener('pointerdown',()=>{
    AudioManager.unlock();
    if(screens.title?.classList.contains('active')&&state.audio.enabled)AudioManager.play('TITLE');
  },{once:true,capture:true});
  function show(name){Object.values(screens).forEach(s=>s.classList.remove('active'));screens[name].classList.add('active')}
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function currentScene(){return STORY_DATA[state.sceneIndex]}
  function currentLine(){return currentScene()?.lines[state.lineIndex]}
  function bulletById(id){return LOGIC_BULLETS.find(b=>b.id===id)}
  function uniquePush(arr,value){if(!arr.includes(value))arr.push(value)}
  function lineKey(){return `${currentScene()?.id||'none'}:${state.lineIndex}`}
  function currentCue(){return DIRECTOR_MAP?.[lineKey()]||null}

  function updateViewport(){
    const h=window.visualViewport?.height||window.innerHeight;
    document.documentElement.style.setProperty('--app-h',`${h}px`);
    if(typeof layoutPortraits==='function')requestAnimationFrame(()=>layoutPortraits());
  }
  updateViewport();
  window.visualViewport?.addEventListener('resize',updateViewport);
  window.addEventListener('resize',updateViewport);
  window.addEventListener('orientationchange',()=>setTimeout(updateViewport,180));
  window.addEventListener('pageshow',()=>setTimeout(updateViewport,80));

  function updateTitle(){
    const has=state.started&&!state.endingSeen;
    els.continue.classList.toggle('hidden',!has);
    els.restart.classList.toggle('hidden',!has);
    els.start.classList.toggle('hidden',has);
    els.start.textContent=state.endingSeen?'다시 시작':'이야기 시작';
    if(els.music)els.music.textContent=`음악 ${state.audio?.enabled!==false?'ON':'OFF'}`;
    if(els.menuMusic)els.menuMusic.textContent=`배경음악 ${state.audio?.enabled!==false?'ON':'OFF'}`;
    els.sound.textContent=`진동 ${state.haptics?'ON':'OFF'}`;
  }
  function applyStaticArt(){
    const titleMeta=resolveSpecialMeta?.('title_poster');if(titleMeta?.path)screens.title.classList.add('has-title-art');
    const debateBg=resolveAsset?.('backgrounds','bg_parliament');if(debateBg)document.documentElement.style.setProperty('--debate-bg-image',`url("${debateBg}")`);
    const sun=resolveDocumentMeta?.('sun_emblem')?.path;if(sun){if(els.sunImage)els.sunImage.src=sun;document.documentElement.style.setProperty('--sun-emblem-image',`url("${sun}")`)}
  }
  function prepareEndArt(){const meta=resolveSpecialMeta?.('mirror_return')||resolveSpecialMeta?.('title_poster');if(meta?.path){preloadPath(meta.path);document.documentElement.style.setProperty('--end-art-image',`url("${meta.path}")`)}}


  function clearTyping(){if(typing?.timer)clearTimeout(typing.timer);typing=null}
  function clearDirectionTimer(){if(directionTimer)clearTimeout(directionTimer);directionTimer=null}
  const STORY_EMPHASIS_TERMS=[
    '영국에서 왕은 군림하되 통치하지 않는다.','짐이 곧 국가다!','짐은 태양이다!','국가는 왕 한 사람보다 큽니다.','하늘 없이 혼자 뜨는 것은 아니었군.',
    '왕권신수설','권리장전','관료제','상비군','파리 고등법원','의회','세금','왕권','왕관','전쟁','베르사유 궁전'
  ].sort((a,b)=>b.length-a.length);
  const STORY_EMPHASIS_RE=new RegExp(`(${STORY_EMPHASIS_TERMS.map(v=>v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'g');
  function formatText(text,limit=Infinity){
    const raw=String(text).slice(0,limit);
    return raw.split(STORY_EMPHASIS_RE).map(part=>STORY_EMPHASIS_TERMS.includes(part)?`<span class=\"story-emphasis\">${escapeHtml(part)}</span>`:escapeHtml(part)).join('').replace(/\n/g,'<br>');
  }
  const KEY_LINE_SNIPPETS=['애송이 앤','의회를 소집하라!','영국에서 왕은 군림하되 통치하지 않는다.','짐은 태양이다!','짐이 곧 국가다!','그건 프랑스입니다.','국가는 왕 한 사람보다 큽니다.','태양도…','하늘 없이 혼자 뜨는 것은 아니었군.'];
  function isKeyLine(text){const t=String(text||'');return KEY_LINE_SNIPPETS.some(v=>t.includes(v))}
  function typeDelayFor(text){const t=String(text||'');if(isKeyLine(t))return 44;if(t.length>=95)return 24;if(t.length>=70)return 27;if(t.length>=45)return 30;return 34}
  function typeText(text,{instant=false,speed=1}={}){
    clearTyping();
    const reduce=instant||matchMedia('(prefers-reduced-motion: reduce)').matches||(teacherPreviewMode&&teacherFastMode);
    typing={text:String(text),index:reduce?String(text).length:0,timer:null};
    els.text.innerHTML=formatText(typing.text,typing.index);
    els.hint.textContent=typing.index<typing.text.length?'터치하면 문장 완성':'터치하여 계속 ›';
    if(reduce)return;
    const delay=Math.max(5,Math.round(typeDelayFor(typing.text)*speed));
    const tick=()=>{
      if(!typing)return;
      typing.index=Math.min(typing.text.length,typing.index+1);
      els.text.innerHTML=formatText(typing.text,typing.index);
      if(typing.index<typing.text.length)typing.timer=setTimeout(tick,teacherPreviewMode&&teacherFastMode?1:delay);
      else els.hint.textContent='터치하여 계속 ›';
    };
    tick();
  }
  function finishTyping(){
    if(!typing||typing.index>=typing.text.length)return false;
    if(typing.timer)clearTimeout(typing.timer);
    typing.index=typing.text.length;
    els.text.innerHTML=formatText(typing.text);
    els.hint.textContent='터치하여 계속 ›';
    return true;
  }

  function record(line){
    if(!line||!['dialogue','narration','monologue'].includes(line.type)||teacherPreviewMode)return;
    const label=line.type==='narration'?(ACTION_NARRATION_KEYS?.has(lineKey())?'장면':'나레이션'):line.type==='monologue'?'독백':(line.speaker||'대사');
    const item={speaker:label,text:line.text,scene:`SCENE ${String(currentScene().number).padStart(2,'0')} · ${currentScene().title}`};
    const last=state.history.at(-1);
    if(!last||last.text!==item.text||last.scene!==item.scene){
      state.history.push(item);
      if(state.history.length>HISTORY_LIMIT)state.history.splice(0,state.history.length-HISTORY_LIMIT);
    }
  }

  // Progress is based on actual readable/game units, not 40 equally-weighted scenes.
  function lineWeight(line){
    if(!line||line.type==='direction')return 0;
    if(line.type==='debate')return DEBATE_DATA[line.debateId]?.rounds.length||1;
    return 1;
  }
  const TOTAL_PROGRESS_UNITS=STORY_DATA.reduce((sum,s)=>sum+s.lines.reduce((n,l)=>n+lineWeight(l),0),0);
  function completedProgressUnits(){
    let done=0;
    for(let si=0;si<state.sceneIndex;si++)done+=STORY_DATA[si].lines.reduce((n,l)=>n+lineWeight(l),0);
    const s=currentScene();
    if(!s)return TOTAL_PROGRESS_UNITS;
    for(let li=0;li<Math.min(state.lineIndex,s.lines.length);li++)done+=lineWeight(s.lines[li]);
    const line=currentLine();
    if(line?.type==='debate'&&state.debate?.id===line.debateId){
      const rounds=DEBATE_DATA[line.debateId]?.rounds.length||1;
      const partial=Math.min(rounds,state.debate.round+(state.debate.phase==='rebuttal'?0.75:state.debate.phase==='clear'?rounds:0.1));
      done+=partial;
    }else if(line&&lineWeight(line)>0){
      done+=0.12;
    }
    return done;
  }
  function updateProgress(){
    const pct=TOTAL_PROGRESS_UNITS?completedProgressUnits()/TOTAL_PROGRESS_UNITS*100:0;
    els.progress.style.width=`${Math.max(0,Math.min(100,pct))}%`;
  }

  function stageActorsFor(scene){return STAGE_MAP[scene.id]||[]}
  function actorVariantFor(actorId){
    const cue=currentCue();
    if(cue?.focus===actorId&&cue.pose)return cue.pose;
    return 'default';
  }
  const SILHOUETTE_ACTORS=new Set(['maid','french_general','unknown']);
  function setResilientImage(img,path,{onLoad=()=>{},onError=()=>{},retryDelay=420}={}){
    if(!img||!path){onError();return}
    let retried=false;
    const ok=()=>{img.onload=null;img.onerror=null;onLoad()};
    const fail=()=>{
      if(!retried){retried=true;setTimeout(()=>{img.src=retryUrl(path)},qaDelay(retryDelay));return}
      img.onload=null;img.onerror=null;onError();
    };
    img.onload=ok;img.onerror=fail;img.src=path;
  }
  function firstActorLine(scene,actorId){
    const i=scene?.lines?.findIndex(l=>l.actorId===actorId);return i<0?0:i;
  }
  function syncActorPresence(scene){
    let changed=false;
    $$('.actor').forEach(a=>{
      const first=Number(a.dataset.firstLine||0);
      if(state.lineIndex>=first&&a.classList.contains('waiting-entry')){
        a.classList.remove('waiting-entry');a.classList.add('actor-arrive');changed=true;
        setTimeout(()=>a.classList.remove('actor-arrive'),qaDelay(520));
      }
    });
    if(changed)requestAnimationFrame(()=>layoutPortraits());
  }
  function setActorImage(div,path){
    const img=div.querySelector('.actor-img');if(!img)return;
    if(div.dataset.assetPath===String(path||''))return;
    const requestId=(Number(div.dataset.assetRequest||0)+1);div.dataset.assetRequest=String(requestId);
    if(!path){
      div.dataset.assetPath='';div.classList.remove('has-image','asset-error');img.classList.add('hidden');img.classList.remove('swapping');img.removeAttribute('src');return;
    }
    const previousPath=div.dataset.assetPath||'',previousVisible=!!img.getAttribute('src')&&!img.classList.contains('hidden');
    const pre=new Image();let previousGhost=null;if(previousVisible){previousGhost=img.cloneNode(true);previousGhost.classList.remove('swapping','hidden');previousGhost.classList.add('actor-prev-img');div.insertBefore(previousGhost,img);img.classList.add('swapping')}let retried=false;
    const commit=()=>{
      if(Number(div.dataset.assetRequest)!==requestId){previousGhost?.remove();return}
      div.dataset.assetPath=path;div.classList.remove('asset-error');div.classList.add('has-image');img.src=pre.src;img.classList.remove('hidden');
      requestAnimationFrame(()=>requestAnimationFrame(()=>{img.classList.remove('swapping');if(previousGhost){previousGhost.classList.add('fade-out');setTimeout(()=>previousGhost?.remove(),qaDelay(180))}}));
    };
    const fail=()=>{
      if(Number(div.dataset.assetRequest)!==requestId)return;
      if(!retried){retried=true;setTimeout(()=>{pre.src=retryUrl(path)},qaDelay(420));return}
      img.classList.remove('swapping');previousGhost?.remove();
      if(previousVisible){div.dataset.assetPath=previousPath;div.classList.add('has-image');return}
      div.dataset.assetPath='';div.classList.remove('has-image');div.classList.add('asset-error');img.classList.add('hidden');
    };
    pre.onload=commit;pre.onerror=fail;pre.src=path;
  }
  function renderStageActors(scene){
    els.actorLayer.innerHTML='';
    const cast=stageActorsFor(scene);els.actorLayer.dataset.castCount=String(cast.length);
    cast.forEach(entry=>{
      const def=ACTOR_DEFS[entry.id];if(!def)return;
      // SCENE 10 opens on a location caption. Keep both debate participants already
      // visible behind that caption instead of treating the caption as a pre-entry beat.
      const first=scene.id==='scene-10'?0:firstActorLine(scene,entry.id);
      const div=document.createElement('div');
      div.className='actor entering';div.dataset.actor=entry.id;div.dataset.slot=entry.slot;div.dataset.group=def.group||'';div.dataset.firstLine=String(first);
      div.dataset.frame=['anne_louis','louis14'].includes(entry.id)?'wide':'portrait';
      if(SILHOUETTE_ACTORS.has(entry.id))div.classList.add('silhouette');
      if(first>state.lineIndex)div.classList.add('waiting-entry');
      div.innerHTML=`<img class="actor-img hidden" alt=""><span>${escapeHtml(def.code)}</span><b>${escapeHtml(def.name)}</b>`;
      els.actorLayer.append(div);setActorImage(div,resolveActorAsset?.(entry.id,'default'));
      requestAnimationFrame(()=>requestAnimationFrame(()=>div.classList.remove('entering')));
    });
    syncActorPresence(scene);
    requestAnimationFrame(()=>layoutPortraits());
  }
  function layoutPortraits(){
    if(typeof portraitFrames!=='function')return;
    const box=els.actorLayer.getBoundingClientRect();if(!box.width||!box.height)return;
    const stageCast=stageActorsFor(currentScene()||{});
    let cast=stageCast;
    // Solo-focus is a real one-person composition, not a CSS translation layered on
    // top of a multi-person frame. This keeps the face and body geometrically centered.
    if(els.actorLayer.classList.contains('solo-focus')){
      const active=els.actorLayer.querySelector('.actor.active');
      if(active?.dataset.actor)cast=[{id:active.dataset.actor,slot:'center'}];
    }else{
      // Only actors who have actually entered participate in composition. This avoids
      // leaving one visible actor stranded in a 3-person layout while the others wait.
      const visible=stageCast.filter(e=>{
        const actor=els.actorLayer.querySelector(`[data-actor="${e.id}"]`);
        return actor&&!actor.classList.contains('waiting-entry');
      });
      if(visible.length){
        const slots=visible.length===1?['center']:visible.length===2?['left','right']:['left','center','right'];
        cast=visible.map((e,i)=>({id:e.id,slot:slots[Math.min(i,slots.length-1)]}));
      }
    }
    portraitFrames(cast,box.width,box.height).filter(Boolean).forEach(f=>{
      const actor=els.actorLayer.querySelector(`[data-actor="${f.id}"]`);if(!actor)return;
      for(const k of ['width','height','left','top'])actor.style.setProperty(k,f[k]+'px','important');
      actor.style.setProperty('right','auto','important');actor.style.setProperty('bottom','auto','important');
      actor.dataset.facePixels=f.face.toFixed(2);
    });
  }
  function activateActor(actorId){
    $$('.actor').forEach(a=>a.classList.toggle('active',!!actorId&&a.dataset.actor===actorId));
  }
  function setActorPose(actorId,pose){
    $$('.actor').forEach(a=>{
      if(!actorId||a.dataset.actor!==actorId){delete a.dataset.pose;return}
      if(pose)a.dataset.pose=pose;else delete a.dataset.pose;
      setActorImage(a,resolveActorAsset?.(actorId,pose||'default'));
    });
  }
  function retryUrl(path){const glue=String(path).includes('?')?'&':'?';return `${path}${glue}retry=1`;}
  function preloadPath(path){
    if(!path||assetPreloadCache.has(path))return;
    assetPreloadCache.set(path,'loading');
    const img=new Image();let retried=false;
    img.onload=()=>assetPreloadCache.set(path,'ready');
    img.onerror=()=>{
      if(!retried){retried=true;assetPreloadCache.set(path,'retrying');setTimeout(()=>{img.src=retryUrl(path)},qaDelay(380));return}
      assetPreloadCache.set(path,'error');
    };
    img.src=path;
  }
  function specialKeysForScene(sceneId){const prefix=`${sceneId}:`;return Object.entries(SPECIAL_CUE_MAP||{}).filter(([k])=>k.startsWith(prefix)).map(([,v])=>v?.key).filter(Boolean)}
  function preloadSceneAssets(index){
    [index,index+1,index+2].forEach((i,offset)=>{const scene=STORY_DATA[i];if(!scene)return;
      const bgKey=SCENE_ASSET_MAP?.[scene.id];preloadPath(bgKey?resolveAsset?.('backgrounds',bgKey):null);
      stageActorsFor(scene).forEach(a=>{preloadPath(resolveActorAsset?.(a.id,'default'));if(offset===0){const seq=POSE_TIMELINE?.[scene.id]?.[a.id]||[];seq.forEach(([,pose])=>preloadPath(resolveActorAsset?.(a.id,pose)))}});
      const propKey=SCENE_PROP_MAP?.[scene.id];preloadPath(propKey?resolveAsset?.('documents',propKey):null);
      specialKeysForScene(scene.id).forEach(key=>preloadPath(resolveSpecialMeta?.(key)?.path||null));
    });
    if(index>=37)prepareEndArt();
  }
  function applySceneAsset(scene){
    const key=SCENE_ASSET_MAP?.[scene.id],path=key?resolveAsset?.('backgrounds',key):null,frame=BACKGROUND_FRAME_MAP?.[scene.id]||{};els.stage.classList.toggle('asset-ready',!!path);
    if(path){
      preloadPath(path);
      if(els.sceneBackground){
        els.sceneBackground.classList.remove('asset-error');
        // v0.34: backgrounds are authored at 16:9. Always preserve the full artwork;
        // scene-specific crop/zoom values were clipping edges on wide mobile screens.
        els.sceneBackground.style.objectPosition='center';
        els.sceneBackground.style.objectFit='contain';
        if(els.sceneBackground.getAttribute('src')!==path)els.sceneBackground.src=path;
      }
    }else{
      if(els.sceneBackground)els.sceneBackground.classList.add('asset-error');
    }
  }
  function finalizePropHide(){
    if(propExitTimer)clearTimeout(propExitTimer);propExitTimer=null;
    els.propLayer?.classList.add('hidden');els.propLayer?.classList.remove('prop-persistent','prop-entering','prop-exiting');screens.story?.classList.remove('prop-focus-active');
    els.propImage?.classList.add('hidden');if(els.propImage)els.propImage.removeAttribute('src');if(els.propCard){delete els.propCard.dataset.prop;els.propCard.classList.remove('prop-switching')}
  }
  function hideProp({immediate=false}={}){
    if(propHideTimer)clearTimeout(propHideTimer);propHideTimer=null;if(propExitTimer)clearTimeout(propExitTimer);propExitTimer=null;if(propReleaseTimer)clearTimeout(propReleaseTimer);propReleaseTimer=null;
    if(!els.propLayer||els.propLayer.classList.contains('hidden')){finalizePropHide();return}
    if(!immediate&&els.propLayer.classList.contains('prop-persistent')){
      screens.story?.classList.remove('prop-focus-active');els.propLayer.classList.remove('prop-entering');els.propLayer.classList.add('prop-exiting');
      propExitTimer=setTimeout(()=>finalizePropHide(),qaDelay(260));return;
    }
    finalizePropHide();
  }
  function showProp(key,{hold=1100,persistent=false}={}){
    const meta=resolveDocumentMeta?.(key);if(!meta||!els.propLayer)return;
    if(propHideTimer)clearTimeout(propHideTimer);propHideTimer=null;if(propExitTimer)clearTimeout(propExitTimer);propExitTimer=null;if(propReleaseTimer)clearTimeout(propReleaseTimer);propReleaseTimer=null;
    const previousKey=els.propCard?.dataset?.prop||'',already=previousKey===key&&!els.propLayer.classList.contains('hidden');
    const path=meta.path||null;els.propFallback.textContent=meta.label||key;els.propFallback.classList.toggle('hidden',!!path);
    els.propLayer.classList.remove('hidden','prop-exiting');els.propLayer.classList.toggle('prop-persistent',persistent);screens.story?.classList.toggle('prop-focus-active',persistent);els.propCard.dataset.prop=key;
    if(!already){els.propLayer.classList.remove('prop-entering');void els.propLayer.offsetWidth;els.propLayer.classList.add('prop-entering');setTimeout(()=>els.propLayer?.classList.remove('prop-entering'),qaDelay(260))}
    if(previousKey&&previousKey!==key)els.propCard?.classList.add('prop-switching');
    if(path&&!already){setResilientImage(els.propImage,path,{onLoad:()=>{els.propImage.classList.remove('hidden');els.propFallback.classList.add('hidden');els.propCard?.classList.remove('prop-switching')},onError:()=>{els.propImage.classList.add('hidden');els.propFallback.classList.remove('hidden');els.propCard?.classList.remove('prop-switching')}})}
    if(!persistent)propHideTimer=setTimeout(()=>hideProp({immediate:true}),qaDelay(hold));
  }
  function syncPersistentProp(){
    const s=currentScene(),range=s?persistentPropFor(s.id,state.lineIndex):null;
    if(range){if(propReleaseTimer)clearTimeout(propReleaseTimer);propReleaseTimer=null;showProp(range.key,{persistent:true});return}
    if(els.propLayer?.classList.contains('prop-exiting'))return;
    if(els.propLayer?.classList.contains('prop-persistent')&&!propReleaseTimer){
      propReleaseTimer=setTimeout(()=>{propReleaseTimer=null;hideProp()},qaDelay(220));
    }
  }
  function propForCurrentLine(effect){
    const scene=currentScene();if(!scene)return null;
    if(effect==='seal')return scene.id==='scene-28'?'dream_red_seal':scene.id==='scene-30'?'bill_of_rights':SCENE_PROP_MAP?.[scene.id];
    if(effect==='document')return scene.id==='scene-28'?'dream_red_seal':'bill_of_rights';
    return null;
  }
  function clearSpecialTimers(){if(specialTimer)clearTimeout(specialTimer);if(specialReadyTimer)clearTimeout(specialReadyTimer);specialTimer=null;specialReadyTimer=null}
  function clearSpecialState(){clearSpecialTimers();specialDone=null;specialReady=false;if(els.specialLayer){els.specialLayer.classList.add('hidden');els.specialLayer.classList.remove('interactive','ready');els.specialLayer.setAttribute('aria-hidden','true')}if(els.specialContinue)els.specialContinue.classList.add('hidden');if(els.specialImage){els.specialImage.classList.add('hidden');els.specialImage.removeAttribute('src')}}
  function hideSpecial(){clearSpecialState()}
  function showSpecialImage(key,duration=1200,options={}){
    const meta=resolveSpecialMeta?.(key);if(!meta?.path||!els.specialLayer)return false;clearSpecialTimers();specialDone=null;specialReady=false;
    const interactive=!!options.interactive&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!(teacherPreviewMode&&teacherFastMode);
    els.specialLabel.textContent=meta.label||'';els.specialLayer.style.setProperty('--special-duration',`${Math.max(500,duration)}ms`);els.specialLayer.classList.remove('hidden','ready');els.specialLayer.classList.toggle('interactive',interactive);els.specialLayer.setAttribute('aria-hidden','false');
    if(els.specialContinue)els.specialContinue.classList.add('hidden');els.specialImage.classList.add('hidden');setResilientImage(els.specialImage,meta.path,{onLoad:()=>els.specialImage.classList.remove('hidden'),onError:()=>{const done=options.onContinue;hideSpecial();if(typeof done==='function')done()}});
    if(interactive){specialDone=typeof options.onContinue==='function'?options.onContinue:null;specialReadyTimer=setTimeout(()=>{specialReady=true;els.specialLayer.classList.add('ready');els.specialContinue?.classList.remove('hidden')},qaDelay(options.minHold||900))}
    else specialTimer=setTimeout(()=>{hideSpecial();if(typeof options.onContinue==='function')options.onContinue()},qaDelay(duration));
    return true
  }
  function continueSpecial(){if(!specialReady||!specialDone)return;const done=specialDone;specialDone=null;specialReady=false;hideSpecial();haptic(6);done()}
  function hideFlashback(){
    flashbackDone=null;pinnedFlashbackSceneId=null;pinnedFlashbackUntilLine=-1;
    els.flashbackLayer?.classList.add('hidden');
    els.flashbackLayer?.classList.remove('interactive');
    els.flashbackLayer?.setAttribute('aria-hidden','true');
    els.flashbackImage?.classList.add('hidden');
    if(els.flashbackImage)els.flashbackImage.removeAttribute('src');
  }
  function pinFlashback(actorId,label='',untilLine=0){
    const def=ACTOR_DEFS?.[actorId];
    showOverlayImage(resolveActorAsset?.(actorId,'default'),label||def?.code||'',def?.name||label||actorId,actorId,0);
    els.flashbackLayer?.classList.remove('interactive');
    pinnedFlashbackSceneId=currentScene()?.id||null;
    pinnedFlashbackUntilLine=untilLine;
  }
  function syncPinnedFlashback(){
    if(!pinnedFlashbackSceneId)return;
    const scene=currentScene();
    if(!scene||scene.id!==pinnedFlashbackSceneId||state.lineIndex>pinnedFlashbackUntilLine){hideFlashback();}
  }
  function showOverlayImage(path,label='',fallback='',datasetActor='overlay',duration=900){
    if(!els.flashbackLayer)return;
    hideFlashback();
    els.flashbackLabel.textContent=label||'';
    els.flashbackFallback.textContent=fallback||label||'';
    els.flashbackFallback.classList.toggle('hidden',!!path);
    els.flashbackLayer.classList.remove('hidden');els.flashbackLayer.setAttribute('aria-hidden','false');els.flashbackLayer.dataset.actor=datasetActor;
    if(path){setResilientImage(els.flashbackImage,path,{onLoad:()=>{els.flashbackImage.classList.remove('hidden');els.flashbackFallback.classList.add('hidden')},onError:()=>{els.flashbackImage.classList.add('hidden');els.flashbackFallback.classList.remove('hidden')}})}
    if(duration>0)setTimeout(hideFlashback,qaDelay(duration));
  }
  function showFlashback(actorId,label='',duration=900){
    const def=ACTOR_DEFS?.[actorId];
    showOverlayImage(resolveActorAsset?.(actorId,'default'),label||def?.code||'',def?.name||label||actorId,actorId,duration);
  }
  function showInteractiveFlashback(actorId,label='',onContinue=null){
    const def=ACTOR_DEFS?.[actorId];
    showOverlayImage(resolveActorAsset?.(actorId,'default'),label||def?.code||'',def?.name||label||actorId,actorId,0);
    flashbackDone=typeof onContinue==='function'?onContinue:null;
    els.flashbackLayer?.classList.add('interactive');
  }
  function continueFlashback(){
    if(!flashbackDone)return;
    const done=flashbackDone;flashbackDone=null;hideFlashback();haptic(6);done();
  }
  function playFinalLockIntro(scene){
    if(!els.finalLockFx||scene.id!=='scene-30'||finalLockScenePlayed===scene.id)return;
    finalLockScenePlayed=scene.id;els.finalLockFx.innerHTML=LOGIC_BULLETS.map(b=>`<span>${escapeHtml(b.name)}<i>LOCK</i></span>`).join('');
    els.finalLockFx.classList.remove('hidden');requestAnimationFrame(()=>els.finalLockFx.classList.add('show'));
    setTimeout(()=>{els.finalLockFx.classList.remove('show');setTimeout(()=>els.finalLockFx.classList.add('hidden'),qaDelay(300))},qaDelay(1450));
  }
  function applySceneVisual(scene){
    const visual=SCENE_VISUALS?.[scene.id]||{},memoryDetail=MEMORY_DETAIL[scene.id]||null;
    screens.story.dataset.sceneId=scene.id;
    els.stage.dataset.memory=memoryDetail?.code||visual.memory||'';
    els.stage.dataset.memoryTheme=memoryDetail?.theme||visual.memoryTheme||'';
    if(memoryDetail?.label)els.stage.dataset.memoryLabel=memoryDetail.label;else delete els.stage.dataset.memoryLabel;
    els.stage.classList.toggle('mirror-scene',!!visual.mirror);
    const isFinal=scene.chapter==='FINAL'||!!visual.final;screens.story.classList.toggle('final-mode',isFinal);
    if(isFinal)screens.story.dataset.finalPhase=FINAL_PHASE_MAP?.[scene.id]||'lock';else delete screens.story.dataset.finalPhase;
  }
  function applyDirectorContext(cue,line){
    const scene=currentScene(),focus=cue?.focus||line?.actorId||null;activateActor(focus);els.stage.dataset.camera=cue?.camera||'default';
    $$('.actor').forEach(a=>{const id=a.dataset.actor;let pose=poseForLine?.(scene?.id,state.lineIndex,id)||'default';if(id===focus&&cue?.pose)pose=cue.pose;if(pose&&pose!=='default')a.dataset.pose=pose;else delete a.dataset.pose;setActorImage(a,resolveActorAsset?.(id,pose))});
  }

  function prepareScene(){
    const s=currentScene();
    if(!s)return finishStory();
    clearOpeningNarration();screens.story.classList.remove('ending-fade','unknown-voice-mode','event-backdrop-mode');els.stage.style.opacity='1';els.actorLayer?.classList.remove('solo-focus');syncPinnedFlashback();
    screens.story.dataset.chapterType=s.chapter==='FINAL'?'final':s.chapter==='REALIZATION'?'realization':s.chapter==='EPILOGUE'?'epilogue':String(s.chapter||'').includes('MEMORY')?'memory':'story';
    screens.story.classList.toggle('dream-memory-mode',s.tone==='dream');
    hidePersistentSceneVisual();
    if(s.id==='scene-04')showPinnedSceneDoc('anne_accession','앤 여왕 즉위 보고서');else hidePinnedSceneDoc();
    els.chapter.textContent=s.chapter;
    els.scene.textContent=`SCENE ${String(s.number).padStart(2,'0')} · ${s.title}`;
    els.stage.dataset.tone=s.tone;
    const uiTone=s.chapter==='FINAL'?'final':s.chapter==='REALIZATION'?'realization':s.chapter==='EPILOGUE'?'epilogue':(s.tone==='dream'||String(s.chapter||'').includes('MEMORY'))?'memory':s.country==='FRANCE'?'france':'england';
    screens.story.dataset.uiTone=uiTone;
    els.place.innerHTML=`<small>${escapeHtml(s.country)}</small><strong>${escapeHtml(s.place)}</strong>`;
    renderStageActors(s);applySceneAsset(s);applySceneVisual(s);preloadSceneAssets(state.sceneIndex);AudioManager.play(sceneBgmKey?.(s,state.lineIndex)||'ENGLAND');
    els.stage.dataset.camera='default';delete els.actorLayer.dataset.shotPhase;
    if(s.chapter!=='FINAL')els.stage.classList.remove('sun-active');
    els.finalBulletBadge.classList.toggle('hidden',s.chapter!=='FINAL');
    if(s.chapter==='FINAL')playFinalLockIntro(s);else finalLockScenePlayed=null;
    beforeBeatKey=null;afterBeatKey=null;
    updateProgress();syncFinalPressure();
    let entryHold=pendingSceneEntryHold;pendingSceneEntryHold=0;
    if(s.id==='scene-06'&&state.lineIndex===0&&!(teacherPreviewMode&&teacherFastMode)){
      screens.story.classList.remove('eye-return','eye-opening');void screens.story.offsetWidth;screens.story.classList.add('eye-opening');
      setTimeout(()=>screens.story.classList.remove('eye-opening'),qaDelay(3050));
      entryHold=Math.max(entryHold,2850);
    }else if(s.id==='scene-38'&&state.lineIndex===0&&!(teacherPreviewMode&&teacherFastMode)){
      screens.story.classList.remove('eye-opening','eye-return');void screens.story.offsetWidth;screens.story.classList.add('eye-return');
      setTimeout(()=>screens.story.classList.remove('eye-return'),qaDelay(2950));
      entryHold=Math.max(entryHold,2550);
    }else screens.story.classList.remove('eye-opening','eye-return');
    if(entryHold>0&&!(teacherPreviewMode&&teacherFastMode)){
      clearTyping();els.panel.classList.add('hidden');els.intertitle.classList.add('hidden');busy=true;if(sceneEntryTimer)clearTimeout(sceneEntryTimer);
      sceneEntryTimer=setTimeout(()=>{sceneEntryTimer=null;busy=false;renderCurrent()},qaDelay(entryHold));
    }else renderCurrent();
  }

  function applyMappedVisual(effect){
    const cfg=VISUAL_MAP?.[effect];if(!cfg)return false;
    if(cfg.flashbackActor)showFlashback(cfg.flashbackActor,cfg.flashbackLabel,cfg.duration||900);
    return true;
  }
  function triggerEffect(effect,meta={}){
    if(!effect||effect==='none')return;
    applyMappedVisual(effect);
    switch(effect){
      case 'caption':break;
      case 'fade_black':if(currentScene()?.id==='scene-40'){screens.story.classList.add('ending-fade');els.stage.style.opacity='0'}break;
      case 'flash_white':break;
      case 'dark_pulse':break;
      case 'seal':{const k=propForCurrentLine('seal')||'dream_red_seal',r=persistentPropFor(currentScene()?.id,state.lineIndex);showProp(k,{hold:1350,persistent:r?.key===k});}AudioManager.sfx('SEAL');break;
      case 'document':{const k=propForCurrentLine('document')||'bill_of_rights',r=persistentPropFor(currentScene()?.id,state.lineIndex);showProp(k,{hold:1450,persistent:r?.key===k});}AudioManager.sfx('PAGE');break;
      case 'show_prop':if(meta.propKey){if(currentScene()?.id==='scene-04'&&meta.propKey==='anne_accession')showPinnedSceneDoc('anne_accession','앤 여왕 즉위 보고서');else{const r=persistentPropFor(currentScene()?.id,state.lineIndex);showProp(meta.propKey,{hold:meta.propHold||1500,persistent:r?.key===meta.propKey})}}break;
      case 'flashback_history':showFlashback('louis14','과거의 루이',980);break;
      case 'charles_flash':{const cfg=backdropEventFor(currentScene(),state.lineIndex);if(cfg){showPersistentSceneVisual(cfg.key);screens.story.classList.add('event-backdrop-mode');hideProp({immediate:true});hidePinnedSceneDoc();}else if(!showSpecialImage('charles_door_flash',980))showFlashback('charles1','CHARLES I',900);}break;
      case 'charles_reveal':break;
      case 'throat_clear':AudioManager.sfx('THROAT');break;
      case 'summon_parliament':AudioManager.sfx('SUMMON');break;
      case 'reversal':break;
      case 'sun_fill':els.stage.classList.add('sun-active');break;
      case 'sunburst':els.stage.classList.add('sun-active');break;
      case 'freeze':break;
      case 'sun_fade':els.stage.classList.remove('sun-active');break;
      case 'reverse_rebuttal':AudioManager.sfx('REVERSE');break;
      case 'debate_start':break;
      case 'memory':break;
      default:break;
    }
  }

  function renderOpeningAutoLine(line){
    clearTyping();activateActor(null);els.actorLayer?.classList.remove('solo-focus');els.panel.classList.add('hidden');els.intertitle.classList.add('hidden');
    screens.story.classList.add('opening-black');
    record(line);updateProgress();save();busy=true;
    if(!els.openingOverlay||!els.openingText){busy=false;return renderVisibleLine(line,true)}
    els.openingText.textContent=line.text||'';
    els.openingOverlay.classList.remove('hidden','show','fade');
    els.openingOverlay.setAttribute('aria-hidden','false');
    // Two frames guarantee a real opacity transition after display:none is released.
    requestAnimationFrame(()=>requestAnimationFrame(()=>els.openingOverlay?.classList.add('show')));
    openingTimerA=setTimeout(()=>{
      els.openingOverlay.classList.add('fade');
      openingTimerB=setTimeout(()=>{
        clearOpeningNarration();busy=false;state.lineIndex++;if(state.lineIndex>2)screens.story.classList.remove('opening-black');beforeBeatKey=null;afterBeatKey=null;save();renderCurrent();
      },qaDelay(700));
    },qaDelay(openingHoldFor(state.lineIndex)+700));
  }

  function renderVisibleLine(line,skipBeat=false){
    const cue=currentCue(),key=lineKey(),quiet=keyQuietTiming(line),beatBefore=Math.max(cue?.beatBefore||0,quiet?.before||0);
    const unknownVoice=line.type==='dialogue'&&(line.speaker==='???'||line.actorId==='unknown');
    screens.story.classList.toggle('unknown-voice-mode',unknownVoice);
    if(!skipBeat&&beatBefore&&beforeBeatKey!==key){
      beforeBeatKey=key;busy=true;clearTyping();els.panel.classList.add('hidden');
      applyDirectorContext(cue,line);clearDirectionTimer();
      directionTimer=setTimeout(()=>{directionTimer=null;busy=false;renderVisibleLine(line,true)},qaDelay(beatBefore));
      return;
    }
    els.intertitle.classList.add('hidden');
    const tier=narrationTier(line),actionNarration=tier==='action',atmosphereNarration=tier==='atmosphere',historyNarration=tier==='history';
    const soloFocus=line.type==='monologue'||(currentScene()?.id==='scene-01'&&line.actorId==='louis14'&&state.lineIndex>=4&&state.lineIndex<=10);
    els.actorLayer?.classList.toggle('solo-focus',soloFocus);
    els.panel.classList.remove('hidden','narration','monologue','narration-action','narration-context','narration-atmosphere','narration-history','key-silence','summon-line','emotion-line','reverse-impact-line','constitutional-line');
    els.panel.classList.toggle('narration',line.type==='narration');
    els.panel.classList.toggle('monologue',line.type==='monologue');
    els.panel.classList.toggle('narration-action',actionNarration);
    els.panel.classList.toggle('narration-atmosphere',atmosphereNarration);
    els.panel.classList.toggle('narration-history',historyNarration);
    els.panel.classList.toggle('narration-context',line.type==='narration'&&!actionNarration);
    els.panel.classList.toggle('key-silence',!!quiet);
    els.lineMode.textContent=line.type==='narration'?'NARRATION':line.type==='monologue'?'INNER VOICE':'';
    els.speaker.textContent=line.type==='narration'?'':(line.speaker||'');
    const group=line.type==='narration'?'narration':line.type==='monologue'?'monologue':(ACTOR_DEFS?.[line.actorId]?.group||'neutral');
    syncActorPresence(currentScene());
    const spokenText=String(line.text||''),keyLine=isKeyLine(spokenText),emotionLine=line.type==='dialogue'&&(spokenText.length<=48&&(keyLine||/[!！]/.test(spokenText))),heatedLine=line.type==='dialogue'&&(/처형|짐이\s*곧\s*국가다|짐은\s*태양이다|감히\s*나를|신에게서\s*왔다/.test(spokenText)||currentScene()?.id==='scene-33');
    els.panel.dataset.speakerGroup=group;els.panel.classList.toggle('long-line',spokenText.length>=72);els.panel.classList.toggle('key-line',keyLine);
    els.panel.classList.toggle('emotion-line',emotionLine);
    els.panel.classList.toggle('heated-line',heatedLine);
    els.panel.classList.toggle('reverse-impact-line',spokenText.includes('그건 프랑스입니다.'));
    els.panel.classList.toggle('constitutional-line',spokenText.includes('영국에서 왕은 군림하되 통치하지 않는다.'));
    els.panel.classList.toggle('summon-line',/의회를\s*소집하라/.test(spokenText));
    applyDirectorContext(cue,line);
    requestAnimationFrame(()=>layoutPortraits());
    const effect=cue?.effect||line.effect;if(effect)triggerEffect(effect,Object.assign({},line,cue||{}));
    if(line.type==='dialogue'&&!unknownVoice&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const active=els.actorLayer?.querySelector('.actor.active');
      const text=String(line.text||''),pose=active?.dataset?.pose||'',anneReact=line.actorId==='anne_louis'&&(effect==='summon_parliament'||['shocked','puzzled','annoyed','furious'].includes(pose)&&/[!?？！…]/.test(text));
      if(active&&/[!！]/.test(text)){active.classList.remove('shout-shake');void active.offsetWidth;active.classList.add('shout-shake');setTimeout(()=>active.classList.remove('shout-shake'),qaDelay(520));}
      if(active&&anneReact){active.classList.remove('react-shake');void active.offsetWidth;active.classList.add('react-shake');setTimeout(()=>active.classList.remove('react-shake'),qaDelay(620));}
    }
    record(line);typeText(line.text||'',{instant:false,speed:historyNarration ? 1.16 : (line.type==='narration' ? 1.10 : 1)});updateProgress();save();
  }

  function intertitleKind(line){
    const s=currentScene();
    if(line.effect==='memory')return 'memory';
    if(line.effect==='debate_start')return 'debate';
    if(line.effect==='document')return 'document';
    if(s?.chapter==='FINAL')return 'final';
    return 'story';
  }
  function renderIntertitle(line){
    delete els.actorLayer.dataset.shotPhase;els.actorLayer?.classList.remove('solo-focus');clearTyping();activateActor(null);els.panel.classList.add('hidden');
    els.intertitle.classList.remove('hidden','kind-memory','kind-debate','kind-document','kind-final','kind-story');
    const kind=intertitleKind(line);els.intertitle.classList.add(`kind-${kind}`);
    els.intertitle.dataset.effect=line.effect||'';
    els.interKicker.textContent=line.effect==='concept_popup'?'LOGIC NOTE':kind==='memory'?'ENGLISH MEMORY':kind==='debate'?'DEBATE START':kind==='document'?'THE ENGLISH CROWN':kind==='final'?'FINAL':'STORY';
    els.interTitle.textContent=line.title||'';els.interSub.textContent=line.subtitle||'';
    updateProgress();save();
  }

  function executeDirection(line){
    delete els.actorLayer.dataset.shotPhase;els.actorLayer?.classList.remove('solo-focus');const cue=currentCue(),scene=currentScene(),special=SPECIAL_CUE_MAP?.[`${scene?.id}:${state.lineIndex}`]||null;clearTyping();activateActor(cue?.focus||null);els.panel.classList.add('hidden');els.intertitle.classList.add('hidden');applyDirectorContext(cue,line);
    const resolvedEffect=cue?.effect||line.effect;updateProgress();save();busy=true;clearDirectionTimer();
    const finishDirection=()=>{busy=false;state.lineIndex++;beforeBeatKey=null;afterBeatKey=null;save();renderCurrent()};
    // Past Louis should remain visible together with the following dialogue box.
    if(resolvedEffect==='flashback_history'){
      pinFlashback('louis14','과거의 루이',state.lineIndex+1);
      directionTimer=setTimeout(()=>{directionTimer=null;finishDirection()},qaDelay(80));
      return;
    }
    // Remove the awkward freeze after “그건 프랑스입니다.”; advance invisibly.
    if(scene?.id==='scene-34'&&resolvedEffect==='freeze'){finishDirection();return}
    // Event images now become persistent scene backdrops. Give the illustration a
    // short establishing beat, then continue the dialogue on top of the same image.
    const eventBackdrop=backdropEventFor(scene,state.lineIndex);
    if(eventBackdrop){
      showPersistentSceneVisual(eventBackdrop.key);screens.story.classList.add('event-backdrop-mode');
      hideSpecial();hideProp({immediate:true});hidePinnedSceneDoc();hideFlashback();
      if(resolvedEffect==='seal')AudioManager.sfx('SEAL');
      directionTimer=setTimeout(()=>{directionTimer=null;finishDirection()},qaDelay(700));return;
    }
    if(!special?.suppressEffect)triggerEffect(resolvedEffect,Object.assign({},line,cue||{}));
    if(special){const interactiveEnabled=!!special.interactive&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!(teacherPreviewMode&&teacherFastMode);const shown=showSpecialImage(special.key,special.hold||1200,{interactive:interactiveEnabled,minHold:special.minHold||900,onContinue:interactiveEnabled?finishDirection:null});if(shown&&interactiveEnabled)return}
    const delay=qaDelay(Math.max(50,cue?.hold||0,line.delay||90,special?.hold||0));directionTimer=setTimeout(()=>{directionTimer=null;finishDirection()},delay);
  }

  function renderCurrent(){
    syncPinnedFlashback();syncActorPresence(currentScene());syncPersistentProp();syncFinalPressure();
    const s=currentScene();if(!s)return finishStory();
    const line=currentLine();if(!line)return nextScene();
    if(!state.debate)AudioManager.play(sceneBgmKey?.(s,state.lineIndex)||'ENGLAND');
    syncBackdropEventMode();
    screens.story.classList.toggle('unknown-voice-mode',line.type==='dialogue'&&(line.speaker==='???'||line.actorId==='unknown'));
    if(line.type==='direction')return executeDirection(line);
    if(line.type==='debate')return startDebate(line.debateId);
    if(line.type==='intertitle')return renderIntertitle(line);
    if(isOpeningAutoLine(line))return renderOpeningAutoLine(line);
    if(isShortActionBeat(line))return renderActionBeat(line);
    return renderVisibleLine(line);
  }

  function incrementStoryLine(){
    state.lineIndex++;beforeBeatKey=null;afterBeatKey=null;save();renderCurrent();
  }
  function advanceStory(){
    if(busy||els.history.open||els.concept.open||els.menu.open||els.teacher.open)return;
    const now=performance.now(),guard=teacherPreviewMode&&teacherFastMode?45:170;
    if(now-lastStoryInputAt<guard)return;lastStoryInputAt=now;
    const line=currentLine();if(!line)return;
    if(line.type==='intertitle'){haptic(8);if(line.effect==='concept_popup')showConceptToast(line.title||'');els.intertitle.classList.add('hidden');incrementStoryLine();return}
    if(finishTyping()){haptic(5);return}
    const cue=currentCue(),key=lineKey(),quiet=keyQuietTiming(line),beatAfter=Math.max(cue?.beatAfter||0,quiet?.after||0);
    if(beatAfter&&afterBeatKey!==key){
      afterBeatKey=key;busy=true;els.hint.textContent='…';haptic(7);clearDirectionTimer();
      directionTimer=setTimeout(()=>{directionTimer=null;busy=false;incrementStoryLine()},qaDelay(beatAfter));
      return;
    }
    haptic(7);incrementStoryLine();
  }

  function nextScene(){
    clearTyping();clearDirectionTimer();clearSpecialState();clearOpeningNarration();clearActionBeat();const from=currentScene(),nextIndex=state.sceneIndex+1,next=STORY_DATA[nextIndex];busy=true;
    const proceed=()=>{
      sceneExitTimer=null;
      if(!next){state.sceneIndex=nextIndex;state.lineIndex=0;save();busy=false;return finishStory()}
      const newSet=(from?.place!==next?.place)||((SCENE_ASSET_MAP?.[from?.id]||'')!==(SCENE_ASSET_MAP?.[next?.id]||''));
      const timeCue=!!transitionLabelFor(from,next);
      const move=()=>{state.sceneIndex=nextIndex;state.lineIndex=0;beforeBeatKey=null;afterBeatKey=null;save();pendingSceneEntryHold=(newSet||timeCue)?1180:0;prepareScene()};
      if(newSet||timeCue){runSceneFade(from,next,move);return}
      busy=false;move();
    };
    const hold=sceneOutroHoldFor(from,next);
    if(hold>0){sceneExitTimer=setTimeout(proceed,qaDelay(hold));return}
    proceed();
  }

  function startStory(fromStart=false){
    if(fromStart)reset();
    state.started=true;state.endingSeen=false;state.debate=null;show('story');prepareScene();save();
  }
  function finishStory(){
    clearTyping();clearDirectionTimer();clearOpeningNarration();clearActionBeat();hidePersistentSceneVisual();hidePinnedSceneDoc();hideConceptToast();hideSpecial();hideFlashback();hideProp({immediate:true});clearDebateReadWindow();prepareEndArt();
    state.endingSeen=true;state.debate=null;save();busy=true;
    const revealEnd=()=>{show('end');busy=false;setTimeout(()=>screens.story.classList.remove('ending-fade'),80)};
    if(screens.story.classList.contains('ending-fade'))setTimeout(revealEnd,qaDelay(820));else setTimeout(revealEnd,qaDelay(260));
  }

  // ---------------- DEBATE ----------------
  function applyDebateCast(){const a=resolveActorAsset?.('anne_louis','debate')||resolveActorAsset?.('anne_louis','default')||'';const m=resolveActorAsset?.('mp_leader','firm')||resolveActorAsset?.('mp_leader','default')||'';if(els.debateAnneImage&&a)setResilientImage(els.debateAnneImage,a);if(els.debateMpImage&&m)setResilientImage(els.debateMpImage,m)}
  function startDebate(id){
    clearTyping();clearDirectionTimer();busy=false;
    const d=DEBATE_DATA[id];if(!d)return;
    if(!state.debate||state.debate.id!==id)state.debate={id,round:0,wrong:0,phase:'aim',selected:null,lastMiss:null};
    else state.debate=Object.assign({round:0,wrong:0,phase:'aim',selected:null,lastMiss:null},state.debate);
    AudioManager.play('DEBATE');
    screens.debate.dataset.debate=id;screens.debate.classList.remove('debate-hit','debate-miss');debateReadKey=null;clearDebateReadWindow();
    show('debate');applyDebateCast();renderDebate();save();
  }

  function statementHtml(raw){
    const re=/\[\[([^|\]]+)\|([^\]]+)\]\]/g;
    let out='',last=0,m;
    while((m=re.exec(raw))){
      out+=escapeHtml(raw.slice(last,m.index));
      out+=`<span class="claim-target" role="button" tabindex="0" data-target="${escapeHtml(m[1])}">${escapeHtml(m[2])}</span>`;
      last=re.lastIndex;
    }
    out+=escapeHtml(raw.slice(last));
    return out;
  }

  function hideDebateTutorial(){els.debateTutorial?.classList.add('hidden')}
  function maybeShowDebateTutorial(){
    if(state.debate?.id==='tax'&&state.debate.round===0&&!state.debateTutorialSeen){els.debateTutorial?.classList.remove('hidden');return true}
    hideDebateTutorial();return false;
  }
  function hintMessage(r,wrong){
    if(wrong<=0)return null;
    if(wrong===1)return '이 탄환은 이 논점을 겨냥하지 않습니다. 문장을 다시 읽어 보세요.';
    if(wrong===2)return '표시된 논점 후보와 탄환의 연결을 다시 비교해 보세요.';
    if(wrong===3)return r.hint||'왕과 의회의 역할이 어떻게 다른지 살펴보세요.';
    return r.categoryHint||r.hint||'핵심 개념과 논점의 관계를 다시 확인하세요.';
  }
  function updateLoadedBullet(){
    if(!els.loadedBullet)return;const b=bulletById(state.debate?.selected);
    if(!b){els.loadedBullet.classList.add('hidden');els.loadedBullet.textContent='';return}
    els.loadedBullet.textContent=`장전 · ${b.name}`;els.loadedBullet.classList.remove('hidden','pop');void els.loadedBullet.offsetWidth;els.loadedBullet.classList.add('pop');
  }
  function renderDebate(){
    const d=DEBATE_DATA[state.debate?.id];if(!d)return;
    const r=d.rounds[state.debate.round];
    screens.debate.dataset.debate=state.debate.id;screens.debate.dataset.round=String(state.debate.round+1);
    els.debateNumber.textContent=d.number;els.debateTopic.textContent=d.topic;
    els.count.textContent=`논리탄환 ${TOTAL_BULLETS-state.usedBullets.length} / ${TOTAL_BULLETS}`;
    if(state.debate.phase==='clear')return renderDebateClear(d);
    if(!r)return endDebate();
    els.rail.style.animationDuration=`${Math.max(7,d.speed-(state.debate.round*.7))}s`;
    if(state.debate.phase==='rebuttal')return renderRebuttal(d,r);
    els.rebuttal.classList.add('hidden');els.rebuttal.classList.remove('clear-mode');if(els.rebuttalLogic)els.rebuttalLogic.classList.add('hidden');
    els.rail.classList.remove('paused');
    const readKey=`${state.debate.id}:${state.debate.round}`;
    if(debateReadKey!==readKey){debateReadKey=readKey;debateReadLocked=true;screens.debate.classList.add('reading-first');if(debateReadTimer)clearTimeout(debateReadTimer);debateReadTimer=setTimeout(()=>{debateReadTimer=null;debateReadLocked=false;screens.debate.classList.remove('reading-first');renderDebate()},qaDelay(900))}
    screens.debate.classList.toggle('armed',!!state.debate.selected&&!debateReadLocked);
    screens.debate.classList.toggle('second-look',state.debate.wrong>=2);
    els.statement.innerHTML=statementHtml(r.statement);
    const stagedHint=hintMessage(r,state.debate.wrong);
    const prompt=debateReadLocked?'먼저 의원의 논점을 읽어보세요':(stagedHint||(state.debate.selected?'논점 후보를 조준해 발사하세요':'논리탄환을 고르세요'));
    els.debatePrompt.textContent=prompt;renderBulletDeck({mode:'normal',round:r});updateLoadedBullet();
    $$('.claim-target').forEach(target=>{
      target.addEventListener('click',hitClaimTarget);
      target.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();hitClaimTarget(ev)}});
    });
    updateProgress();save();maybeShowDebateTutorial();
  }

  function renderBulletDeck(options={}){
    const mode=options.mode||'normal',round=options.round||null;
    els.deck.innerHTML='';
    LOGIC_BULLETS.forEach(b=>{
      const used=state.usedBullets.includes(b.id);
      const rescue=mode==='rescue'&&!used&&round?.answer===b.id;
      const btn=document.createElement('button');
      btn.className=`bullet${used?' used':''}${state.debate?.selected===b.id?' selected':''}${rescue?' hint-visible':''}`;
      btn.disabled=used||debateReadLocked;btn.dataset.id=b.id;
      btn.innerHTML=`<strong>${escapeHtml(b.name)}</strong><small>${escapeHtml(rescue?b.definition:'')}</small>`;
      btn.addEventListener('click',()=>selectBullet(b.id));els.deck.append(btn);
    });
  }

  function selectBullet(id){
    if(busy||debateReadLocked||!state.debate||state.usedBullets.includes(id)||state.debate.phase!=='aim')return;
    state.debate.selected=id;screens.debate.classList.add('armed');
    els.debatePrompt.textContent='논점 후보를 조준해 발사하세요';renderBulletDeck({mode:'normal',round:DEBATE_DATA[state.debate.id].rounds[state.debate.round]});updateLoadedBullet();haptic(11);save();
  }
  function fireAimAt(target){
    const arenaRect=els.arena.getBoundingClientRect(),rect=target.getBoundingClientRect(),endX=rect.left-arenaRect.left+rect.width/2,endY=rect.top-arenaRect.top+rect.height/2;els.aim.style.left=`${endX}px`;els.aim.style.top=`${endY}px`;els.aim.classList.remove('fire');void els.aim.offsetWidth;els.aim.classList.add('fire');
    if(els.shotTrail){const startX=arenaRect.width*.50,startY=arenaRect.height*.83,dx=endX-startX,dy=endY-startY,len=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI;els.shotTrail.style.left=`${startX}px`;els.shotTrail.style.top=`${startY}px`;els.shotTrail.style.transform=`rotate(${ang}deg)`;els.shotTrail.style.setProperty('--trail-length',`${len}px`);els.shotTrail.classList.remove('fire');void els.shotTrail.offsetWidth;els.shotTrail.classList.add('fire')}
  }
  function impact(text,miss=false){
    els.impact.textContent=text;els.impact.style.color=miss?'#e27d83':'';
    els.impact.classList.remove('show');void els.impact.offsetWidth;els.impact.classList.add('show');
  }

  function hitClaimTarget(ev){
    if(busy||debateReadLocked||!state.debate||state.debate.phase!=='aim')return;
    if(!state.debate.selected){els.debatePrompt.textContent='먼저 논리탄환을 선택하세요';haptic(6);return}
    const target=ev.currentTarget;const targetId=target?.dataset?.target||'';
    els.rail.classList.add('paused');fireAimAt(target);
    const d=DEBATE_DATA[state.debate.id],r=d.rounds[state.debate.round];
    const correctBullet=state.debate.selected===r.answer,correctTarget=targetId===r.answerTarget;
    if(!(correctBullet&&correctTarget)){
      state.debate.wrong++;
      const missText='이 탄환은 이 논점을 겨냥하지 않습니다.';
      state.debate.lastMiss=missText;state.debate.selected=null;screens.debate.classList.remove('debate-hit');screens.debate.classList.add('debate-miss');impact(missText,true);AudioManager.sfx('MISS');haptic([14,22,14]);save();updateLoadedBullet();
      setTimeout(()=>{screens.debate.classList.remove('debate-miss');renderDebate()},qaDelay(520));return;
    }
    uniquePush(state.usedBullets,r.answer);uniquePush(state.unlockedConcepts,r.answer);
    state.debate.phase='rebuttal';state.debate.selected=null;state.debate.lastMiss=null;save();
    busy=true;screens.debate.classList.remove('debate-miss');screens.debate.classList.add('debate-hit');els.arena.classList.add('hit-stop');setTimeout(()=>els.arena.classList.remove('hit-stop'),qaDelay(190));AudioManager.sfx('HIT');haptic([28,25,65]);updateLoadedBullet();
    setTimeout(()=>impact('논파!'),qaDelay(125));
    setTimeout(()=>{busy=false;screens.debate.classList.remove('debate-hit');renderDebate()},qaDelay(860));
  }

  function answerTargetLabel(statement,targetId){
    const re=/\[\[([^|\]]+)\|([^\]]+)\]\]/g;let m;
    while((m=re.exec(statement||'')))if(m[1]===targetId)return m[2];
    return '핵심 논점';
  }
  function renderRebuttal(d,r){
    screens.debate.classList.remove('armed');els.rail.classList.add('paused');renderBulletDeck({mode:'normal'});
    els.debatePrompt.textContent='반박 성공';els.rebuttalLabel.textContent='REBUTTAL';els.rebuttalTitle.textContent='논파!';
    const bullet=bulletById(r.answer),target=answerTargetLabel(r.statement,r.answerTarget);
    if(els.rebuttalLogic){els.rebuttalLogic.innerHTML=`<span>논리탄환 <b>${escapeHtml(bullet?.name||'')}</b></span><i>→</i><span>반박 논점 <b>${escapeHtml(target)}</b></span>`;els.rebuttalLogic.classList.remove('hidden')}
    els.rebuttalText.textContent=r.rebuttal;els.rebuttalNext.textContent='반박을 확인하고 계속';
    els.rebuttal.classList.remove('hidden','clear-mode');save();
  }
  function renderDebateClear(d){
    screens.debate.classList.remove('armed');els.rail.classList.add('paused');renderBulletDeck({mode:'normal'});
    if(els.debateAnneImage)els.debateAnneImage.src=resolveActorAsset?.('anne_louis','confident')||resolveActorAsset?.('anne_louis','debate')||'';if(els.debateMpImage)els.debateMpImage.src=resolveActorAsset?.('mp_leader','default')||'';
    if(els.rebuttalLogic)els.rebuttalLogic.classList.add('hidden');
    els.debatePrompt.textContent='논쟁 종료';els.rebuttalLabel.textContent=d.number;els.rebuttalTitle.textContent='DEBATE CLEAR';
    els.rebuttalText.textContent='두 개의 논리를 모두 연결했다. 이야기를 계속 진행합니다.';
    els.rebuttalNext.textContent='스토리로 돌아가기';els.rebuttal.classList.remove('hidden');els.rebuttal.classList.add('clear-mode');
    save();
  }
  function continueRebuttal(){
    if(!state.debate)return;
    const d=DEBATE_DATA[state.debate.id];
    if(state.debate.phase==='clear')return endDebate();
    if(state.debate.phase!=='rebuttal')return;
    const nextRound=state.debate.round+1;
    state.debate.wrong=0;state.debate.selected=null;
    if(nextRound>=d.rounds.length)state.debate.phase='clear';
    else{state.debate.round=nextRound;state.debate.phase='aim';debateReadKey=null;clearDebateReadWindow()}
    save();renderDebate();
  }
  function endDebate(){
    if(busy)return;busy=true;clearDebateReadWindow();debateReadKey=null;screens.debate.classList.add('debate-exit-linger');if(els.rebuttalNext)els.rebuttalNext.disabled=true;
    if(debateExitTimer)clearTimeout(debateExitTimer);
    debateExitTimer=setTimeout(()=>{
      debateExitTimer=null;screens.debate.classList.remove('debate-exit-linger');if(els.rebuttalNext)els.rebuttalNext.disabled=false;
      state.debate=null;state.lineIndex++;beforeBeatKey=null;afterBeatKey=null;hideDebateTutorial();save();show('story');screens.story.classList.add('returning-from-debate');busy=false;prepareScene();setTimeout(()=>screens.story.classList.remove('returning-from-debate'),qaDelay(420));
    },qaDelay(520));
  }

  // ---------------- ARCHIVES ----------------
  function renderHistory(){
    els.historyList.innerHTML=state.history.length?state.history.map(i=>`<div class="history-item"><b>${escapeHtml(i.speaker)} · ${escapeHtml(i.scene)}</b><span>${escapeHtml(i.text)}</span></div>`).join(''):'<p>아직 기록된 대사가 없습니다.</p>';
    els.historyList.scrollTop=els.historyList.scrollHeight;
  }
  function openHistory(){renderHistory();els.history.showModal();haptic(7)}
  function renderConcepts(){
    els.conceptList.innerHTML=LOGIC_BULLETS.map(b=>{
      const unlocked=state.unlockedConcepts.includes(b.id);
      return `<div class="concept-card${unlocked?'':' locked'}"><strong>${unlocked?escapeHtml(b.name):'???'}</strong><span>${unlocked?escapeHtml(b.definition):'논쟁에서 올바르게 사용하면 기록됩니다.'}</span></div>`;
    }).join('');
  }
  function openConcepts(){renderConcepts();els.concept.showModal();haptic(7)}

  // ---------------- TEACHER PREVIEW ----------------
  function updateTeacherPreviewBadge(){
    if(!els.teacherPreviewBadge)return;
    els.teacherPreviewBadge.classList.toggle('hidden',!teacherPreviewMode);
  }
  function beginTeacherPreview(){
    if(teacherPreviewMode)return;
    teacherSnapshot=clone(state);teacherPreviewMode=true;updateTeacherPreviewBadge();
  }
  function exitTeacherPreview(){
    clearTyping();clearDirectionTimer();busy=false;
    state=teacherSnapshot?normalizeState(clone(teacherSnapshot)):load();
    teacherSnapshot=null;teacherPreviewMode=false;teacherFastMode=false;document.body.classList.remove('qa-fast');beforeBeatKey=null;afterBeatKey=null;
    updateTeacherPreviewBadge();updateTitle();show('title');
  }
  function persistentStateForDebug(){
    try{
      const found=readRawState();return found?normalizeState(JSON.parse(found.raw)):baseState();
    }catch{return baseState()}
  }
  function renderTeacherDebug(){
    if(!els.teacherDebug)return;
    const p=persistentStateForDebug();
    const scene=STORY_DATA[p.sceneIndex];
    const debate=p.debate?`${p.debate.id} / R${p.debate.round+1} / ${p.debate.phase}`:'없음';
    els.teacherDebug.innerHTML=`<b>${APP_VERSION}</b><span>저장 장면: ${escapeHtml(scene?`SCENE ${String(scene.number).padStart(2,'0')} · ${scene.title}`:'없음')}</span><span>line: ${p.lineIndex} · debate: ${escapeHtml(debate)}</span><span>USED: ${p.usedBullets.length}/${TOTAL_BULLETS} · 기록: ${p.history.length}/${HISTORY_LIMIT}</span><span>FAST QA: ${teacherFastMode?'ON':'OFF'} · BGM: ${state.audio?.enabled?'ON':'OFF'}</span><span>교사용 점프는 학생 저장을 변경하지 않습니다.</span>`;
  }
  function jumpToScene(index){
    const s=STORY_DATA[index];if(!s)return;beginTeacherPreview();
    clearTyping();clearDirectionTimer();busy=false;
    state.started=true;state.endingSeen=false;state.sceneIndex=index;state.lineIndex=0;state.debate=null;
    state.usedBullets=[...(s.checkpoint?.usedBullets||[])];state.unlockedConcepts=[...state.usedBullets];state.history=[];
    els.teacher.close();show('story');prepareScene();save();
  }
  function jumpToDebate(id){
    const sceneIndex=STORY_DATA.findIndex(s=>s.lines.some(l=>l.type==='debate'&&l.debateId===id));if(sceneIndex<0)return;
    const lineIndex=STORY_DATA[sceneIndex].lines.findIndex(l=>l.type==='debate'&&l.debateId===id),d=DEBATE_DATA[id];
    beginTeacherPreview();state.started=true;state.endingSeen=false;state.sceneIndex=sceneIndex;state.lineIndex=lineIndex;
    state.usedBullets=[...d.preUsed];state.unlockedConcepts=[...state.usedBullets];state.history=[];state.debateTutorialSeen=true;state.debate={id,round:0,wrong:0,phase:'aim',selected:null,lastMiss:null};
    els.teacher.close();show('debate');renderDebate();save();
  }
  function buildTeacher(){
    renderTeacherDebug();if(els.teacherFastToggle)els.teacherFastToggle.textContent=`FAST QA · ${teacherFastMode?'ON':'OFF'}`;els.teacherNav.innerHTML='';
    STORY_DATA.forEach((s,i)=>{
      const b=document.createElement('button');b.innerHTML=`<small>${escapeHtml(s.chapter)} · SCENE ${String(s.number).padStart(2,'0')}</small>${escapeHtml(s.title)}`;
      b.addEventListener('click',()=>jumpToScene(i));els.teacherNav.append(b);
    });
  }
  async function clearAppCache(){
    if(!('caches' in window)){alert('이 미리보기 환경에서는 캐시 기능을 사용할 수 없습니다.');return}
    if(!confirm('이 웹앱의 캐시를 지우고 최신 파일을 다시 불러올까요?'))return;
    try{
      const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('sun-king-queen-')).map(k=>caches.delete(k)));
      const reg=await navigator.serviceWorker?.getRegistration?.();if(reg)await reg.update();
    }catch{}
    location.reload();
  }

  function restartConfirm(){if(confirm('저장된 진행을 지우고 처음부터 시작할까요?'))startStory(true)}
  function desiredMusicKey(){
    if(screens.title?.classList.contains('active'))return 'TITLE';
    if(screens.debate?.classList.contains('active'))return 'DEBATE';
    if(screens.story?.classList.contains('active'))return sceneBgmKey?.(currentScene(),state.lineIndex)||'ENGLAND';
    if(screens.end?.classList.contains('active'))return 'EPILOGUE';
    return 'TITLE';
  }
  function toggleMusic(){
    const next=!(state.audio?.enabled!==false);
    if(!state.audio)state.audio={enabled:true,volume:.58};
    state.audio.enabled=next;AudioManager.enabled(next);
    if(next)AudioManager.play(desiredMusicKey());
    save();
  }

  // ---------------- EVENTS ----------------
  els.panel.addEventListener('click',advanceStory);els.intertitle.addEventListener('click',advanceStory);
  els.start.addEventListener('click',()=>{requestFullscreenSafe();startStory(true)});
  els.continue.addEventListener('click',()=>{requestFullscreenSafe();state.debate?show('debate'):show('story');state.debate?(applyDebateCast(),renderDebate()):prepareScene()});
  els.restart.addEventListener('click',()=>{restartConfirm();requestFullscreenSafe()});
  $('#historyBtn').addEventListener('click',openHistory);$('#conceptBtn').addEventListener('click',openConcepts);$('#menuBtn').addEventListener('click',()=>els.menu.showModal());
  $('#menuHistory').addEventListener('click',()=>{els.menu.close();openHistory()});$('#menuConcept').addEventListener('click',()=>{els.menu.close();openConcepts()});$('#menuRestart').addEventListener('click',restartConfirm);
  els.music?.addEventListener('click',e=>{e.stopPropagation();toggleMusic()});
  els.menuMusic?.addEventListener('click',()=>toggleMusic());
  els.sound.addEventListener('click',()=>{state.haptics=!state.haptics;save();if(state.haptics)haptic(18)});
  els.specialLayer?.addEventListener('click',continueSpecial);els.specialContinue?.addEventListener('click',e=>{e.stopPropagation();continueSpecial()});
  els.flashbackLayer?.addEventListener('click',e=>{if(!els.flashbackLayer.classList.contains('interactive'))return;e.stopPropagation();continueFlashback()});
    els.rebuttalNext.addEventListener('click',continueRebuttal);
  $('#endHistoryBtn').addEventListener('click',openHistory);$('#endConceptBtn').addEventListener('click',openConcepts);$('#endRestartBtn').addEventListener('click',()=>{startStory(true);requestFullscreenSafe()});
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close).close()));
  $$('[data-debate-jump]').forEach(b=>b.addEventListener('click',()=>jumpToDebate(b.dataset.debateJump)));

  function teacherSecretTap(ev){
    ev?.stopPropagation?.();
    tapCount++;clearTimeout(tapTimer);tapTimer=setTimeout(()=>tapCount=0,1700);
    if(tapCount>=5){
      tapCount=0;clearTimeout(tapTimer);
      buildTeacher();
      if(!els.teacher.open)els.teacher.showModal();
      haptic([10,20,10]);
    }
  }
  // Same five-tap teacher shortcut on the title screen, story header and debate header.
  ['teacherTapTarget','sceneLabel','debateTopic'].forEach(id=>document.getElementById(id)?.addEventListener('click',teacherSecretTap));
  $('#teacherReset').addEventListener('click',()=>{
    if(confirm('학생용 저장 상태를 완전히 초기화할까요?')){
      teacherPreviewMode=false;teacherSnapshot=null;teacherFastMode=false;document.body.classList.remove('qa-fast');reset();els.teacher.close();updateTeacherPreviewBadge();show('title');
    }
  });
  els.teacherExitPreview?.addEventListener('click',exitTeacherPreview);
  els.teacherPreviewBadge?.addEventListener('click',exitTeacherPreview);
  els.teacherCacheRefresh?.addEventListener('click',clearAppCache);
  els.tutorialStartBtn?.addEventListener('click',()=>{state.debateTutorialSeen=true;hideDebateTutorial();save();haptic(9)});
  els.teacherFastToggle?.addEventListener('click',()=>{teacherFastMode=!teacherFastMode;document.body.classList.toggle('qa-fast',teacherFastMode);buildTeacher()});
  els.teacherTutorialPreview?.addEventListener('click',()=>{jumpToDebate('tax');state.debateTutorialSeen=false;renderDebate()});
  els.teacherCopyLocation?.addEventListener('click',async()=>{
    const s=currentScene();const txt=`${APP_VERSION} · ${s?`SCENE ${String(s.number).padStart(2,'0')} ${s.title}`:'TITLE'} · line ${state.lineIndex}${state.debate?` · debate ${state.debate.id}/R${state.debate.round+1}/${state.debate.phase}`:''}`;
    try{await navigator.clipboard.writeText(txt)}catch{const ta=document.createElement('textarea');ta.value=txt;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove()}
    if(els.teacherDebug)els.teacherDebug.insertAdjacentHTML('beforeend',`<span>복사됨: ${escapeHtml(txt)}</span>`);
  });
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save()});
  window.addEventListener('pagehide',()=>save());
  window.addEventListener('beforeunload',()=>save());

  screens.story.addEventListener('click',e=>{
    if(!screens.story.classList.contains('active')||busy)return;
    if(e.target.closest('button,dialog,#dialoguePanel,#intertitleOverlay,#specialLayer,.icon-btn,#propLayer,#openingNarrationOverlay,#pinnedSceneDoc'))return;
    advanceStory();
  });

  document.addEventListener('keydown',e=>{
    if((e.key===' '||e.key==='Enter')&&screens.story.classList.contains('active')&&!els.history.open&&!els.concept.open&&!els.menu.open&&!els.teacher.open){e.preventDefault();advanceStory()}
  });

  applyStaticArt();
  if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  updateTitle();updateTeacherPreviewBadge();
})();
