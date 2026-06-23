import Link from 'next/link';

import { signIn, signOut } from '@/auth';

import type { Session } from 'next-auth';

interface Props {
  session: Session | null;
}

/**
 * @component
 * @description 전역 헤더 — 로고, 세션 상태에 따라 로그인/로그아웃 버튼 표시
 * @param props.session - 현재 로그인 세션 (null이면 비로그인 상태)
 */
export default function Header({ session }: Props) {
  async function handleSignIn() {
    'use server';
    await signIn('google', { redirectTo: '/' });
  }

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-zinc-900"
        >
          Dotted
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm text-zinc-500">
                {session.user.email}
              </span>
              {session.user.isAdmin && (
                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
                  관리자
                </span>
              )}
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="text-sm text-zinc-400 transition-colors hover:text-zinc-700"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <form action={handleSignIn}>
              <button
                type="submit"
                className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
              >
                로그인
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
