// v0.6 · timing / camera / acting cues. Keys are `${sceneId}:${lineIndex}`.
const P = window.DIRECTOR_PRESETS = {
  throat:{camera:'close',focus:'anne_louis',pose:'confident',beatBefore:220,effect:'throat_clear'},
  summon:{camera:'close',focus:'anne_louis',pose:'confident',beatBefore:160,beatAfter:420,effect:'summon_parliament'},
  reversal:{camera:'close',focus:'robert',beatBefore:500,beatAfter:620,effect:'reversal'},
  historyEcho:{camera:'close',focus:'mp_leader',beatBefore:420,beatAfter:520,effect:'flashback_history'},
  charlesShock:{camera:'close',focus:'mp_leader',beatBefore:420,beatAfter:1250,effect:'charles_reveal'},
  sunClaim:{camera:'close',focus:'anne_louis',pose:'furious',beatBefore:220,beatAfter:700,effect:'sunburst'},
  reverse:{camera:'close',focus:'mp_leader',pose:'firm',beatBefore:0,beatAfter:0,effect:'reverse_rebuttal'},
  lastMirror:{camera:'close',focus:'louis14',pose:'reflective',beatBefore:250,beatAfter:1400}
};
window.DIRECTOR_MAP = {
  'scene-04:0':{effect:'show_prop',propKey:'anne_accession',propHold:1350},
  'scene-08:0':{effect:'show_prop',propKey:'english_meal',propHold:1250,hold:1250},
  'scene-09:11':{...P.throat},'scene-09:12':{...P.summon},
  'scene-16:8':{effect:'show_prop',propKey:'palace_blueprint',propHold:1500,hold:1350},
  'scene-16:11':{...P.throat},'scene-16:13':{...P.summon},
  'scene-17:0':{effect:'show_prop',propKey:'palace_blueprint',propHold:1650},
  'scene-18:0':{effect:'show_prop',propKey:'palace_blueprint',propHold:1450},
  'scene-22:1':{effect:'show_prop',propKey:'europe_war_map',propHold:1750,hold:1500},
  'scene-23:0':{effect:'show_prop',propKey:'europe_war_map',propHold:1450,hold:1200},
  'scene-23:5':{camera:'close',focus:'anne_louis',beatAfter:500},
  'scene-23:14':{...P.throat},'scene-23:15':{...P.summon},
  'scene-24:0':{effect:'show_prop',propKey:'europe_war_map',propHold:1400},
  'scene-29:12':{...P.reversal},
  'scene-31:1':{camera:'close',focus:null,beatBefore:80},'scene-31:7':{camera:'close',focus:'mp_leader',beatBefore:180,beatAfter:320},
  'scene-32:6':{...P.charlesShock},'scene-33:5':{camera:'close',focus:'anne_louis',pose:'furious',beatBefore:160,beatAfter:380},'scene-33:6':{...P.sunClaim},'scene-34:0':{...P.reverse},'scene-34:10':{camera:'close',focus:'mp_leader',pose:'firm',beatBefore:320,beatAfter:620},
  'scene-40:1':{camera:'close',focus:'louis14',pose:'reflective',beatAfter:700},'scene-40:3':{...P.lastMirror}
};
window.POSE_TIMELINE = {
  'scene-02':{louis14:[[0,'default'],[4,'angry']]},'scene-04':{louis14:[[0,'default'],[3,'smirk']]},
  'scene-06':{anne_louis:[[0,'shocked'],[20,'puzzled'],[27,'annoyed']]},'scene-07':{anne_louis:[[0,'annoyed']]},
  'scene-08':{anne_louis:[[0,'default'],[9,'annoyed']],robert:[[0,'default'],[4,'puzzled']]},
  'scene-09':{anne_louis:[[0,'default'],[1,'confident']]},'scene-10':{anne_louis:[[0,'debate']],mp_leader:[[0,'firm']]},
  'scene-11':{anne_louis:[[0,'confident']]},'scene-12':{anne_louis:[[0,'confident']],robert:[[0,'dry']]},
  'scene-14':{anne_louis:[[0,'puzzled']]},'scene-16':{anne_louis:[[0,'default'],[5,'confident']],robert:[[0,'puzzled']]},
  'scene-17':{anne_louis:[[0,'debate']],mp_leader:[[0,'firm']]},'scene-18':{anne_louis:[[0,'confident']],robert:[[0,'puzzled']]},
  'scene-20':{anne_louis:[[0,'confident'],[7,'puzzled']]},'scene-23':{anne_louis:[[0,'default'],[4,'puzzled'],[9,'confident']],robert:[[0,'concerned']]},
  'scene-24':{anne_louis:[[0,'debate']],mp_leader:[[0,'firm']]},'scene-25':{anne_louis:[[0,'puzzled']],robert:[[0,'concerned']]},
  'scene-27':{anne_louis:[[0,'puzzled']]},'scene-28':{anne_louis:[[0,'puzzled']],mp_leader:[[0,'firm']]},
  'scene-29':{anne_louis:[[0,'puzzled']],robert:[[0,'concerned']]},'scene-30':{anne_louis:[[0,'puzzled']],mp_leader:[[0,'firm']]},
  'scene-31':{anne_louis:[[0,'puzzled']],mp_leader:[[0,'firm']]},'scene-32':{anne_louis:[[0,'puzzled']],mp_leader:[[0,'firm']]},
  'scene-33':{anne_louis:[[0,'furious']],mp_leader:[[0,'firm']]},'scene-34':{anne_louis:[[0,'furious'],[9,'reflective']],mp_leader:[[0,'firm']]},
  'scene-35':{anne_louis:[[0,'reflective']],robert:[[0,'concerned']]},'scene-36':{anne_louis:[[0,'reflective']]},'scene-37':{anne_louis:[[0,'reflective']]},
  'scene-39':{louis14:[[0,'default'],[1,'smirk'],[3,'reflective']]},'scene-40':{louis14:[[0,'reflective']]}
};
window.poseForLine=function(sceneId,lineIndex,actorId){const seq=window.POSE_TIMELINE?.[sceneId]?.[actorId];if(!seq)return 'default';let pose='default';for(const [from,p] of seq){if(lineIndex>=from)pose=p;else break}return pose};
