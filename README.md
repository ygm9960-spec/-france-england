# 태양왕이 여왕이 되었다 v0.32 · LAYOUT & OPENING FADE

현재 배포 기준은 **v0.32**입니다. 사용자가 수정한 v0.31을 그대로 기준으로 삼아 인물 자동 배치를 다시 정렬했습니다. 2인·3인 장면은 서로 겹치지 않도록 간격을 재조정했고, 실루엣 인물도 같은 자동 배치 계산에 포함됩니다. 독백과 첫 루이 단독 발언은 실제 1인 구도로 다시 계산되어 화면 중앙에 배치됩니다. 시작의 세 나레이션은 검은 화면에서 문장이 서서히 나타났다가 서서히 사라집니다.

## 배포
이 폴더의 내용을 GitHub Pages 저장소 루트에 그대로 업로드/덮어쓰기합니다.

주요 파일:
- `index.html`
- `css/style.css`
- `css/presentation.css`
- `css/playerFlowFix.css`
- `js/app.js`
- `js/storyData.js`
- `js/debateData.js`
- `js/stageMap.js`
- `js/assetMap.js`
- `js/audioMap.js`
- `js/visualMap.js`
- `js/directorMap.js`
- `js/portraitLayout.js`
- `sw.js`
- `images/`

자세한 변경사항은 `CHANGELOG_v0.32.md`를 참고하세요.

## v0.49 Soundtrack

`audio/` 폴더의 사용자 제공 OST 8곡을 실제 게임 흐름에 연결했습니다.
브라우저 자동재생 정책 때문에 첫 사용자 터치 이후 음악이 시작됩니다. 메인 화면에서 시작 버튼을 누르면 `Le Roi Soleil`이 바로 시작되고 프랑스 장면까지 끊기지 않고 이어집니다.

- 01 `Le Roi Soleil` — 메인 화면 / 프랑스
- 02 `The Crown Has Rules` — 영국 / 최종 의회
- 03 `A Crown in a Dream` — 꿈
- 04 `Words Against the Crown` — 디베이트
- 05 `Not the King Alone` — 깨달음 / 엔딩
- 06 `The Sun King Explodes` — SCENE 33
- 07 `The Passage of Crowns` — 주요 장소·시간·챕터 전환 스팅어
- 08 `Fronde · A King Remembers` — 프롱드 회상

음악은 약 1초 크로스페이드되며, 전환 스팅어가 재생될 때 기존 BGM은 자동으로 낮아집니다. 메인 화면 및 게임 메뉴에서 BGM을 켜고 끌 수 있습니다.


## v0.49 점검 및 오류 수정
- 플래시백 상태 변수 선언 및 과거 루이 사진·대사창 동시 표시 보정.
- 음악 전환 볼륨 범위 오류, 중복 음량 페이드 및 전환곡 조기 중단 보정.
- 귀환 빛 연출을 검은 전환보다 앞에 표시해 전체 과정이 보이도록 변경.
- 화면 버전을 v0.32로 덮어쓰던 이전 스크립트 수정.
- QA 점검 스크립트 실행 오류 수정.
