# 개발 노트 — 결정 사항 및 개선 후보

## 컨셉 변경 이력

### 지도 기반 → 포인트클라우드 우선으로 전환 (2026-06-23)

초기 컨셉은 지도 기반 디지털트윈이었으나, 아래 이유로 변경.

- GPS 없는 사진(실내 등)도 동등하게 처리하고 싶음
- "사진 올리면 3D됨"이 더 직관적이고 포트폴리오 임팩트 큼
- 지도 연동은 Phase 3에서 선택적으로 추가 예정

## Auth

### Google OAuth 계정 선택 화면 강제 표시

현재 브라우저에 Google 세션이 남아있으면 계정 선택 없이 바로 로그인됨.
다중 계정 사용자를 위해 항상 계정 선택 화면을 띄우고 싶다면 아래 옵션 추가.

```typescript
// src/components/ui/Header.tsx — handleSignIn
await signIn('google', { redirectTo: '/', prompt: 'select_account' });
```
