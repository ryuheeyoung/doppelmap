'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

import type { Session } from 'next-auth';

interface Props {
  children: React.ReactNode;
  session: Session | null;
}

/**
 * @component
 * @description Auth.js 세션을 클라이언트 컴포넌트 트리에 제공하는 Provider 래퍼
 * @param props.children - 하위 컴포넌트 트리
 * @param props.session - 서버에서 전달받은 초기 세션 데이터
 */
export default function SessionProvider({ children, session }: Props) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
