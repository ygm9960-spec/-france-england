# CHANGELOG

## v0.42
- 과거의 루이 회상을 자동 소멸이 아닌 학생 클릭 진행 방식으로 변경하고 완전 흑백 처리.
- SCENE 36에서 대사창 우측 상단을 가리던 소품 표시 제거.
- “그건 프랑스입니다.” 직전·직후의 멈춤 연출 제거. 중요·외침 대사는 글자 크기와 짧은 충격 애니메이션으로 감정 강조.
- 이벤트 이미지를 카드가 아닌 전체 스토리 화면의 장면 배경처럼 표시하도록 변경.
- 마지막 거울 이벤트 이미지를 유지한 채 마지막 대사가 하단 대사창에서 이어지도록 변경.
- 왕관 조건 꿈 장면도 전체 이벤트 배경 + 하단 대사창 구조 유지.
- 좁아진 대사창 내부에서 과거의 52~68ch 가로폭 제한을 제거하고 패널 전체 폭을 사용하도록 변경.
- CHANGELOG는 단일 CHANGELOG.md에 계속 누적.


## v0.41
- 디베이트 좌우 인물 크기를 소폭 확대하되 중앙 발언/논점 영역은 침범하지 않도록 제한.
- 대사창과 나레이션창의 높이·폭을 동일하게 통일하고, 16:9 배경 실제 표시 폭을 기준으로 더 작고 중앙에 배치.
- 앤의 몸에 든 루이가 호통·당황 반응을 보이는 일부 대사에서 좌우/상하 흔들림 효과 추가.
- “의회를 소집하라!” 핵심 대사의 글자 크기와 강조를 확대.
- 교사용 미리보기 종료 배지를 화면 하단에서 상단 UI 영역으로 이동.
- 장소 또는 시간 변화 시 검은 화면 페이드 전환 및 장소/시간 문구 중앙 표시 추가.
- 두 번째 꿈의 찰스 1세 이벤트 이미지를 16:9 전체 프레임으로 맞추고 표시 시간을 늘리며 페이드 인/아웃 적용.
- 프롱드의 난 및 꿈 이벤트 이미지가 하단에서 잘리지 않도록 배경과 동일한 16:9 contain 방식으로 통일.
- 세 번째 꿈의 왕관 장면은 왕관 배경만 유지하고 인물·문서·소품을 숨긴 상태에서 하단 대사창으로만 진행하도록 수정.


## v0.40
- 디베이트 발언 문장의 좌우 이동 효과를 다시 활성화.
- v0.39에서 수정한 글자 크기, 논점 터치 영역, 탄환 덱 크기·레이어 구조는 그대로 유지.
- 문장 이동 속도는 기존 디베이트 데이터의 속도 설정을 그대로 사용하고, 탄환 발사/정답 처리 시에는 기존처럼 잠시 정지.


## v0.39
- SCENE 10 시작 자막부터 앤(루이)과 의회 대표가 바로 보이도록 입장 처리 수정.
- 전체 스토리 캐릭터 구도를 약 4% 위로 올려 대사창에 가려지는 면적 축소.
- 디베이트 모드 인물 이미지의 과도한 확대/왜곡을 제거하고 좌우 영역 안에서 `contain`으로 제한.
- 디베이트 문장 크기, 논점 클릭 영역, 탄환 덱의 z-index·터치 영역을 재정리해 모바일 가로에서 진행 가능하도록 수정.
- 움직이는 문장 레일을 정지시켜 논리탄환 조준/발사가 안정적으로 되도록 변경.
- 시작화면 제목뿐 아니라 스토리 상단 장면 제목과 디베이트 상단 제목도 빠르게 5번 탭하면 교사모드 진입 가능.
- CHANGELOG를 단일 파일로 통합.

---

# CHANGELOG v0.38

- 캐릭터 원본의 밝은 외곽선(halo) 완화 작업 적용
- 인물 실루엣 가장자리의 경계 픽셀을 내부 색으로 재보정
- 어두운 배경에서 두드러지던 흰색·주황빛 테두리 감소
- 캐릭터 파일명 및 호출 구조는 유지, 이미지 파일만 교체
- 서비스워커 캐시 버전 갱신(v0.38)

## 처리 파일
- anne_annoyed.webp: 9389 edge pixels adjusted
- anne_confident.webp: 8757 edge pixels adjusted
- anne_debate.webp: 9852 edge pixels adjusted
- anne_default.webp: 8687 edge pixels adjusted
- anne_furious.webp: 10231 edge pixels adjusted
- anne_puzzled.webp: 8810 edge pixels adjusted
- anne_reflective.webp: 8790 edge pixels adjusted
- anne_shocked.webp: 8611 edge pixels adjusted
- charles_i.webp: 9053 edge pixels adjusted
- elizabeth_i.webp: 9661 edge pixels adjusted
- english_general.webp: 10612 edge pixels adjusted
- french_official.webp: 9539 edge pixels adjusted
- james_i.webp: 10381 edge pixels adjusted
- james_ii.webp: 9092 edge pixels adjusted
- louis_angry.webp: 9214 edge pixels adjusted
- louis_default.webp: 8817 edge pixels adjusted
- louis_reflective.webp: 8329 edge pixels adjusted
- louis_smirk.webp: 8949 edge pixels adjusted
- mp_leader_default.webp: 11080 edge pixels adjusted
- mp_leader_firm.webp: 11954 edge pixels adjusted
- mp_secondary.webp: 9339 edge pixels adjusted
- paris_parlement_rep.webp: 9554 edge pixels adjusted
- robert_concerned.webp: 8891 edge pixels adjusted
- robert_default.webp: 9045 edge pixels adjusted
- robert_dry.webp: 9031 edge pixels adjusted
- robert_puzzled.webp: 9114 edge pixels adjusted

