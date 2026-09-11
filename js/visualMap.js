window.VISUAL_MAP = {
  throat_clear:{stageClass:'cue-throat',duration:480,haptic:7},summon_parliament:{stageClass:'cue-summon',duration:560,haptic:[18,20,35],fxText:'의회를 소집하라!'},
  reversal:{stageClass:'cue-reversal',duration:760,haptic:[35,60,35]},charles_reveal:{stageClass:'cue-charles',duration:1050,haptic:[25,40,25]},
  sunburst:{stageClass:'cue-sunburst',duration:650,haptic:[25,20,55]},reverse_rebuttal:{stageClass:'cue-reverse-rebuttal',duration:1200,haptic:[45,30,95],fxText:'논파!'},
  flashback_history:{stageClass:'cue-history-echo',duration:900,fxText:'“역사를 잊은 건 아니겠지?”',flashbackActor:'louis14',flashbackLabel:'과거의 루이'},final_freeze:{stageClass:'cue-final-freeze',duration:900}
};
window.SCENE_VISUALS = {'scene-14':{memory:'1',memoryTheme:'gold'},'scene-20':{memory:'2',memoryTheme:'fracture'},'scene-27':{memory:'3',memoryTheme:'seal'},'scene-28':{memory:'3',memoryTheme:'seal'},'scene-30':{final:true},'scene-31':{final:true},'scene-32':{final:true},'scene-33':{final:true},'scene-34':{final:true},'scene-40':{mirror:true}};
window.SPECIAL_CUE_MAP = {'scene-02:6':{key:'young_louis_fronde',hold:1450},'scene-20:4':{key:'charles_door_flash',hold:980},'scene-28:2':{key:'dream_crown_offer',hold:2400,minHold:900,interactive:true,suppressEffect:true},'scene-36:10':{key:'realization_montage',hold:2800,minHold:1050,interactive:true},'scene-40:2':{key:'mirror_return',hold:2400,minHold:900,interactive:true}};
window.BACKGROUND_FRAME_MAP = {'scene-01':{position:'50% 46%',size:'106% auto'},'scene-02':{position:'52% 46%',size:'112% auto'},'scene-04':{position:'50% 45%',size:'108% auto'},'scene-06':{position:'48% 52%',size:'108% auto'},'scene-08':{position:'49% 58%',size:'110% auto'},'scene-10':{position:'50% 54%',size:'106% auto'},'scene-14':{position:'50% 48%',size:'108% auto'},'scene-17':{position:'50% 52%',size:'108% auto'},'scene-20':{position:'50% 48%',size:'107% auto'},'scene-24':{position:'50% 52%',size:'108% auto'},'scene-25':{position:'52% 50%',size:'cover'},'scene-28':{position:'50% 47%',size:'108% auto'},'scene-30':{position:'50% 49%',size:'111% auto'},'scene-31':{position:'50% 49%',size:'113% auto'},'scene-32':{position:'50% 48%',size:'114% auto'},'scene-33':{position:'50% 47%',size:'116% auto'},'scene-34':{position:'50% 47%',size:'116% auto'},'scene-35':{position:'52% 50%',size:'cover'},'scene-36':{position:'15% 52%',size:'118% auto'},'scene-40':{position:'53% 45%',size:'110% auto'}};

// scene-transition / final-pressure grammar
window.FINAL_PHASE_MAP = {
  'scene-30':'lock','scene-31':'echo','scene-32':'warning','scene-33':'sun','scene-34':'break'
};
window.SCENE_TRANSITION_LABEL = {
  france:'FRANCE',england:'ENGLAND',memory:'ENGLISH MEMORY',final:'FINAL',realization:'REALIZATION',epilogue:'EPILOGUE'
};

