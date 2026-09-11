(()=>{
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const APP_VERSION='v0.21';
  const STORAGE_KEY='sun-king-queen-v0.21';
  const LEGACY_KEYS=['sun-king-queen-v0.20','sun-king-queen-v0.19','sun-king-queen-v0.18','sun-king-queen-v0.17','sun-king-queen-v0.16','sun-king-queen-v0.15','sun-king-queen-v0.14','sun-king-queen-v0.13','sun-king-queen-v0.12','sun-king-queen-v0.11','sun-king-queen-v0.10','sun-king-queen-v0.9','sun-king-queen-v0.8','sun-king-queen-v0.7','sun-king-queen-v0.6','sun-king-queen-v0.5','sun-king-queen-v0.4','sun-king-queen-v0.3','sun-king-queen-v0.2'];
  const TOTAL_BULLETS=LOGIC_BULLETS.length;
  const HISTORY_LIMIT=500;

  const screens={
    title:$('#titleScreen'),story:$('#storyScreen'),debate:$('#debateScreen'),end:$('#endScreen')
  };
  const els={
    continue:$('#continueBtn'),start:$('#startBtn'),restart:$('#restartBtn'),sound:$('#soundBtn'),
    chapter:$('#chapterLabel'),scene:$('#sceneLabel'),progress:$('#progressBar'),stage:$('#stage'),place:$('#placeCard'),
    actorLayer:$('#actorLayer'),panel:$('#dialoguePanel'),lineMode:$('#lineMode'),speaker:$('#speakerName'),text:$('#dialogueText'),hint:$('#nextHint'),
    fx:$('#storyFx'),caption:$('#captionFx'),sun:$('#sunOverlay'),flash:$('#shotFlash'),finalBulletBadge:$('#finalBulletBadge'),
    intertitle:$('#intertitleOverlay'),interKicker:$('#intertitleKicker'),interTitle:$('#intertitleTitle'),interSub:$('#intertitleSubtitle'),
    debateNumber:$('#debateNumber'),debateTopic:$('#debateTopic'),count:$('#bulletCount'),arena:$('#debateArena'),rail:$('#statementRail'),statement:$('#statementText'),debatePrompt:$('#debatePrompt'),aim:$('#aimPulse'),impact:$('#impactText'),deck:$('#bulletDeck'),
    rebuttal:$('#debateRebuttal'),rebuttalLabel:$('#rebuttalLabel'),rebuttalTitle:$('#rebuttalTitle'),rebuttalLogic:$('#rebuttalLogic'),rebuttalText:$('#rebuttalText'),rebuttalNext:$('#rebuttalNext'),
    history:$('#historyDialog'),historyList:$('#historyList'),concept:$('#conceptDialog'),conceptList:$('#conceptList'),menu:$('#menuDialog'),
    teacher:$('#teacherDialog'),teacherNav:$('#teacherNav'),teacherDebug:$('#teacherDebug'),teacherPreviewBadge:$('#teacherPreviewBadge'),
    teacherExitPreview:$('#teacherExitPreview'),teacherCacheRefresh:$('#teacherCacheRefresh'),
    propLayer:$('#propLayer'),propCard:$('#propCard'),propImage:$('#propImage'),propFallback:$('#propFallback'),
    specialLayer:$('#specialLayer'),specialImage:$('#specialImage'),specialLabel:$('#specialLabel'),specialContinue:$('#specialContinue'),sceneTransition:$('#sceneTransition'),sceneTransitionLabel:$('#sceneTransitionLabel'),flashbackLayer:$('#flashbackLayer'),flashbackImage:$('#flashbackImage'),flashbackFallback:$('#flashbackFallback'),flashbackLabel:$('#flashbackLabel'),finalLockFx:$('#finalLockFx'),sunImage:$('#sunEmblemImage'),
    loadedBullet:$('#loadedBullet'),shotTrail:$('#shotTrail'),debateAnneImage:$('#debateAnneImage'),debateMpImage:$('#debateMpImage'),debateTutorial:$('#debateTutorial'),tutorialStartBtn:$('#tutorialStartBtn'),
    teacherFastToggle:$('#teacherFastToggle'),teacherTutorialPreview:$('#teacherTutorialPreview'),teacherCopyLocation:$('#teacherCopyLocation')
  };

  const baseState=()=>({
    version:21,started:false,sceneIndex:0,lineIndex:0,usedBullets:[],unlockedConcepts:[],debate:null,history:[],haptics:true,audio:{enabled:true,volume:.58},debateTutorialSeen:false,endingSeen:false
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
  let specialTimer=null,specialReadyTimer=null,specialDone=null,specialReady=false;
  let transitionTimerA=null,transitionTimerB=null,transitioning=false;
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
    merged.version=21;
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
    clearTyping();clearDirectionTimer();clearSpecialState();clearSceneTransition();
    if(!teacherPreviewMode)clearPersistent();
    const keepHaptics=state?.haptics!==false;const keepAudio=clone(state?.audio||{enabled:true,volume:.58});
    AudioManager?.stopAll?.();state=baseState();state.haptics=keepHaptics;state.audio=keepAudio;busy=false;beforeBeatKey=null;afterBeatKey=null;updateTitle();
  }
  function haptic(pattern=8){if(state.haptics&&navigator.vibrate)navigator.vibrate(pattern)}
  function qaDelay(ms){return teacherPreviewMode&&teacherFastMode?Math.max(12,Math.round(ms*.08)):ms}

  const AudioManager=(()=>{
    const channels=[new Audio(),new Audio()];
    channels.forEach(a=>{a.loop=true;a.preload='auto'});
    let active=0,currentKey=null,unlocked=false,fadeToken=0;
    function unlock(){unlocked=true}
    function setVolume(v){state.audio.volume=Math.max(0,Math.min(1,Number(v)||0));channels.forEach(a=>a.volume=Math.min(a.volume,state.audio.volume))}
    function stopAll(){fadeToken++;channels.forEach(a=>{try{a.pause();a.currentTime=0}catch{}});currentKey=null}
    function play(key){
      const cfg=AUDIO_MAP?.bgm?.[key];const path=cfg?.path;
      if(!state.audio.enabled||!unlocked||!path){currentKey=key;return}
      if(currentKey===key&&!channels[active].paused)return;
      currentKey=key;const next=1-active,from=channels[active],to=channels[next];const token=++fadeToken;
      try{to.src=path;to.loop=true;to.currentTime=0;to.volume=0;to.play().catch(()=>{})}catch{return}
      const target=Math.min(1,(cfg.volume??1)*state.audio.volume);const start=performance.now(),dur=teacherFastMode?80:900;
      const step=now=>{if(token!==fadeToken)return;const t=Math.min(1,(now-start)/dur);to.volume=target*t;from.volume=Math.max(0,(1-t)*Math.min(from.volume||target,target));if(t<1)requestAnimationFrame(step);else{try{from.pause()}catch{}active=next}};
      requestAnimationFrame(step);
    }
    function sfx(key){const cfg=AUDIO_MAP?.sfx?.[key];if(!state.audio.enabled||!unlocked||!cfg?.path)return;try{const a=new Audio(cfg.path);a.volume=Math.min(1,(cfg.volume??1)*state.audio.volume);a.play().catch(()=>{})}catch{}}
    return {unlock,play,sfx,stopAll,setVolume};
  })();
  document.addEventListener('pointerdown',()=>AudioManager.unlock(),{once:true,capture:true});
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

  function updateTitle(){
    const has=state.started&&!state.endingSeen;
    els.continue.classList.toggle('hidden',!has);
    els.restart.classList.toggle('hidden',!has);
    els.start.classList.toggle('hidden',has);
    els.start.textContent=state.endingSeen?'다시 시작':'이야기 시작';
    els.sound.textContent=`진동 ${state.haptics?'ON':'OFF'}`;
  }
  function applyStaticArt(){
    const titleMeta=resolveSpecialMeta?.('title_poster');if(titleMeta?.path){document.documentElement.style.setProperty('--title-poster-image',`url("${titleMeta.path}")`);screens.title.classList.add('has-title-art')}
    const debateBg=resolveAsset?.('backgrounds','bg_parliament');if(debateBg)document.documentElement.style.setProperty('--debate-bg-image',`url("${debateBg}")`);
    const sun=resolveDocumentMeta?.('sun_emblem')?.path;if(sun){if(els.sunImage)els.sunImage.src=sun;document.documentElement.style.setProperty('--sun-emblem-image',`url("${sun}")`)}
  }
  function prepareEndArt(){const meta=resolveSpecialMeta?.('mirror_return')||resolveSpecialMeta?.('title_poster');if(meta?.path){preloadPath(meta.path);document.documentElement.style.setProperty('--end-art-image',`url("${meta.path}")`)}}


  function clearTyping(){if(typing?.timer)clearTimeout(typing.timer);typing=null}
  function clearDirectionTimer(){if(directionTimer)clearTimeout(directionTimer);directionTimer=null}
  function formatText(text,limit=Infinity){return escapeHtml(String(text).slice(0,limit)).replace(/\n/g,'<br>')}
  const KEY_LINE_SNIPPETS=['애송이 앤','의회를 소집하라!','짐은 태양이다!','짐이 곧 국가다!','그건 프랑스입니다.','국가는 왕 한 사람보다 큽니다.','태양도…','하늘 없이 혼자 뜨는 것은 아니었군.'];
  function isKeyLine(text){const t=String(text||'');return KEY_LINE_SNIPPETS.some(v=>t.includes(v))}
  function typeDelayFor(text){const t=String(text||'');if(isKeyLine(t))return 27;if(t.length>=95)return 10;if(t.length>=70)return 12;if(t.length>=45)return 14;return 17}
  function typeText(text){
    clearTyping();
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||(teacherPreviewMode&&teacherFastMode);
    typing={text:String(text),index:reduce?String(text).length:0,timer:null};
    els.text.innerHTML=formatText(typing.text,typing.index);
    els.hint.textContent=typing.index<typing.text.length?'터치하면 문장 완성':'터치하여 계속 ›';
    if(reduce)return;
    const delay=typeDelayFor(typing.text);
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
    $$('.actor').forEach(a=>{
      const first=Number(a.dataset.firstLine||0);
      if(state.lineIndex>=first&&a.classList.contains('waiting-entry')){
        a.classList.remove('waiting-entry');a.classList.add('actor-arrive');
        setTimeout(()=>a.classList.remove('actor-arrive'),qaDelay(520));
      }
    });
  }
  function setActorImage(div,path){
    const img=div.querySelector('.actor-img');if(!img)return;
    if(div.dataset.assetPath===String(path||''))return;
    const requestId=(Number(div.dataset.assetRequest||0)+1);div.dataset.assetRequest=String(requestId);
    if(!path){
      div.dataset.assetPath='';div.classList.remove('has-image','asset-error');img.classList.add('hidden');img.classList.remove('swapping');img.removeAttribute('src');return;
    }
    const previousPath=div.dataset.assetPath||'',previousVisible=!!img.getAttribute('src')&&!img.classList.contains('hidden');
    const pre=new Image();if(previousVisible)img.classList.add('swapping');let retried=false;
    const commit=()=>{
      if(Number(div.dataset.assetRequest)!==requestId)return;
      div.dataset.assetPath=path;div.classList.remove('asset-error');div.classList.add('has-image');img.src=pre.src;img.classList.remove('hidden');
      requestAnimationFrame(()=>requestAnimationFrame(()=>img.classList.remove('swapping')));
    };
    const fail=()=>{
      if(Number(div.dataset.assetRequest)!==requestId)return;
      if(!retried){retried=true;setTimeout(()=>{pre.src=retryUrl(path)},qaDelay(420));return}
      img.classList.remove('swapping');
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
      const div=document.createElement('div');const first=firstActorLine(scene,entry.id);
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
    portraitFrames(stageActorsFor(currentScene()||{}),box.width,box.height).filter(Boolean).forEach(f=>{
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
    if(path){preloadPath(path);els.stage.style.setProperty('--scene-bg-image',`url("${path}")`)}else els.stage.style.removeProperty('--scene-bg-image');
    els.stage.style.setProperty('--scene-bg-position',frame.position||'center');els.stage.style.setProperty('--scene-bg-size',frame.size||'cover');
  }
  function hideProp(){els.propLayer?.classList.add('hidden');els.propImage?.classList.add('hidden');if(els.propImage)els.propImage.removeAttribute('src')}
  function showProp(key,{hold=1100}={}){
    const meta=resolveDocumentMeta?.(key);if(!meta||!els.propLayer)return;
    const path=meta.path||null;els.propFallback.textContent=meta.label||key;els.propFallback.classList.toggle('hidden',!!path);
    els.propLayer.classList.remove('hidden');els.propCard.dataset.prop=key;
    if(path){setResilientImage(els.propImage,path,{onLoad:()=>{els.propImage.classList.remove('hidden');els.propFallback.classList.add('hidden')},onError:()=>{els.propImage.classList.add('hidden');els.propFallback.classList.remove('hidden')}})}
    setTimeout(()=>hideProp(),qaDelay(hold));
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
  function hideFlashback(){els.flashbackLayer?.classList.add('hidden');els.flashbackImage?.classList.add('hidden');if(els.flashbackImage)els.flashbackImage.removeAttribute('src')}
  function showOverlayImage(path,label='',fallback='',datasetActor='overlay',duration=900){
    if(!els.flashbackLayer)return;
    els.flashbackLabel.textContent=label||'';
    els.flashbackFallback.textContent=fallback||label||'';
    els.flashbackFallback.classList.toggle('hidden',!!path);
    els.flashbackLayer.classList.remove('hidden');els.flashbackLayer.dataset.actor=datasetActor;
    if(path){setResilientImage(els.flashbackImage,path,{onLoad:()=>{els.flashbackImage.classList.remove('hidden');els.flashbackFallback.classList.add('hidden')},onError:()=>{els.flashbackImage.classList.add('hidden');els.flashbackFallback.classList.remove('hidden')}})}
    setTimeout(hideFlashback,qaDelay(duration));
  }
  function showFlashback(actorId,label='',duration=900){
    const def=ACTOR_DEFS?.[actorId];
    showOverlayImage(resolveActorAsset?.(actorId,'default'),label||def?.code||'',def?.name||label||actorId,actorId,duration);
  }
  function playFinalLockIntro(scene){
    if(!els.finalLockFx||scene.id!=='scene-30'||finalLockScenePlayed===scene.id)return;
    finalLockScenePlayed=scene.id;els.finalLockFx.innerHTML=LOGIC_BULLETS.map(b=>`<span>${escapeHtml(b.name)}<i>LOCK</i></span>`).join('');
    els.finalLockFx.classList.remove('hidden');requestAnimationFrame(()=>els.finalLockFx.classList.add('show'));
    setTimeout(()=>{els.finalLockFx.classList.remove('show');setTimeout(()=>els.finalLockFx.classList.add('hidden'),qaDelay(300))},qaDelay(1450));
  }
  function applySceneVisual(scene){
    const visual=SCENE_VISUALS?.[scene.id]||{};
    els.stage.dataset.memory=visual.memory||'';
    els.stage.dataset.memoryTheme=visual.memoryTheme||'';
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
    els.chapter.textContent=s.chapter;
    els.scene.textContent=`SCENE ${String(s.number).padStart(2,'0')} · ${s.title}`;
    els.stage.dataset.tone=s.tone;
    const uiTone=s.chapter==='FINAL'?'final':s.chapter==='REALIZATION'?'realization':s.chapter==='EPILOGUE'?'epilogue':(s.tone==='dream'||String(s.chapter||'').includes('MEMORY'))?'memory':s.country==='FRANCE'?'france':'england';
    screens.story.dataset.uiTone=uiTone;
    els.place.innerHTML=`<small>${escapeHtml(s.country)}</small><strong>${escapeHtml(s.place)}</strong>`;
    renderStageActors(s);applySceneAsset(s);applySceneVisual(s);preloadSceneAssets(state.sceneIndex);AudioManager.play(sceneBgmKey?.(s)||'ENGLAND');
    els.stage.classList.remove('bump','freeze-frame','sun-fracture');
    els.stage.dataset.camera='default';
    if(s.chapter!=='FINAL')els.stage.classList.remove('sun-active');
    els.finalBulletBadge.classList.toggle('hidden',s.chapter!=='FINAL');
    if(s.chapter==='FINAL')playFinalLockIntro(s);else finalLockScenePlayed=null;
    beforeBeatKey=null;afterBeatKey=null;
    updateProgress();renderCurrent();
  }

  function resetTransientFx(){
    els.fx.textContent='';els.fx.classList.remove('flash');
    els.caption.textContent='';els.caption.classList.remove('show');
    els.flash.classList.remove('show');
  }
  function storyFlash(text){els.fx.textContent=text;els.fx.classList.remove('flash');void els.fx.offsetWidth;els.fx.classList.add('flash')}
  function screenFlash(){els.flash.classList.remove('show');void els.flash.offsetWidth;els.flash.classList.add('show')}
  function captionFlash(text){els.caption.textContent=text;els.caption.classList.remove('show');void els.caption.offsetWidth;els.caption.classList.add('show')}
  function applyMappedVisual(effect){
    const cfg=VISUAL_MAP?.[effect];if(!cfg)return false;
    if(cfg.stageClass){els.stage.classList.add(cfg.stageClass);setTimeout(()=>els.stage.classList.remove(cfg.stageClass),qaDelay(cfg.duration||700))}
    if(cfg.fxText)storyFlash(cfg.fxText);
    if(cfg.flashbackActor)showFlashback(cfg.flashbackActor,cfg.flashbackLabel,cfg.duration||900);
    if(cfg.haptic)haptic(cfg.haptic);
    return true;
  }
  function triggerEffect(effect,meta={}){
    if(!effect||effect==='none')return;
    applyMappedVisual(effect);
    switch(effect){
      case 'caption':captionFlash(meta.caption||'');break;
      case 'fade_black':storyFlash('');els.stage.style.opacity='.18';setTimeout(()=>els.stage.style.opacity='1',360);break;
      case 'flash_white':screenFlash();break;
      case 'dark_pulse':els.stage.classList.add('freeze-frame');setTimeout(()=>els.stage.classList.remove('freeze-frame'),650);haptic([18,55,18]);break;
      case 'seal':showProp(propForCurrentLine('seal')||'dream_red_seal',{hold:1350});AudioManager.sfx('SEAL');break;
      case 'document':showProp(propForCurrentLine('document')||'bill_of_rights',{hold:1450});AudioManager.sfx('PAGE');break;
      case 'show_prop':if(meta.propKey)showProp(meta.propKey,{hold:meta.propHold||1500});break;
      case 'flashback_history':screenFlash();showFlashback('louis14','과거의 루이',980);break;
      case 'charles_flash':screenFlash();if(!showSpecialImage('charles_door_flash',980))showFlashback('charles1','CHARLES I',900);break;
      case 'charles_reveal':break;
      case 'throat_clear':els.stage.classList.add('bump');AudioManager.sfx('THROAT');setTimeout(()=>els.stage.classList.remove('bump'),qaDelay(480));break;
      case 'summon_parliament':els.stage.classList.add('bump');AudioManager.sfx('SUMMON');setTimeout(()=>els.stage.classList.remove('bump'),qaDelay(520));break;
      case 'reversal':els.stage.classList.add('freeze-frame');setTimeout(()=>els.stage.classList.remove('freeze-frame'),700);break;
      case 'sun_fill':els.stage.classList.add('sun-active');break;
      case 'sunburst':els.stage.classList.add('sun-active','bump');setTimeout(()=>els.stage.classList.remove('bump'),520);break;
      case 'freeze':els.stage.classList.add('freeze-frame');setTimeout(()=>els.stage.classList.remove('freeze-frame'),700);break;
      case 'sun_fade':els.stage.classList.remove('sun-active');break;
      case 'reverse_rebuttal':els.stage.classList.add('sun-active','sun-fracture');screenFlash();AudioManager.sfx('REVERSE');setTimeout(()=>els.stage.classList.remove('sun-active','sun-fracture'),qaDelay(1200));break;
      case 'debate_start':storyFlash('DEBATE START');break;
      case 'memory':break;
      default:break;
    }
  }

  function renderVisibleLine(line,skipBeat=false){
    const cue=currentCue(),key=lineKey();
    if(!skipBeat&&cue?.beatBefore&&beforeBeatKey!==key){
      beforeBeatKey=key;busy=true;clearTyping();els.panel.classList.add('hidden');
      applyDirectorContext(cue,line);clearDirectionTimer();
      directionTimer=setTimeout(()=>{directionTimer=null;busy=false;renderVisibleLine(line,true)},qaDelay(cue.beatBefore));
      return;
    }
    els.intertitle.classList.add('hidden');
    const actionNarration=line.type==='narration'&&ACTION_NARRATION_KEYS?.has(key);
    els.panel.classList.remove('hidden','narration','monologue','narration-action','narration-context');
    els.panel.classList.toggle('narration',line.type==='narration');
    els.panel.classList.toggle('monologue',line.type==='monologue');
    els.panel.classList.toggle('narration-action',actionNarration);
    els.panel.classList.toggle('narration-context',line.type==='narration'&&!actionNarration);
    els.lineMode.textContent=line.type==='narration'?(actionNarration?'SCENE':'NARRATION'):line.type==='monologue'?'INNER VOICE':'';
    els.speaker.textContent=line.type==='narration'?(actionNarration?'장면':'나레이션'):(line.speaker||'');
    const group=line.type==='narration'?'narration':line.type==='monologue'?'monologue':(ACTOR_DEFS?.[line.actorId]?.group||'neutral');
    syncActorPresence(currentScene());
    els.panel.dataset.speakerGroup=group;els.panel.classList.toggle('long-line',String(line.text||'').length>=72);els.panel.classList.toggle('key-line',isKeyLine(line.text));
    applyDirectorContext(cue,line);
    const effect=cue?.effect||line.effect;if(effect)triggerEffect(effect,Object.assign({},line,cue||{}));
    record(line);typeText(line.text||'');updateProgress();save();
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
    clearTyping();activateActor(null);els.panel.classList.add('hidden');
    els.intertitle.classList.remove('hidden','kind-memory','kind-debate','kind-document','kind-final','kind-story');
    const kind=intertitleKind(line);els.intertitle.classList.add(`kind-${kind}`);
    els.interKicker.textContent=kind==='memory'?'ENGLISH MEMORY':kind==='debate'?'DEBATE START':kind==='document'?'THE ENGLISH CROWN':kind==='final'?'FINAL':'STORY';
    els.interTitle.textContent=line.title||'';els.interSub.textContent=line.subtitle||'';
    updateProgress();save();
  }

  function executeDirection(line){
    const cue=currentCue(),scene=currentScene(),special=SPECIAL_CUE_MAP?.[`${scene?.id}:${state.lineIndex}`]||null;clearTyping();activateActor(cue?.focus||null);els.panel.classList.add('hidden');els.intertitle.classList.add('hidden');applyDirectorContext(cue,line);
    if(!special?.suppressEffect)triggerEffect(cue?.effect||line.effect,Object.assign({},line,cue||{}));updateProgress();save();busy=true;clearDirectionTimer();
    const finishDirection=()=>{busy=false;state.lineIndex++;beforeBeatKey=null;afterBeatKey=null;save();renderCurrent()};
    if(special){const interactiveEnabled=!!special.interactive&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!(teacherPreviewMode&&teacherFastMode);const shown=showSpecialImage(special.key,special.hold||1200,{interactive:interactiveEnabled,minHold:special.minHold||900,onContinue:interactiveEnabled?finishDirection:null});if(shown&&interactiveEnabled)return}
    const delay=qaDelay(Math.max(50,cue?.hold||0,line.delay||90,special?.hold||0));directionTimer=setTimeout(()=>{directionTimer=null;finishDirection()},delay);
  }

  function renderCurrent(){
    resetTransientFx();syncActorPresence(currentScene());
    const s=currentScene();if(!s)return finishStory();
    const line=currentLine();if(!line)return nextScene();
    if(line.type==='direction')return executeDirection(line);
    if(line.type==='debate')return startDebate(line.debateId);
    if(line.type==='intertitle')return renderIntertitle(line);
    return renderVisibleLine(line);
  }

  function incrementStoryLine(){
    state.lineIndex++;beforeBeatKey=null;afterBeatKey=null;save();renderCurrent();
  }
  function advanceStory(){
    if(busy||transitioning||els.history.open||els.concept.open||els.menu.open||els.teacher.open)return;
    const now=performance.now(),guard=teacherPreviewMode&&teacherFastMode?45:170;
    if(now-lastStoryInputAt<guard)return;lastStoryInputAt=now;
    const line=currentLine();if(!line)return;
    if(line.type==='intertitle'){haptic(8);els.intertitle.classList.add('hidden');incrementStoryLine();return}
    if(finishTyping()){haptic(5);return}
    const cue=currentCue(),key=lineKey();
    if(cue?.beatAfter&&afterBeatKey!==key){
      afterBeatKey=key;busy=true;els.hint.textContent='…';haptic(7);clearDirectionTimer();
      directionTimer=setTimeout(()=>{directionTimer=null;busy=false;incrementStoryLine()},qaDelay(cue.beatAfter));
      return;
    }
    haptic(7);incrementStoryLine();
  }

  function clearSceneTransition(){if(transitionTimerA)clearTimeout(transitionTimerA);if(transitionTimerB)clearTimeout(transitionTimerB);transitionTimerA=null;transitionTimerB=null;transitioning=false;if(els.sceneTransition){els.sceneTransition.className='scene-transition hidden';els.sceneTransition.removeAttribute('data-kind')}}
  function sceneTransitionKind(scene){if(!scene)return'england';if(scene.chapter==='FINAL')return'final';if(scene.chapter==='REALIZATION')return'realization';if(scene.chapter==='EPILOGUE')return'epilogue';if(scene.tone==='dream'||String(scene.chapter).includes('MEMORY'))return'memory';if(scene.country==='FRANCE')return'france';return'england'}
  function needsSceneTransition(from,to){if(!from||!to)return true;if(from.chapter!==to.chapter||from.country!==to.country||from.tone!==to.tone)return true;return (SCENE_ASSET_MAP?.[from.id]||'')!==(SCENE_ASSET_MAP?.[to.id]||'')}
  function runSceneTransition(toScene,onMidpoint,onDone){
    if(!els.sceneTransition){onMidpoint();onDone();return}
    clearSceneTransition();transitioning=true;const kind=sceneTransitionKind(toScene),label=SCENE_TRANSITION_LABEL?.[kind]||toScene.chapter||'';els.sceneTransition.dataset.kind=kind;els.sceneTransitionLabel.textContent=label;els.sceneTransition.classList.remove('hidden');requestAnimationFrame(()=>els.sceneTransition.classList.add('active'));
    transitionTimerA=setTimeout(onMidpoint,qaDelay(300));transitionTimerB=setTimeout(()=>{els.sceneTransition.classList.remove('active');setTimeout(()=>{clearSceneTransition();onDone()},qaDelay(220))},qaDelay(570));
  }
  function nextScene(){
    clearTyping();clearDirectionTimer();clearSpecialState();const from=currentScene(),nextIndex=state.sceneIndex+1,next=STORY_DATA[nextIndex];busy=true;
    if(!next){state.sceneIndex=nextIndex;state.lineIndex=0;save();busy=false;return finishStory()}
    const move=()=>{state.sceneIndex=nextIndex;state.lineIndex=0;beforeBeatKey=null;afterBeatKey=null;save();busy=false;prepareScene()};
    if(needsSceneTransition(from,next))runSceneTransition(next,move,()=>{});
    else{els.stage.style.opacity='.35';setTimeout(()=>{move();els.stage.style.opacity='1'},qaDelay(190))}
  }

  function startStory(fromStart=false){
    if(fromStart)reset();
    state.started=true;state.endingSeen=false;state.debate=null;show('story');prepareScene();save();
  }
  function finishStory(){clearTyping();clearDirectionTimer();clearSceneTransition();hideSpecial();hideFlashback();hideProp();prepareEndArt();busy=false;state.endingSeen=true;state.debate=null;save();show('end')}

  // ---------------- DEBATE ----------------
  function applyDebateCast(){const a=resolveActorAsset?.('anne_louis','debate')||resolveActorAsset?.('anne_louis','default')||'';const m=resolveActorAsset?.('mp_leader','firm')||resolveActorAsset?.('mp_leader','default')||'';if(els.debateAnneImage&&a)setResilientImage(els.debateAnneImage,a);if(els.debateMpImage&&m)setResilientImage(els.debateMpImage,m)}
  function startDebate(id){
    clearTyping();clearDirectionTimer();busy=false;
    const d=DEBATE_DATA[id];if(!d)return;
    if(!state.debate||state.debate.id!==id)state.debate={id,round:0,wrong:0,phase:'aim',selected:null,lastMiss:null};
    else state.debate=Object.assign({round:0,wrong:0,phase:'aim',selected:null,lastMiss:null},state.debate);
    AudioManager.play('DEBATE');
    screens.debate.dataset.debate=id;screens.debate.classList.remove('debate-hit','debate-miss');
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
    if(wrong<=1)return null;
    if(wrong===2)return '탄환이 맞아도 논점이 틀리면 실패합니다. 탄환과 문구를 함께 확인하세요.';
    if(wrong===3)return r.hint;
    if(wrong<=5)return r.categoryHint||r.hint;
    const b=bulletById(r.answer);return b?`개념 도움 · ${b.name}: ${b.definition}`:r.hint;
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
    screens.debate.classList.toggle('armed',!!state.debate.selected);
    els.statement.innerHTML=statementHtml(r.statement);
    const stagedHint=hintMessage(r,state.debate.wrong);
    const prompt=stagedHint||(state.debate.selected?'논점 후보를 조준해 발사하세요':'논리탄환을 고르세요');
    els.debatePrompt.textContent=prompt;renderBulletDeck(state.debate.wrong>=6?{mode:'rescue',round:r}:{mode:'normal',round:r});updateLoadedBullet();
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
      btn.disabled=used;btn.dataset.id=b.id;
      btn.innerHTML=`<strong>${escapeHtml(b.name)}</strong><small>${escapeHtml(rescue?b.definition:'')}</small>`;
      btn.addEventListener('click',()=>selectBullet(b.id));els.deck.append(btn);
    });
  }

  function selectBullet(id){
    if(busy||!state.debate||state.usedBullets.includes(id)||state.debate.phase!=='aim')return;
    state.debate.selected=id;screens.debate.classList.add('armed');
    els.debatePrompt.textContent='논점 후보를 조준해 발사하세요';renderBulletDeck({mode:state.debate.wrong>=6?'rescue':'normal',round:DEBATE_DATA[state.debate.id].rounds[state.debate.round]});updateLoadedBullet();haptic(11);save();
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
    if(busy||!state.debate||state.debate.phase!=='aim')return;
    if(!state.debate.selected){els.debatePrompt.textContent='먼저 논리탄환을 선택하세요';haptic(6);return}
    const target=ev.currentTarget;const targetId=target?.dataset?.target||'';
    els.rail.classList.add('paused');fireAimAt(target);
    const d=DEBATE_DATA[state.debate.id],r=d.rounds[state.debate.round];
    const correctBullet=state.debate.selected===r.answer,correctTarget=targetId===r.answerTarget;
    if(!(correctBullet&&correctTarget)){
      state.debate.wrong++;
      const missText=correctBullet&&!correctTarget?'논점이 어긋났다.':(!correctBullet&&correctTarget?'그 논리로는 부족하다.':'MISS');
      state.debate.lastMiss=missText;state.debate.selected=null;target.classList.add('miss-bounce');screens.debate.classList.remove('debate-hit');screens.debate.classList.add('debate-miss');impact(missText,true);AudioManager.sfx('MISS');haptic([22,30,22]);save();updateLoadedBullet();
      setTimeout(()=>{screens.debate.classList.remove('debate-miss');renderDebate()},qaDelay(560));return;
    }
    uniquePush(state.usedBullets,r.answer);uniquePush(state.unlockedConcepts,r.answer);
    state.debate.phase='rebuttal';state.debate.selected=null;state.debate.lastMiss=null;save();
    busy=true;screens.debate.classList.remove('debate-miss');screens.debate.classList.add('debate-hit');els.arena.classList.add('hit-stop');setTimeout(()=>els.arena.classList.remove('hit-stop'),qaDelay(160));impact('논파!');AudioManager.sfx('HIT');haptic([28,25,65]);updateLoadedBullet();
    setTimeout(()=>{busy=false;screens.debate.classList.remove('debate-hit');renderDebate()},qaDelay(820));
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
    else{state.debate.round=nextRound;state.debate.phase='aim'}
    save();renderDebate();
  }
  function endDebate(){
    state.debate=null;state.lineIndex++;beforeBeatKey=null;afterBeatKey=null;hideDebateTutorial();save();show('story');prepareScene();
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
    els.teacherDebug.innerHTML=`<b>${APP_VERSION}</b><span>저장 장면: ${escapeHtml(scene?`SCENE ${String(scene.number).padStart(2,'0')} · ${scene.title}`:'없음')}</span><span>line: ${p.lineIndex} · debate: ${escapeHtml(debate)}</span><span>USED: ${p.usedBullets.length}/${TOTAL_BULLETS} · 기록: ${p.history.length}/${HISTORY_LIMIT}</span><span>FAST QA: ${teacherFastMode?'ON':'OFF'} · audio skeleton: ${state.audio?.enabled?'ON':'OFF'}</span><span>교사용 점프는 학생 저장을 변경하지 않습니다.</span>`;
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

  // ---------------- EVENTS ----------------
  els.panel.addEventListener('click',advanceStory);els.intertitle.addEventListener('click',advanceStory);
  els.start.addEventListener('click',()=>startStory(true));
  els.continue.addEventListener('click',()=>{state.debate?show('debate'):show('story');state.debate?renderDebate():prepareScene()});
  els.restart.addEventListener('click',restartConfirm);
  $('#historyBtn').addEventListener('click',openHistory);$('#conceptBtn').addEventListener('click',openConcepts);$('#menuBtn').addEventListener('click',()=>els.menu.showModal());
  $('#menuHistory').addEventListener('click',()=>{els.menu.close();openHistory()});$('#menuConcept').addEventListener('click',()=>{els.menu.close();openConcepts()});$('#menuRestart').addEventListener('click',restartConfirm);
  els.sound.addEventListener('click',()=>{state.haptics=!state.haptics;save();if(state.haptics)haptic(18)});
  els.specialLayer?.addEventListener('click',continueSpecial);els.specialContinue?.addEventListener('click',e=>{e.stopPropagation();continueSpecial()});
    els.rebuttalNext.addEventListener('click',continueRebuttal);
  $('#endHistoryBtn').addEventListener('click',openHistory);$('#endConceptBtn').addEventListener('click',openConcepts);$('#endRestartBtn').addEventListener('click',()=>startStory(true));
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close).close()));
  $$('[data-debate-jump]').forEach(b=>b.addEventListener('click',()=>jumpToDebate(b.dataset.debateJump)));

  $('#teacherTapTarget').addEventListener('click',()=>{
    tapCount++;clearTimeout(tapTimer);tapTimer=setTimeout(()=>tapCount=0,1700);
    if(tapCount>=5){tapCount=0;buildTeacher();els.teacher.showModal();haptic([10,20,10])}
  });
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

  document.addEventListener('keydown',e=>{
    if((e.key===' '||e.key==='Enter')&&screens.story.classList.contains('active')&&!els.history.open&&!els.concept.open&&!els.menu.open&&!els.teacher.open){e.preventDefault();advanceStory()}
  });

  applyStaticArt();
  if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  updateTitle();updateTeacherPreviewBadge();
})();
