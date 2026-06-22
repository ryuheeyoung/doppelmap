import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      // 관리자 여부 (업로드 권한 제어용)
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
}