// Narrations promoted from hidden stage directions are rendered as lighter scene-action captions.
window.ACTION_NARRATION_KEYS = new Set(["scene-01:0", "scene-01:11", "scene-01:16", "scene-02:0", "scene-02:4", "scene-02:8", "scene-03:0", "scene-03:6", "scene-04:3", "scene-04:9", "scene-05:0", "scene-05:2", "scene-06:0", "scene-06:2", "scene-06:5", "scene-06:8", "scene-06:10", "scene-06:12", "scene-06:14", "scene-06:17", "scene-06:21", "scene-06:26", "scene-07:0", "scene-07:4", "scene-08:0", "scene-08:4", "scene-08:9", "scene-08:12", "scene-09:1", "scene-09:5", "scene-09:14", "scene-10:7", "scene-11:0", "scene-12:0", "scene-12:7", "scene-12:12", "scene-13:0", "scene-13:2", "scene-13:3", "scene-13:5", "scene-14:0", "scene-14:8", "scene-14:11", "scene-15:0", "scene-15:3", "scene-16:0", "scene-16:4", "scene-16:8", "scene-17:0", "scene-18:0", "scene-18:6", "scene-19:0", "scene-19:1", "scene-19:3", "scene-20:1", "scene-20:7", "scene-21:0", "scene-21:2", "scene-23:0", "scene-23:4", "scene-23:7", "scene-23:9", "scene-24:0", "scene-25:0", "scene-25:7", "scene-25:9", "scene-26:0", "scene-26:4", "scene-26:6", "scene-27:0", "scene-27:2", "scene-28:0", "scene-28:6", "scene-29:0", "scene-29:2", "scene-29:4", "scene-29:8", "scene-29:11", "scene-29:13", "scene-30:0", "scene-30:4", "scene-31:2", "scene-31:10", "scene-32:2", "scene-32:7", "scene-33:0", "scene-33:7", "scene-34:4", "scene-34:9", "scene-35:0", "scene-35:1", "scene-36:0", "scene-36:1", "scene-36:3", "scene-36:5", "scene-36:8", "scene-36:15", "scene-37:0", "scene-38:0", "scene-38:2", "scene-38:4", "scene-38:6", "scene-39:1", "scene-39:3", "scene-39:13", "scene-40:0"]);

/* ===== v0.17 PLAYER QA / CONTINUITY PATCH =====
   Applied here so the existing v0.16 script order needs no changes. */
(()=>{
  'use strict';
  const scene=id=>window.STORY_DATA?.find(s=>s.id===id);
  const line=(id,index)=>scene(id)?.lines?.[index];
  const setText=(id,index,text)=>{const l=line(id,index);if(l)l.text=text};

  // Opening: the previous first line described a montage while the opening UI hid the stage.
  setText('scene-01',0,'17세기 후반, 프랑스 베르사유 궁전.');
  setText('scene-01',1,'유럽의 강력한 군주 가운데 한 명, 루이 14세. 사람들은 그를 태양왕이라 불렀다.');
  setText('scene-01',2,'루이는 세금 징수와 국가 업무를 수행하는 관료제를 강화했다.');
  window.ACTION_NARRATION_KEYS?.delete?.('scene-01:0');

  // Versailles court wording / typo.
  const s4=scene('scene-04');
  const s4Last=s4?.lines?.[s4.lines.length-1];
  if(s4Last?.type==='narration')s4Last.text='주변 신하들은 서로 눈치만 볼 뿐, 멋쩍은 미소를 지으며 고개를 끄덕였다.';

  // Make the body-swap handoff visible. dark_pulse is intentionally suppressed by the current presentation build.
  setText('scene-05',2,'촛불이 하나둘 꺼지고 문이 닫혔다. 잠든 루이의 방에 어둠이 내려앉았다.');
  const s5=scene('scene-05');
  const s5Last=s5?.lines?.[s5.lines.length-1];
  if(s5Last?.type==='direction')s5Last.effect='flash_white';

  // The first debate card used to repeat the game title immediately before DEBATE 01.
  const s9=scene('scene-09');
  const debateIntro=s9?.lines?.find(l=>l.type==='intertitle'&&l.effect==='debate_start');
  if(debateIntro){debateIntro.title='DEBATE I';debateIntro.subtitle='세금 · 의회와 왕권';}

  // Minor dialogue/wording polish found in sequential playthrough.
  setText('scene-16',12,'그럼 답은 간단하군.');
  setText('scene-25',10,'…아니다. 됐다.');
  scene('scene-14')?.lines?.forEach(l=>{if(typeof l.text==='string')l.text=l.text.replace('아이랜드','아일랜드')});

  // Return-to-France continuity: the swap began in the bedroom, not during the earlier throne-room report.
  setText('scene-38',0,'눈부신 빛이 걷히자 루이는 베르사유의 침실에서 자신의 몸으로 돌아와 있었다. 탁자에는 전날 밤 던져 둔 앤 여왕 즉위 보고서가 그대로였다. 얼마 뒤, 그는 그 보고서를 들고 다시 왕좌실에 섰다.');
  setText('scene-38',2,'루이는 보고서에서 시선을 떼고, 잠시 자신의 손을 내려다봤다.');

  // Ordinary country/location changes should feel like cuts, not repeated chapter cards.
  // Keep labels only for the real structural turns.
  window.SCENE_TRANSITION_LABEL.france='\u00a0';
  window.SCENE_TRANSITION_LABEL.england='\u00a0';
  window.SCENE_TRANSITION_LABEL.memory='\u00a0';

  // Player-facing build label. Internal save schema deliberately stays v0.16 for compatibility.
  document.title='태양왕이 여왕이 되었다 · PLAYER QA';
  const versionTag=document.querySelector('.version-tag');
  if(versionTag)versionTag.textContent='GAME / PLAYER QA POLISH';
})();
