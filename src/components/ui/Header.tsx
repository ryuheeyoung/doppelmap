import { signOut } from '@/auth';

import type { Session } from 'next-auth';

interface Props {
  session: Session | null;
}

/**
 * @component
 * @description 전역 헤더 — 로고, 네비게이션, 사용자 세션 정보 표시
 * @param props.session - 현재 로그인 세션 (null이면 비로그인 상태)
 */
export default function Header({ session }: Props) {
  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <span className="text-base font-bold tracking-tight text-zinc-900">
          Doppelmap
        </span>

        {session?.user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">{session.user.email}</span>
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
          </div>
        )}
      </div>
    </header>
  );
}