---

# CHANGELOG v0.37

## 핵심 수정
- 화면 전체가 왼쪽으로 반 화면 밀리던 근본 원인 제거
  - 구형 `.screen { left:50%; transform:translateX(-50%) }` 규칙 완전 무효화
  - 모든 화면을 `inset:0; width:100%; transform:none` 기준으로 통일
  - 19:9 이상 초광폭 화면에서 남아 있던 16:9 폭 제한도 제거
- 시작 화면 구형 배경 구조 제거
  - `poster-bg`, France/England 패널, 왕관 요소를 HTML에서 삭제
  - 생성된 `title_poster.webp`를 유일한 타이틀 배경으로 사용
  - 구형 요소가 캐시로 남아도 CSS에서 강제 숨김
- 타이틀 이미지의 테두리/윤곽/그림자 완전 제거
- 모바일 가로에서는 전체 타이틀 이미지를 보존하며 중앙 정렬
- 서비스워커 캐시 v0.37로 갱신

---

# CHANGELOG v0.36

- 시작 화면이 좌측으로 쏠려 보이던 현상 수정
- 데스크톱/넓은 화면에서는 타이틀 포스터가 화면 중앙을 기준으로 꽉 차게 표시되도록 조정
- 모바일 가로의 작은 화면에서는 기존처럼 전체 포스터를 보존하되 중앙 정렬 유지
- 타이틀 포스터 뒤/가장자리에 보이던 흰색 테두리선 및 잔여 윤곽 제거
- 배경/캐릭터/논쟁 이미지에도 border/outline이 남지 않도록 정리
- 서비스워커 캐시 버전 갱신(v0.36)

---

# v0.35 — 캐릭터 하단 위치 수정

- 캐릭터 레이어가 대사창 윗선에서 끝나던 구조를 제거했습니다.
- 캐릭터 레이어를 무대 전체 높이까지 확장했습니다.
- 캐릭터 PNG의 하단이 대사창 뒤로 자연스럽게 내려가도록 변경했습니다.
- 모바일 가로 화면에서 캐릭터 아래에 배경 빈 띠가 보이는 현상을 방지했습니다.
- 캐릭터는 화면 하단에서만 잘릴 수 있으며, 대사창 경계 때문에 잘리지 않습니다.
- v0.34의 대사/나레이션/논리탄환/눈뜨기 연출 수정은 그대로 유지합니다.

---

# v0.34 · Mobile presentation / dialogue / debate fix

