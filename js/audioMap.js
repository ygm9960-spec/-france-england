/* v0.45 complete soundtrack map */
window.AUDIO_MAP = {
  bgm: {
    TITLE:{path:'audio/01_le_roi_soleil.mp3',volume:.48},
    FRANCE:{path:'audio/01_le_roi_soleil.mp3',volume:.48},
    ENGLAND:{path:'audio/02_the_crown_has_rules.mp3',volume:.45},
    DREAM:{path:'audio/03_a_crown_in_a_dream.mp3',volume:.40},
    DEBATE:{path:'audio/04_words_against_the_crown.mp3',volume:.43},
    FINAL:{path:'audio/02_the_crown_has_rules.mp3',volume:.43},
    REALIZATION:{path:'audio/05_not_the_king_alone.mp3',volume:.43},
    EPILOGUE:{path:'audio/05_not_the_king_alone.mp3',volume:.43},
    EXPLODE:{path:'audio/06_the_sun_king_explodes.mp3',volume:.47},
    FRONDE:{path:'audio/08_fronde_a_king_remembers.mp3',volume:.38}
  },
  stingers: {
    PASSAGE:{path:'audio/07_the_passage_of_crowns.mp3',volume:.52,maxMs:6500}
  },
  sfx: {
    THROAT:{path:null,volume:.75}, SUMMON:{path:null,volume:.82}, HIT:{path:null,volume:.85}, MISS:{path:null,volume:.70},
    REVERSE:{path:null,volume:.9}, PAGE:{path:null,volume:.55}, SEAL:{path:null,volume:.62}
  }
};

window.sceneBgmKey = function(scene,lineIndex=0){
  if(!scene)return 'TITLE';
  const i=Number(lineIndex)||0;
  if(scene.id==='scene-02'&&i>=6&&i<=9)return 'FRONDE';
  if(scene.id==='scene-33')return 'EXPLODE';
  if(scene.chapter==='FINAL')return 'FINAL';
  if(scene.chapter==='REALIZATION')return 'REALIZATION';
  if(scene.chapter==='EPILOGUE')return 'EPILOGUE';
  if(String(scene.chapter||'').includes('MEMORY')||scene.tone==='dream')return 'DREAM';
  if(scene.country==='FRANCE')return 'FRANCE';
  return 'ENGLAND';
};
