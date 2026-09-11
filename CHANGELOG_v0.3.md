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
