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
