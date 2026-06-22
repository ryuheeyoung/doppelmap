export { auth as middleware } from './auth';

export const config = {
  // 정적 파일, API 인증 라우트, 로그인 페이지는 미들웨어 제외
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)'],
};
