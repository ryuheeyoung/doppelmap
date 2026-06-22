import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// 업로드 권한을 가진 관리자 이메일 목록
const ADMIN_EMAILS = ['rhy901008@gmail.com'];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * @function
     * @description 세션에 사용자 역할(role) 및 관리자 여부 주입
     * @param session - 현재 세션 객체
     * @param token - JWT 토큰
     * @returns 역할 정보가 포함된 세션 객체
     */
    session({ session }) {
      if (session.user) {
        session.user.isAdmin = ADMIN_EMAILS.includes(session.user.email ?? '');
      }
      return session;
    },
    /**
     * @function
     * @description JWT 토큰에 관리자 여부 주입
     * @param token - JWT 토큰
     * @param user - 로그인한 사용자 정보
     * @returns 관리자 여부가 포함된 토큰
     */
    jwt({ token, user }) {
      if (user) {
        token.isAdmin = ADMIN_EMAILS.includes(user.email ?? '');
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
});
