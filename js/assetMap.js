// v0.6 · final art wiring
window.ASSET_MAP = {
  actors: {
    louis14:{default:'images/characters/louis_default.webp',confident:'images/characters/louis_default.webp',smirk:'images/characters/louis_smirk.webp',angry:'images/characters/louis_angry.webp',reflective:'images/characters/louis_reflective.webp'},
    anne_louis:{default:'images/characters/anne_default.webp',shocked:'images/characters/anne_shocked.webp',annoyed:'images/characters/anne_annoyed.webp',confident:'images/characters/anne_confident.webp',debate:'images/characters/anne_debate.webp',puzzled:'images/characters/anne_puzzled.webp',furious:'images/characters/anne_furious.webp',reflective:'images/characters/anne_reflective.webp'},
    robert:{default:'images/characters/robert_default.webp',puzzled:'images/characters/robert_puzzled.webp',dry:'images/characters/robert_dry.webp',concerned:'images/characters/robert_concerned.webp'},
    mp_leader:{default:'images/characters/mp_leader_default.webp',firm:'images/characters/mp_leader_firm.webp'},
    mp_secondary:{default:'images/characters/mp_secondary.webp',firm:'images/characters/mp_secondary.webp'},
    parlement_rep:{default:'images/characters/paris_parlement_rep.webp',firm:'images/characters/paris_parlement_rep.webp'},
    french_official:{default:'images/characters/french_official.webp'},
    french_general:{default:'images/characters/french_general.webp'},
    french_reporter:{default:'images/characters/french_official.webp'},
    english_general:{default:'images/characters/english_general.webp'},
    maid:{default:'images/characters/maid.webp'},
    elizabeth:{default:'images/characters/elizabeth_i.webp'},
    james1:{default:'images/characters/james_i.webp'},
    charles1:{default:'images/characters/charles_i.webp'},
    james2:{default:'images/characters/james_ii.webp'},
    unknown:{default:null}
  },
  backgrounds: {
    bg_versailles_hall:'images/backgrounds/bg_versailles_hall.webp',
    bg_versailles_bedroom_night:'images/backgrounds/bg_dark_throne.webp',
    bg_anne_bedroom:'images/backgrounds/bg_anne_bedroom.webp',
    bg_royal_breakfast:'images/backgrounds/bg_anne_bedroom.webp',
    bg_english_study:'images/backgrounds/bg_english_study.webp',
    bg_parliament:'images/backgrounds/bg_parliament.webp',
    bg_london_carriage:'images/backgrounds/bg_harbor_departure.webp',
    bg_dream_elizabeth_court:'images/backgrounds/bg_dream_hall.webp',
    bg_dream_parliament_dark:'images/backgrounds/bg_dark_throne.webp',
    bg_dream_palace_departure:'images/backgrounds/bg_dream_hall.webp'
  },
  documents: {
    anne_accession:{path:'images/documents/doc_anne_accession_report.webp',label:'앤 여왕 즉위 보고서'},
    bill_of_rights:{path:'images/documents/doc_bill_of_rights.webp',label:'1689 권리장전'},
    palace_blueprint:{path:'images/documents/doc_palace_blueprint.webp',label:'궁전 증축 설계도'},
    europe_war_map:{path:'images/documents/map_europe_spain_france_england.webp',label:'유럽 전쟁 지도'},
    dream_red_seal:{path:'images/documents/doc_rights_redseal.webp',label:'붉은 봉인의 문서'},
    tax_ledger:{path:'images/documents/ledger_taxation.webp',label:'세금 장부'},
    crown:{path:'images/documents/prop_crown.webp',label:'왕관'},
    english_meal:{path:'images/documents/prop_meal_english.webp',label:'영국식 아침 식사'},
    sun_emblem:{path:'images/documents/sun_emblem.webp',label:'태양왕 문양'}
  },
  specials: {
    title_poster:{path:'images/specials/title_poster.webp',label:'타이틀 포스터'},
    young_louis_fronde:{path:'images/specials/young_louis_fronde.webp',label:'프롱드의 기억'},
    charles_door_flash:{path:'images/specials/charles_door_flash.webp',label:'찰스 1세의 기억'},
    dream_crown_offer:{path:'images/specials/dream_crown_offer.webp',label:'왕관에 조건을 붙이는 나라'},
    realization_montage:{path:'images/specials/realization_montage.webp',label:'왕을 만든 구조'},
    mirror_return:{path:'images/specials/mirror_return.webp',label:'마지막 거울'},
    louis_wakes_as_anne:{path:'images/specials/louis_wakes_as_anne.webp',label:'앤의 몸에서 눈뜬 루이'},
    summon_parliament_event:{path:'images/specials/summon_parliament_event.webp',label:'의회를 소집하라'},
    sun_king_outburst:{path:'images/specials/sun_king_outburst.webp',label:'태양왕의 폭발'}
  }
};

window.SCENE_ASSET_MAP = {
  'scene-01':'bg_versailles_hall','scene-02':'bg_versailles_hall','scene-03':'bg_versailles_hall','scene-04':'bg_versailles_hall','scene-05':'bg_versailles_bedroom_night',
  'scene-06':'bg_anne_bedroom','scene-07':'bg_anne_bedroom','scene-08':'bg_royal_breakfast','scene-09':'bg_english_study','scene-10':'bg_parliament',
  'scene-11':'bg_parliament','scene-12':'bg_royal_breakfast','scene-13':'bg_anne_bedroom','scene-14':'bg_dream_elizabeth_court','scene-15':'bg_anne_bedroom',
  'scene-16':'bg_english_study','scene-17':'bg_parliament','scene-18':'bg_english_study','scene-19':'bg_dream_parliament_dark','scene-20':'bg_dream_parliament_dark','scene-21':'bg_english_study','scene-22':'bg_english_study','scene-23':'bg_english_study',
  'scene-24':'bg_parliament','scene-25':'bg_london_carriage','scene-26':'bg_anne_bedroom','scene-27':'bg_dream_palace_departure','scene-28':'bg_dream_palace_departure',
  'scene-29':'bg_anne_bedroom','scene-30':'bg_parliament','scene-31':'bg_parliament','scene-32':'bg_parliament','scene-33':'bg_parliament','scene-34':'bg_parliament',
  'scene-35':'bg_london_carriage','scene-36':'bg_anne_bedroom','scene-37':'bg_anne_bedroom','scene-38':'bg_versailles_hall','scene-39':'bg_versailles_hall','scene-40':'bg_versailles_hall'
};
window.SCENE_BACKGROUND_MAP = window.SCENE_ASSET_MAP;

window.SCENE_PROP_MAP = {
  'scene-04':'anne_accession','scene-08':'english_meal',
  'scene-16':'palace_blueprint','scene-17':'palace_blueprint','scene-18':'palace_blueprint',
  'scene-22':'europe_war_map','scene-23':'europe_war_map','scene-24':'europe_war_map',
  'scene-28':'dream_red_seal','scene-30':'bill_of_rights','scene-31':'bill_of_rights','scene-34':'bill_of_rights','scene-36':'crown'
};
window.resolveAsset=function(type,key){const entry=window.ASSET_MAP?.[type]?.[key];return entry?.path||entry||null};
window.resolveActorAsset=function(actorId,variant='default'){const actor=window.ASSET_MAP?.actors?.[actorId];if(!actor)return null;return actor[variant]||actor.default||null};
window.resolveDocumentMeta=function(key){return window.ASSET_MAP?.documents?.[key]||null};
window.resolveSpecialMeta=function(key){return window.ASSET_MAP?.specials?.[key]||null};
