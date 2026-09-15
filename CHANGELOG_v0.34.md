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
