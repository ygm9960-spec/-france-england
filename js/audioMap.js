// v0.4 audio skeleton. Leave path:null until BGM/SFX are approved.
window.AUDIO_MAP = {
  bgm: {
    TITLE:{path:null,volume:.62}, FRANCE:{path:null,volume:.58}, ENGLAND:{path:null,volume:.55},
    DEBATE:{path:null,volume:.62}, DREAM:{path:null,volume:.50}, FINAL:{path:null,volume:.56},
    REALIZATION:{path:null,volume:.48}, EPILOGUE:{path:null,volume:.52}
  },
  sfx: {
    THROAT:{path:null,volume:.75}, SUMMON:{path:null,volume:.82}, HIT:{path:null,volume:.85}, MISS:{path:null,volume:.70},
    REVERSE:{path:null,volume:.9}, PAGE:{path:null,volume:.55}, SEAL:{path:null,volume:.62}
  }
};

window.sceneBgmKey = function(scene){
  if(!scene)return 'TITLE';
  if(scene.chapter==='FINAL')return 'FINAL';
  if(scene.chapter==='REALIZATION')return 'REALIZATION';
  if(scene.chapter==='EPILOGUE')return 'EPILOGUE';
  if(String(scene.chapter||'').includes('MEMORY')||scene.tone==='dream')return 'DREAM';
  if(scene.country==='FRANCE')return 'FRANCE';
  return 'ENGLAND';
};
