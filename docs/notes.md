# 개발 노트 — 결정 사항 및 개선 후보

## Auth

### Google OAuth 계정 선택 화면 강제 표시

현재 브라우저에 Google 세션이 남아있으면 계정 선택 없이 바로 로그인됨.
다중 계정 사용자를 위해 항상 계정 선택 화면을 띄우고 싶다면 아래 옵션 추가.

```typescript
// src/components/ui/Header.tsx — handleSignIn
await signIn('google', { redirectTo: '/', prompt: 'select_account' });
```
