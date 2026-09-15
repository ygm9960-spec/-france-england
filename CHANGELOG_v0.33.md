# v0.33 Mobile Landscape / Fullscreen Fix

- 모바일 실제 visual viewport 높이를 `--app-h`에 반영하고 모든 화면 컨테이너가 그 값을 사용하도록 수정.
- 시작 화면, 스토리 HUD, 메뉴에 명시적인 전체화면 전환 기능 추가.
- 첫 사용자 입력(pointerdown)에서 전체화면 요청을 먼저 보내 모바일 브라우저의 사용자 제스처 제한에 대응.
- Fullscreen API가 제한된 브라우저에서는 안내 메시지와 레이아웃 fallback 제공.
- 스마트폰 가로 화면(max-height 600px)에서는 16:9 배경 원본이 잘리지 않도록 `object-fit: contain` 강제.
- title poster도 모바일 가로에서 전체 이미지가 보이도록 contain 처리.
- safe-area(노치/카메라 홀/둥근 모서리) 여백 보강.
- service worker cache를 v0.33으로 갱신해 기존 v0.32 CSS/JS 캐시가 남지 않도록 수정.
