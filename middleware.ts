import { NextResponse } from 'next/server';

import { auth } from './auth';

export default auth((req) => {
  const isUploadRoute = req.nextUrl.pathname.startsWith('/upload');

  // 업로드 라우트는 로그인 + 관리자만 접근 가능
  if (isUploadRoute) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (!req.auth.user?.isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  // 정적 파일, API 인증 라우트는 미들웨어 제외
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
