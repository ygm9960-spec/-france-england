window.LOGIC_BULLETS = [
  {id:'ignore_parliament',name:'의회 무시',definition:'프랑스식 강한 왕권과 영국 의회정치가 충돌하는 지점'},
  {id:'bureaucracy',name:'관료제',definition:'국왕의 명령과 국가 업무를 실제로 수행하는 관리 조직'},
  {id:'sun_king',name:'태양왕',definition:'루이 14세가 왕을 국가의 중심으로 표현하는 상징'},
  {id:'versailles',name:'베르사유 궁전',definition:'왕권의 위엄과 정치적 중심을 보여주는 무대'},
  {id:'standing_army',name:'상비군',definition:'평소에도 유지되어 즉시 동원 가능한 전문 군대'},
  {id:'divine_right',name:'왕권신수설',definition:'왕의 권력이 신에게서 왔다고 정당화하는 논리'}
];

// Candidate syntax: [[target_id|text]]. Students must choose BOTH the right bullet and the right claim target.
window.DEBATE_DATA = {
  tax:{
    number:'DEBATE 01',topic:'TAX · 세금',speed:15,
    preUsed:[],
    rounds:[
      {
        statement:'폐하, [[tax|새로운 세금]]을 부과하려면 [[royal_choice|왕의 결단만으로]] 처리할 수 없습니다. [[parliament|의회와 논의해야 합니다.]]',
        answer:'ignore_parliament',answerTarget:'parliament',
        rebuttal:'프랑스에서는 왕이 결단한다. 일일이 의회의 허락을 기다릴 이유가 없다!',
        hint:'루이는 의회의 허락을 중요하게 여겼을까?',
        categoryHint:'프랑스의 왕권과 영국의 의회가 충돌하는 지점을 떠올려 보자.'
      },
      {
        statement:'[[wide_country|그렇게 넓은 나라]]에서 [[king_alone|왕 혼자]] [[tax_collect|세금을 거둘 수 있겠습니까?]]',
        answer:'bureaucracy',answerTarget:'king_alone',
        rebuttal:'왕이 직접 걷는다고 누가 그랬나? 관료제가 있다. 짐이 명령하면 관리들이 전국에서 움직인다.',
        hint:'왕이 직접 모든 일을 하는 것이 아니라, 왕의 명령을 실제로 집행하는 조직을 떠올려 보자.',
        categoryHint:'왕 개인이 아니라 국가의 행정 조직과 관련된 개념이다.'
      }
    ]
  },
  palace:{
    number:'DEBATE 02',topic:'PALACE · 궁전',speed:12,
    preUsed:['ignore_parliament','bureaucracy'],
    rounds:[
      {
        statement:'[[cost|막대한 돈]]을 들인 [[palace|거대한 궁전]]이 [[politics|실제 정치에 무슨 도움이 됩니까?]]',
        answer:'versailles',answerTarget:'politics',
        rebuttal:'베르사유는 단순한 집이 아니다. 귀족과 외국 사절이 왕에게 오게 만드는 정치의 무대다.',
        hint:'루이가 지은 궁전은 단순한 주거 공간이었을까, 권력을 보여주는 정치 공간이었을까?',
        categoryHint:'건축물 자체가 정치 무대로 기능한 사례를 떠올려 보자.'
      },
      {
        statement:'왜 [[country_center|국가의 중심]]이 반드시 [[one_king|왕 한 사람]]이어야 합니까? [[parliament_voice|의회의 목소리]]도 존재합니다.',
        answer:'sun_king',answerTarget:'one_king',
        rebuttal:'짐은 태양왕이다. 태양이 둘일 수는 없지.',
        hint:'루이는 자신을 무엇에 비유하며 국가의 중심이라고 생각했을까?',
        categoryHint:'루이 14세의 별칭과 왕 중심의 상징을 떠올려 보자.'
      }
    ]
  },
  war:{
    number:'DEBATE 03',topic:'WAR · 전쟁',speed:9.5,
    preUsed:['ignore_parliament','bureaucracy','versailles','sun_king'],
    rounds:[
      {
        statement:'[[war_start|전쟁이 시작될 때마다]] [[new_army|군대를 새로 모으는 것]]은 [[delay_cost|너무 늦고 비쌉니다.]]',
        answer:'standing_army',answerTarget:'new_army',
        rebuttal:'그러니까 상비군을 두는 것이다. 전쟁 전에 이미 군대가 존재해야 한다.',
        hint:'전쟁이 없어도 평소부터 유지되는 군대는 무엇일까?',
        categoryHint:'군대를 언제 모집하느냐와 관련된 개념이다.'
      },
      {
        statement:'왕께서 [[parliament_will|의회의 뜻]]을 무시할 [[royal_right|권리는 어디에서 나옵니까?]] [[english_law|영국의 법]]도 존재합니다.',
        answer:'divine_right',answerTarget:'royal_right',
        rebuttal:'신이 왕을 세운다. 왕의 권한을 인간이 허락하는 것이 아니다.',
        hint:'루이는 자신의 왕권이 인간이 아니라 누구에게서 왔다고 믿었을까?',
        categoryHint:'왕권을 정당화하는 사상과 관련된 개념이다.'
      }
    ]
  }
};