- Story backgrounds always use `contain` + centered framing so 16:9 artwork is never cropped by scene zoom values.
- `???` dialogue now uses a black full-screen, centered cinematic presentation.
- All non-opening narration is rendered in the regular bottom dialogue panel; the floating action-beat narration overlay is disabled.
- Narration and character dialogue use distinct text colors; central historical terms/key lines receive restrained emphasis.
- Typewriter speed slowed substantially, especially for short/key lines.
- Exclamation/shouting dialogue triggers a short shake on the active character portrait only.
- Added eyelid-opening transition when Scene 06 begins (Louis wakes in Anne's body).
- Dialogue panel is forced above portrait layers to prevent character art from covering text.
- Logic-bullet tray reduced from ~28–30dvh to ~12dvh (52px on very short landscape screens).
- Debate statement and bullet labels use smaller responsive typography and overflow-safe wrapping to prevent clipping.
- Service-worker cache bumped to v0.34.

---

# v0.33 Mobile Landscape / Fullscreen Fix

- 모바일 실제 visual viewport 높이를 `--app-h`에 반영하고 모든 화면 컨테이너가 그 값을 사용하도록 수정.
- 시작 화면, 스토리 HUD, 메뉴에 명시적인 전체화면 전환 기능 추가.
- 첫 사용자 입력(pointerdown)에서 전체화면 요청을 먼저 보내 모바일 브라우저의 사용자 제스처 제한에 대응.
- Fullscreen API가 제한된 브라우저에서는 안내 메시지와 레이아웃 fallback 제공.
- 스마트폰 가로 화면(max-height 600px)에서는 16:9 배경 원본이 잘리지 않도록 `object-fit: contain` 강제.
- title poster도 모바일 가로에서 전체 이미지가 보이도록 contain 처리.
- safe-area(노치/카메라 홀/둥근 모서리) 여백 보강.
- service worker cache를 v0.33으로 갱신해 기존 v0.32 CSS/JS 캐시가 남지 않도록 수정.

---

# v0.32 · Layout & Opening Fade

- 사용자가 업로드한 `v0.31 OPENING FOCUS` 수정본을 새 기준본으로 사용
- 중앙 슬롯에 중복 적용되던 `translateX(-50%)`를 제거해 인물 위치가 옆으로 밀리는 문제 수정
- 2인 구도 중심을 34% / 66%, 3인 구도를 25% / 50% / 75%로 재정렬해 겹침 완화
- 이미지가 없는 시녀·프랑스 장군·??? 실루엣도 동일한 자동 인물 배치 계산에 포함
- `solo-focus`를 CSS 강제 이동이 아니라 실제 1인용 `portraitFrames()` 계산으로 변경
- 아직 등장하지 않은 인물은 배치 계산에서 제외하고, 1명→2명→3명 등장 시 자동으로 중앙/양쪽/3분할 구도로 재배치
- 모든 독백(`monologue`)에서 비화자를 숨기고 말하는 인물만 중앙에 배치
- SCENE 전환 시 이전 장면의 `solo-focus` 상태가 남지 않도록 초기화
- 시작 3개 나레이션은 검은 화면을 유지하면서 텍스트만 0.70초 페이드인 / 0.70초 페이드아웃
- `display:none` 해제와 같은 프레임에 `show`가 붙어 페이드인이 생략되던 문제를 2-frame staging으로 수정
- 스토리/논쟁 데이터, 이미지, 소품 지속 범위, BGM/SFX 설정은 변경하지 않음

---

# v0.31 · Opening Focus

- SCENE 01의 첫 세 나레이션을 완전한 검은 화면 중앙 문장으로 변경
- 오프닝 나레이션 동안 배경·HUD·인물을 완전히 숨김
- SCENE 01의 첫 루이 발언 구간에는 루이만 중앙에 표시
- 관리와 장군은 실제 첫 대사 시점에 맞춰 각각 등장
- 모든 `monologue` 인물은 중앙 단독 구도로 표시
- 26개 인물 WebP의 반투명 흰색 매트를 알파 채널에서 제거
- 인물 컨테이너의 테두리·배경·윤곽선·박스 그림자를 강제로 제거

---

# v0.30 · Clean Stage

- `.stage::before` 가상 장면 배경과 관련 CSS 변수 처리 완전 제거
- 시작화면과 모든 장면은 실제 `img` 요소만 배경으로 사용
- 화면 전체를 덮는 장면 전환 DOM과 실행 타이머 제거
- 흰색 플래시, 대형 문구 효과, 캡션 효과 DOM과 실행 함수 제거
- 인물 호흡 애니메이션과 대화 횟수 기반 자동 재구도 제거
- 사용되지 않는 흔들림·프리즈·태양 파편 효과 제거
- 새 장면은 배경 이미지와 인물만 직접 교체하고 짧은 진입 여백만 유지
- 기존 40개 장면, 420개 대사, 논쟁 3개·6라운드와 교사용 기능 유지

---

# v0.29 · Background Safe

- 시작화면 포스터를 음수 z-index CSS 배경 대신 실제 `img` 요소로 표시
- 장면 배경을 `::before` 가상 요소 대신 실제 `img` 요소로 표시
- 첫 화면과 SCENE 01에는 JavaScript 실행 전에도 보이는 기본 이미지를 지정
- 모든 장면 전환에서 실제 배경 이미지의 `src`, 초점, 맞춤 방식을 동기화
- 모바일 합성 레이어 및 CSS 우선순위 충돌로 배경이 숨는 문제를 구조적으로 제거
- 시작화면과 8개 배경 이미지를 Service Worker 핵심 캐시에 포함
- 캐시 버전을 v0.29로 갱신해 이전 CSS/JS가 섞이지 않도록 처리

---

# v0.28 · 자연스러운 몰입 보정

- 일반 장면에서 배경이 항상 유지되도록 무대의 강제 암전·축소·흐림을 제거했습니다.
- 장면 사이의 반복적인 검은 덮개와 블러 전환을 짧은 직접 전환으로 교체했습니다.
- 흰색 플래시, 화면 흔들림, 과도한 정지 효과, 거대 효과 문구를 제거했습니다.
- 자동 카메라 확대, 인물 호흡 확대, 대화 중 좌우 이동을 제거해 캐릭터가 안정적으로 서 있도록 했습니다.
- 첫 세 줄의 오프닝 연출만 유지하고 이후 독백·분위기 내레이션은 배경 위 하단 대화창에 표시합니다.
- 정체불명의 목소리 장면도 배경을 완전히 지우지 않고 어둡게 남기도록 수정했습니다.
- 문서·지도·특수 삽화·논쟁·마지막 암전처럼 이야기 이해에 필요한 연출은 유지했습니다.
- 기존 v0.27 저장 키를 유지해 학생 진행 기록이 이어집니다.

---

# v0.27 · CONTINUITY & IMMERSION PASS

v0.26 MICRO POLISH의 안정화와 기존 기능을 유지하면서, 장면과 장면 사이의 연결감과 몰입감을 마지막으로 다듬은 버전입니다.

## 주요 변경
- **소품 관련 대사 범위 정밀화**
  - 영국식 식사 소품은 음식 대화가 끝나는 지점까지만 유지합니다.
  - 베르사유 설계도, 전쟁 지도, 붉은 봉인 문서, 권리장전, 왕관, 세금 장부는 관련 대화 구간 동안 유지됩니다.
  - REALIZATION의 상비군 회상 구간에는 전쟁 지도가 이어서 표시됩니다.
  - 관련 구간 마지막 대사가 끝난 뒤 약 0.22초 여운을 두고 0.26초 동안 자연스럽게 퇴장합니다.
- **긴 대화 자동 구도 변화**
  - 2~3인 장면에서 대화가 길어지면 자동으로 wide → focus → tight → reset 흐름을 반복합니다.
  - 장면별 수동 좌표는 사용하지 않습니다.
- **장면 종료 여운 통일**
  - 일반 장면 마지막에는 약 0.24초, FINAL/REALIZATION/기억 장면에는 약 0.36초의 정적 뒤 전환됩니다.
- **나레이션 3단계화**
  - 짧은 행동: 기존 하단 행동 자막
  - 분위기·시간·장소 제시: 화면 중앙의 짧은 SCENE 나레이션
  - 역사 설명: 하단 정식 NARRATION 패널
- **핵심 대사 정적 문법 통일**
  - `짐은 태양이다!`, `짐이 곧 국가다!`, `그건 프랑스입니다.`, `그리고 영국은 왕도 처형했습니다.`, `국가는 왕 한 사람보다 큽니다.`, 마지막 거울 대사에 공통된 전후 정적을 적용했습니다.
- **기억 장면 복귀 연출**
  - 기억으로 들어갈 때와 현재로 돌아올 때 blur/grayscale 강도를 다르게 하여 방향을 구분합니다.
- **논쟁 종료 여운**
  - DEBATE CLEAR 뒤 스토리 복귀 직전 약 0.52초 동안 결과와 사용 완료 탄환 상태를 남깁니다.
- **FINAL 자동 압박 구도 강화**
  - 후반으로 갈수록 루이는 시각적으로 중심에서 밀리고 의원은 더 중심으로 들어옵니다.
  - `그건 프랑스입니다.` 이후 차이를 가장 강하게 보여 줍니다.
- **엔딩 여운 강화**
  - 마지막 암전 뒤 END 카드가 나오기 전 정적을 늘렸습니다.
  - 질문 세 문항은 일정한 간격으로 하나씩 등장한 뒤 모두 남습니다.
- **수업 환경 안정성 보강**
  - 화면 회전과 페이지 복귀 시 자동 레이아웃을 다시 계산합니다.
  - 낮은 높이의 가로 화면에서도 대사/화자명이 넘치지 않도록 안전 규칙을 추가했습니다.

## 유지한 사항
- 프롤로그 첫 3문장: 전체 문장 즉시 표시 → 자동 페이드 → 자동 진행, 터치 스킵 불가
- 전체 화면 터치 진행 / 시작 시 전체화면·가로화면 요청
- 프롱드 지속 이미지 / 앤 즉위 보고서 지속 표시
- 소품은 관련 대사 동안 계속 유지
- 표정 크로스페이드 / 화자 이름 전환 / 인물 호흡감
- 중앙 독백 / `???` 검은 화면 + 붉은 타이핑
- 논쟁 읽기 시간 / 정답 직접 노출 없는 오답 힌트
- FINAL 단계적 UI 소거
- 3개 논쟁 / 6개 논리탄환 / 스토리 데이터
- BGM/SFX 설정은 변경하지 않음

---

# v0.26 MICRO POLISH

- 화자가 바뀔 때 화자 이름표에 약 0.24초의 짧은 페이드/슬라이드 전환을 추가. 같은 화자가 연속으로 말할 때는 반복하지 않음.
- 일반 대사의 읽기 폭을 약 62ch, 긴 대사는 약 58ch로 제한해 긴 가로 화면에서 시선 이동을 줄임. 모바일 가로에서는 더 좁게 보정.
- 대사/독백 시작 시 말하는 인물이 약 1~2% 앞으로 나왔다가 기존 활성 포즈로 돌아오는 미세한 호흡 연출 추가.
- v0.25의 소품 지속 범위를 그대로 유지하면서, 관련 대사가 시작될 때 자연스럽게 등장하고 범위가 끝난 뒤 약 0.26초에 걸쳐 사라지도록 개선. 다른 소품으로 전환될 때도 짧게 페이드.
- ENGLISH MEMORY 장면에 공통된 가장자리 어둡힘과 약한 필름 입자 질감을 추가. 프롱드는 기존 따뜻한 금빛 기억 톤을 유지하고 동일한 라벨 위치/질감 규칙 적용.
- 논리탄환 선택 카드를 1.03배 강조. 정답은 짧은 hit-stop 뒤 ‘논파!’가 나타나며, 오답은 문장 흔들림을 제거하고 색 대비 + 짧은 진동으로만 피드백.
- FINAL 후반에는 인물 좌표를 장면별로 수동 조정하지 않고, 상태 기반으로 루이와 의원을 조금 더 중앙으로 모음. ‘그건 프랑스입니다.’ 이후 의원 비중을 키우고 루이를 시각적으로 후퇴시킴.
- ‘짐이 곧 국가다!’ 이후 FINAL UI 최소화를 한 단계 강화하되 메뉴 접근은 유지.
- 엔딩 질문을 3개로 정리하고 한 문항씩 순차 등장한 뒤 모두 화면에 남도록 변경.
- 마지막 거울 장면의 기존 0.7초 / 1.4초 정적 유지 및 중복 director cue 정리.
- 프롤로그 자동 나레이션, 전체화면 요청, 화면 전체 탭, 중앙 독백, ??? 검은 화면 붉은 타이핑, 프롱드 지속 이미지, 앤 즉위 보고서 지속, 관련 대사 동안 소품 지속, 논쟁 읽기 시간/오답 힌트 등 v0.25 기능은 그대로 유지.
- BGM/SFX 구성과 장면별 수동 인물 좌표는 변경하지 않음.

---

# v0.25 DETAIL PASS

- 표정 PNG 교체를 이전 포즈와 새 포즈가 겹쳐 사라지는 0.14초 크로스페이드로 개선.
- 새 장소/새 배경 진입 시 0.36~0.43초의 짧은 보기 시간을 추가해 배경과 인물을 먼저 인지할 수 있도록 조정.
- 짧은 행동 나레이션은 대사창을 차지하지 않고 하단 중앙의 자동 장면 자막으로 표시 후 자동 진행. 설명형 나레이션은 기존 방식 유지.
- ENGLISH MEMORY I/II/III의 색감·라벨·진입 문법을 통일하고 프롱드는 따뜻한 FRANCE MEMORY로 구분.
- 소품 지속 표시 시스템 추가. 관련 대사가 이어지는 동안 소품을 유지하고 주제가 바뀔 때만 제거.
  - 영국식 아침 식사: SCENE 08
  - 베르사유 설계도: SCENE 16~18 관련 구간
  - 유럽 전쟁 지도: SCENE 22~24
  - 붉은 봉인의 문서: SCENE 28
  - 권리장전: SCENE 30~34
  - 왕관/세금 장부/궁전 기억: SCENE 36~37 관련 구간
  - 앤 여왕 즉위 보고서: 기존처럼 SCENE 04 전체 유지
- 소품이 유지되는 동안 비화자를 약간 어둡게 해 시선이 소품과 화자에 모이도록 조정.
- 논쟁 라운드 시작 시 0.9초 동안 의원 문장만 먼저 보여주고 논리탄환이 이후 활성화되도록 변경.
- 오답은 정답을 직접 노출하지 않고 ‘이 탄환은 이 논점을 겨냥하지 않습니다.’ 중심으로 피드백. 두 번째 오답부터 모든 논점 후보를 약하게 강조.
- 반복 오답 시 정답 탄환을 직접 드러내던 rescue 표시 제거.
- FINAL에서 찰스 1세 언급 이후 진행바 숨김 → ‘짐이 곧 국가다!’ 이후 HUD 대부분 억제 → ‘그건 프랑스입니다.’ 이후 장소표시 약화.
- 두 인물 자동 배치를 40% / 60%로 조금 더 모아 긴 가로 화면의 시선 거리를 축소.
- 마지막 ‘태양도…’ 뒤 0.7초, 마지막 문장 뒤 1.4초 정적을 보장.
- BGM/SFX 구성과 장면별 수동 인물 좌표는 변경하지 않음.

---

# v0.24 · CINEMATIC POLISH

## 방향
v0.23의 안정화 구조를 유지하면서 새 기능보다 플레이 감각과 장면 연출을 다듬는 마감 버전입니다. 스토리의 40개 장면 순서와 line index는 유지했습니다.

## 적용 사항
- 화자 자동 포커스: 말하는 인물 이미지만 약하게 확대하고 비화자는 살짝 물러나 보이게 조정했습니다. 장면별 수동 좌표는 사용하지 않습니다.
- 핵심 대사 템포: “여기는 영국입니다.”, “짐은 태양이다!”, “국가는 왕 한 사람보다 큽니다.”, 마지막 거울 대사 등에 짧은 정적을 추가했습니다.
- 행동 나레이션: 타이핑을 기다리지 않고 문장 전체가 즉시 나타나도록 바꿔 대사와 장면 묘사의 리듬을 구분했습니다.
- 전환 문법 4종 통일: 일반 컷 / 시간 경과 / 기억 진입·이탈 / FINAL·REALIZATION·EPILOGUE 대전환으로 구분했습니다.
- 핵심 개념 카드: 관료제·상비군·왕권신수설 등 논리탄환과 직접 연결되는 개념을 읽고 닫으면 짧은 LOGIC NOTE 피드백을 표시합니다.
- 논쟁 차별화: DEBATE I 세금, DEBATE II 베르사유, DEBATE III 전쟁은 규칙은 같지만 배경 오버레이와 분위기를 다르게 처리했습니다.
- 기억 장면 통일: ENGLISH MEMORY 장면에 공통 프레임·비네트 규칙을 적용하고, 프롱드는 따뜻한 FRANCE MEMORY 표기로 구분했습니다.
- FINAL 압박감: 후반으로 갈수록 상단 HUD 채도를 단계적으로 낮춰 루이의 통제력이 약해지는 느낌을 강화했습니다.
- 논쟁 종료 후 복귀: 스토리 화면으로 돌아올 때 짧은 복귀 페이드를 추가했습니다.
- 엔딩: 마지막 대사 뒤 암전 정적을 확보하고 END → 핵심 질문 → 버튼 순으로 천천히 나타나게 했습니다.
- 전체화면, 프롤로그 자동 나레이션, 프롱드 지속 이미지, 앤 즉위 보고서 지속, 화면 전체 탭 진행, 독백 중앙, ??? 검은 화면/붉은 타이핑 등 v0.23 기능은 유지했습니다.

## 버전/캐시
- APP_VERSION: v0.24
- storage: sun-king-queen-v0.24 (v0.23 이하 상태 자동 마이그레이션)
- service worker cache: sun-king-queen-v0.24-20260912

## 제외
- BGM/SFX 파일 추가 없음
- 장면별 수동 인물 좌표 조정 없음

---

# v0.23 재검수 안정화

## 핵심 수정
- v0.22의 외부 `playerFlowPatch.js`를 제거하고 흐름 기능을 `app.js` 본체에 통합했습니다.
- 시작 버튼이 멈추던 문제를 제거했습니다. 전체화면 요청은 스토리 시작 후 비동기적으로 실행되어 실패해도 진행을 막지 않습니다.
- 프롤로그 SCENE 01의 첫 3개 나레이션은 타이핑 없이 완성 문장 전체가 나타나고 자동 페이드 후 다음 문장으로 진행됩니다. 이 구간은 터치로 건너뛸 수 없습니다.
- 시작 직후 베르사유 배경이 정상적으로 적용되는지 런타임 검증했습니다.
- 프롱드 회상은 SCENE 02 종료까지 유지되고, 앤 즉위 보고서는 SCENE 04 전체에서 유지됩니다.
- 인물 머리 상단 크롭을 제거하고 기존 자동 portrait layout의 안전 여백을 유지합니다.
- 일반 화면 터치로 대사를 넘길 수 있으며 버튼/팝업/특수 UI는 제외합니다.
- 독백 중앙 표시와 ??? 검은 화면/붉은 글자 연출을 유지합니다.
- v0.23 서비스워커 캐시로 갱신했습니다.

## 검증
- 모든 JS `node --check` 통과
- 실제 브라우저 DOM 런타임에서 시작 버튼 → SCENE 01 진입 확인
- 첫 프롤로그 자동 나레이션 3개 → 관료제 카드 진행 확인
- SCENE 02 프롱드 지속 이미지/SCENE 04 앤 문서 유지 확인
- 주요 캐릭터 자동 배치 상단 좌표가 음수가 되지 않음을 확인

---

# v0.22 Corrective Patch

이 패치는 **현재 GitHub 배포본을 기준으로 덮어쓰는 수정 패치**입니다. v0.21 전체 통합 ZIP은 사용하지 않습니다.

## 왜 다시 만들었나
- v0.21 전체 통합본을 점검한 결과 `css/style.css`가 v0.10과 바이트 단위로 동일했고, `js/app.js` 역시 v0.10을 바탕으로 버전/인물배치 일부만 덧댄 상태였습니다.
- 따라서 실제 저장소에서 v0.11~v0.16 동안 들어간 UI/연출/안정화 코드가 통합본에서 되돌아갔습니다.
- 현재 GitHub 배포본 자체도 `index.html`은 v0.20, `playerFlowPatch.js`/service worker는 v0.21로 혼재되어 있어 표시 버전이 일치하지 않았습니다.

## v0.22 수정
- 기존 `app.js`, `style.css`, 스토리/논쟁 데이터는 **현재 저장소 것을 그대로 유지**합니다.
- 새 `playerFlowFix.css`를 가장 마지막에 읽어 전역 플레이 화면만 보정합니다.
- 프롤로그 첫 3개 나레이션: 타이핑 없음 / 전체 문장 즉시 표시 / 자동 페이드 / 터치 스킵 차단.
- 프롱드 기억: SCENE 02 종료 전까지 유지, 대사창 위 가용 영역에 전체 이미지 `contain`.
- 앤 즉위 보고서: SCENE 04 전체 유지.
- 일반 나레이션에서 `장면/나레이션`이 화자명처럼 보이지 않도록 정리.
- 독백 중앙 표시.
- ???: 완전 검은 화면 + 중앙 붉은 타이핑.
- 인물 자동배치의 상단 안전여백 확대, 모든 인물/논쟁 이미지 `clip-path` 제거.
- 2인/3인 장면 인물 간격을 중앙으로 모음.
- 일반 장면 전환은 짧은 암전, FINAL/REALIZATION/EPILOGUE만 강한 전환.
- 대사창 외 배경/인물 터치로 진행 가능.
- 시작/이어하기 시 전체화면 및 가로모드 요청.
- 캐시 키 v0.22 갱신.

## 적용 파일
- `index.html`
- `css/playerFlowFix.css` (신규)
- `js/playerFlowPatch.js`
- `sw.js`

> 기존 `app.js`와 `css/style.css`를 v0.21 통합본 파일로 덮어쓰지 마세요.

---

# v0.21 전체 웹앱 피드백 통합본

이번 버전은 부분 패치가 아니라 배포 가능한 전체 웹앱 패키지입니다.

- 프롤로그 첫 3개 나레이션: 타이핑 제거, 완성 문장 즉시 표시 → 자동 유지 → 자동 페이드 → 자동 진행. 터치 스킵 불가.
- 일반 나레이션/행동 나레이션 UI를 전체 장면에서 정리. 행동 묘사는 화자 이름표 없이 중앙 장면 설명으로 표시.
- 일반 장면 전환은 짧은 암전 컷으로 단순화. 꿈 진입/이탈·몸 교환·귀환은 장면 자체 연출과 충돌하지 않게 더 약한 브리지 컷으로 처리.
- FINAL 진입과 REALIZATION 진입은 주요 전환으로 유지.
- 캐릭터 자동 레이아웃을 전체 40개 장면에 적용. 머리 상단 안전 여백을 확보하고 clip-path 크롭 제거.
- 2인/3인 장면에서 인물이 양 끝으로 벌어지지 않도록 중앙 쪽으로 그룹화.
- 프롱드 기억은 SCENE 02 종료까지 유지하고 이미지 전체를 contain으로 표시.
- 앤 여왕 즉위 보고서는 SCENE 04 종료까지 유지.
- 배경/인물 영역을 눌러도 대사 진행 가능. 버튼·팝업·특수컷은 오작동 방지.
- 독백은 화면 중앙, ???는 검은 화면 중앙 붉은 타이핑 유지.
- 이야기 시작/이어하기 시 전체화면 및 가로 방향 진입을 가능한 범위에서 즉시 요청.
- 초광폭 스마트폰에서는 중앙 무대를 더 좁혀 좌우 검은 여백을 두어 한눈에 읽기 쉽게 조정.
- BGM/SFX는 변경하지 않음.
- 장면별 수동 인물 좌표 조정은 사용하지 않음.

---

# v0.10 · Finish / Classroom Stability Pass

- BGM/SFX 자산은 수정하지 않음.
- 전용 이미지가 없던 시녀·프랑스 장군·???를 의도된 실루엣 캐스트로 복원.
- 캐릭터가 해당 장면에서 실제로 소개되는 시점에 부드럽게 등장하도록 actor entrance 처리.
- v0.9에서 숨겨진 direction에서 승격한 나레이션을 `SCENE` 행동 묘사로 별도 스타일링. 역사 설명 `NARRATION`과 시각적 무게를 분리.
- 논쟁 정답 결과에 `논리탄환 → 반박 논점` 연결 스트립 추가. 기존 반박문은 그대로 유지.
- FINAL 역논파 이후 장소/HUD가 거의 사라지도록 UI 소거 연출 강화. REALIZATION 진입 시 자동 복구.
- 저장 상태 복구 시 scene/line/debate 범위를 검증하고, 조준 중이던 탄환은 안전하게 해제하여 중간상태 오류 방지.
- 이미지 로딩 실패 시 1회 지연 재시도 후 기존 fallback으로 내려가도록 안정화.
- 캐릭터/문서 WebP를 스마트폰 표시 크기에 맞게 재압축하여 배포 용량 감소.
- 스토리 문구/순서/논쟁 데이터는 변경하지 않음.

- SCENE 22의 빈 무대 정의 `S([])`를 `S()`로 수정하여 undefined 배우 항목 제거.
- 웹용 이미지 자산 합계: 약 45MB → 약 9.3MB. 원본 제작 파일이 아니라 배포용 사본만 최적화.

---

# v0.9 · Story Continuity Polish

- 숨겨진 연출문 중 학생이 알아야 대사와 행동이 자연스럽게 이어지는 항목을 화면 나레이션으로 승격.
- SCENE 06 몸 바뀜 직후의 옷자락/목소리/거울/볼 꼬집기 행동을 짧은 나레이션으로 연결.
- SCENE 07, 08, 13, 18, 19, 25~30, 35~40의 장면 연결 행동을 보강.
- SCENE 29에서 평소의 “의회를 소집하라” 습관이 나오려다 로버트에게 끊기는 역전 흐름을 명확히 표시.
- SCENE 31 과거 루이 플래시백 중복 호출 제거.
- SCENE 32 찰스 1세 회상 반복을 줄이고 루이의 충격 반응을 나레이션으로 연결.
- SCENE 05를 밤의 베르사유 배경, SCENE 19를 꿈속 의회 배경, SCENE 27을 꿈속 왕궁 배경으로 수정.
- “전쟁이 기운” → “전쟁의 기운”, 로버트 조사 오류 등 표시 문장 교정.
- “영국의 왕관은 법과 의회 위에”를 “법과 의회의 틀 안에”로 정리하여 문맥상 의미를 명확히 함.
- 장면/대사/논쟁 순서는 유지. BGM/SFX 자산은 수정하지 않음.

---

# CHANGELOG v0.8

## UI / 색감
- 타이틀 포스터 중심 미니멀 UI
- 학생 HUD 미니멀화
- 국가/기억별 제한 팔레트 적용
- 배경 오버레이 약화
- 역사 드라마형 대사창
- 논리탄환 카드 비주얼 개선
- FINAL 역전 이후 탈금색 처리

## UX
- 표정 이미지 크로스페이드
- 170ms 연속 터치 가드

## 유지
- storyData.js 변경 없음
- audioMap.js 변경 없음
- 수동 이미지 위치/크기 조정 없음

---

# v0.7 · Final Cinematic / UX Polish

배경음·효과음 자산은 추가하지 않고 화면 연출과 조작감만 다듬은 버전입니다.

- 국가/기억/FINAL/REALIZATION별 장면 전환 문법 추가
- DREAM III, REALIZATION, 마지막 거울 특수컷을 최소 감상 시간 후 터치 진행 방식으로 변경
- 핵심 대사 타자기 속도를 느리게, 긴 대사는 조금 빠르게 조정
- 대사창에 화자 진영 색/긴 문장/핵심 대사 상태 적용
- FINAL 30~34 장면의 압박감을 단계적으로 강화
- 실제 태양왕 문양을 2개 조각 레이어로 분리해 역논파 순간 균열/이탈 연출 강화
- 세금/궁전/전쟁 논쟁에 서로 다른 시각 톤 적용
- 정답/오답 때 양측 캐릭터 반응 차별화
- 모든 특수컷을 매 장면 선로딩하던 방식을 제거하고 현재+다음 2개 장면 자산만 준비하도록 변경
- 런던 마차 장면에 항구 배경을 잘못 재사용하던 부분을 제거하고 분위기형 rain 배경으로 처리
- 베르사유 밤 장면의 영국풍 어두운 왕좌 배경 오사용을 제거
- 스토리 텍스트는 변경하지 않음

---

# v0.6 변경사항

- `storyData.js` 수정 없음
- 실제 배경 표시 버그 수정
- 유럽 지도 / 세금 장부 / 왕관 복구
- persistent pose acting
- 논쟁 화면 actual character art
- shot trail / hit-stop / miss bounce
- S02~S06 주요 특수컷 연결
- real sun emblem FINAL effect
- per-scene background framing
- runtime WebP 최적화

---

v0.5 integrated asset build
- images connected
- title/end art applied
- charles flash special overlay connected

---

# CHANGELOG v0.4

## Asset-ready 구조
- actor image variant 구조
- prop/document overlay renderer
- actor/document preload + fallback
- SCENE 31 / CHARLES flashback overlay

## Audio-ready 구조
- audioMap.js 추가
- BGM 2채널 crossfade manager 골격
- SFX hook 준비

## Debate UX
- 첫 논쟁 튜토리얼
- 단계형 힌트(2/3/4~5/6+ 실패)
- MISS 이유 구분
- 선택 탄환 장전 표시
- FINAL bullet LOCK intro

## Teacher / Stability
- FAST QA
- 튜토리얼 다시 보기
- 현재 위치 복사
- visibility/pagehide 저장
- v0.4 cache refresh

## Story
- 최종 storyData.js 문구/순서 자체는 변경하지 않음.

---

# v0.3 변경 내역

## 논쟁
- 한 문장에 2~3개의 후보 논점을 추가했습니다.
- 정답 판정은 `선택 탄환 === answer` AND `선택 논점 === answerTarget`입니다.
- 정답 약점이 처음부터 드러나지 않도록 모든 후보를 동일한 시각 언어로 표시합니다.
- TAX → PALACE → WAR 순으로 이동 속도를 조절했습니다.
- 두 라운드 완료 후 저장 가능한 `clear` phase와 DEBATE CLEAR 화면을 추가했습니다.

## 연출 구조
- `directorMap.js`: 대사별 focus / camera / pose / beatBefore / beatAfter
- `visualMap.js`: 반복되는 시각효과와 MEMORY/FINAL 시각 상태
- `assetMap.js`: 향후 캐릭터/배경/문서 경로 연결
- 핵심 명대사에 정적과 클로즈업 타이밍을 추가했습니다.

## 수업 운영
- history 최대 500개
- 실제 읽기 단위 기반 progress
- 교사용 jump를 학생 저장과 분리한 preview mode로 변경
- preview 종료 버튼 및 고정 배지 추가
- 교사용 debug 상태와 cache refresh 추가

## 배포
- Service Worker 캐시 키를 v0.3으로 변경
- HTML/JS/CSS network-first
- 정적 이미지/BGM 등은 cache-first
- 이전 sun-king-queen 캐시 자동 정리

## 미적용
- 최종 이미지/BGM/SFX
