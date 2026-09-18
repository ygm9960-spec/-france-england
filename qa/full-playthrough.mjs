import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const context={console,document:{title:'',querySelector:()=>null}};context.window=context;
vm.createContext(context);
for(const file of ['storyData.js','debateData.js','stageMap.js','assetMap.js','visualMap.js','directorMap.js','portraitLayout.js']){
  vm.runInContext(fs.readFileSync(path.join(root,'js',file),'utf8'),context,{filename:file});
}

const errors=[];const notes=[];
const assert=(condition,message)=>{if(!condition)errors.push(message)};
const exists=relative=>relative&&fs.existsSync(path.join(root,relative));
const {STORY_DATA,DEBATE_DATA,LOGIC_BULLETS,STAGE_MAP,ACTOR_DEFS,ASSET_MAP,SCENE_ASSET_MAP,SCENE_PROP_MAP,SPECIAL_CUE_MAP,resolveActorAsset,portraitFrames}=context;

assert(STORY_DATA.length===40,`장면 수가 40이 아님: ${STORY_DATA.length}`);
STORY_DATA.forEach((scene,index)=>{
  assert(scene.number===index+1,`${scene.id}: 장면 번호 불연속`);
  assert(Array.isArray(scene.lines)&&scene.lines.length>0,`${scene.id}: 대사 없음`);
  assert(STAGE_MAP[scene.id],`${scene.id}: 무대 배치 없음`);
  const bgKey=SCENE_ASSET_MAP[scene.id];
  assert(bgKey,`${scene.id}: 배경 매핑 없음`);
  assert(ASSET_MAP.backgrounds[bgKey],`${scene.id}: 배경 키 ${bgKey}가 등록되지 않음`);
  assert(exists(ASSET_MAP.backgrounds[bgKey]),`${scene.id}: 배경 파일 없음 (${ASSET_MAP.backgrounds[bgKey]})`);
  const cast=new Set((STAGE_MAP[scene.id]||[]).map(actor=>actor.id));
  for(const line of scene.lines){
    assert(['dialogue','narration','monologue','direction','intertitle','debate'].includes(line.type),`${scene.id}: 알 수 없는 line type ${line.type}`);
    if('text' in line)assert(String(line.text||'').trim().length>0,`${scene.id}: 빈 텍스트`);
    if(line.actorId){
      assert(ACTOR_DEFS[line.actorId],`${scene.id}: 미등록 actorId ${line.actorId}`);
      const rememberedVoice=scene.id==='scene-31'&&line.actorId==='louis14';
      assert(cast.has(line.actorId)||rememberedVoice,`${scene.id}: ${line.actorId} 대사는 있으나 무대 배치에 없음`);
    }
    if(line.type==='debate')assert(DEBATE_DATA[line.debateId],`${scene.id}: 논쟁 ${line.debateId} 없음`);
  }
  const propKey=SCENE_PROP_MAP[scene.id];
  if(propKey)assert(exists(ASSET_MAP.documents[propKey]?.path),`${scene.id}: 소품 파일 없음 (${propKey})`);
});

for(const [actorId,def] of Object.entries(ACTOR_DEFS)){
  const intentionallySilhouetted=['maid','french_general','unknown'].includes(actorId);
  if(!intentionallySilhouetted)assert(exists(resolveActorAsset(actorId,'default')),`${actorId}: 기본 인물 이미지 없음`);
}
for(const [key,meta] of Object.entries(ASSET_MAP.documents))assert(exists(meta.path),`문서 파일 없음: ${key}`);
for(const [key,meta] of Object.entries(ASSET_MAP.specials))assert(exists(meta.path),`특수장면 파일 없음: ${key}`);
for(const [cueKey,cue] of Object.entries(SPECIAL_CUE_MAP||{}))assert(ASSET_MAP.specials[cue.key],`${cueKey}: 특수장면 키 없음 (${cue.key})`);

const bulletIds=new Set(LOGIC_BULLETS.map(b=>b.id));
let completedRounds=0;let encounteredDebates=0;let visibleLines=0;
for(const scene of STORY_DATA){
  for(const line of scene.lines){
    if(['dialogue','narration','monologue','intertitle'].includes(line.type))visibleLines++;
    if(line.type!=='debate')continue;
    encounteredDebates++;
    const debate=DEBATE_DATA[line.debateId];
    debate.rounds.forEach((round,roundIndex)=>{
      assert(bulletIds.has(round.answer),`${line.debateId} R${roundIndex+1}: 정답 탄환 없음`);
      const targets=new Set([...String(round.statement||'').matchAll(/\[\[([^|\]]+)\|/g)].map(match=>match[1]));
      assert(targets.has(round.answerTarget),`${line.debateId} R${roundIndex+1}: 정답 논점 없음`);
      completedRounds++;
    });
  }
}
assert(encounteredDebates===3,`논쟁 진입 수가 3이 아님: ${encounteredDebates}`);
assert(completedRounds===6,`완료 라운드 수가 6이 아님: ${completedRounds}`);

for(const viewport of [[568,216],[667,245],[844,342],[932,374]]){
  for(const scene of STORY_DATA){
    const cast=STAGE_MAP[scene.id]||[];
    const frames=portraitFrames(cast,...viewport).filter(Boolean);
    for(const frame of frames){
      assert(frame.left>=-0.5&&frame.left+frame.width<=viewport[0]+0.5,`${scene.id}/${frame.id}: ${viewport.join('x')} 가로 이탈`);
      assert(frame.top>=-viewport[1]*.25&&frame.top+frame.height<=viewport[1]*1.35,`${scene.id}/${frame.id}: ${viewport.join('x')} 세로 이탈`);
    }
    if(frames.length>1){
      const faces=frames.map(frame=>frame.face);const spread=Math.max(...faces)-Math.min(...faces);
      assert(spread<1,`${scene.id}: 얼굴 크기 편차 ${spread.toFixed(1)}px`);
    }
  }
}

const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  const ref=match[1];if(!ref.startsWith('http')&&!ref.startsWith('#'))assert(exists(ref.split('?')[0].replace(/^\.\//,'')),`HTML 참조 파일 없음: ${ref}`);
}
for(const cssFile of ['style.css','presentation.css']){
  const css=fs.readFileSync(path.join(root,'css',cssFile),'utf8');
  for(const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)){
    const ref=match[1];if(!ref.startsWith('data:')&&!ref.startsWith('var('))assert(fs.existsSync(path.resolve(root,'css',ref)),`${cssFile}: CSS 자산 없음 ${ref}`);
  }
}

notes.push(`40개 장면, 화면 대사 ${visibleLines}개를 순서대로 통과`);
notes.push(`3개 논쟁, 정답 경로 6라운드 통과`);
notes.push('4개 모바일 가로 화면에서 160개 장면 배치 계산 확인');
if(errors.length){console.error(errors.map(e=>`FAIL · ${e}`).join('\n'));process.exit(1)}
console.log(notes.map(n=>`PASS · ${n}`).join('\n'));
