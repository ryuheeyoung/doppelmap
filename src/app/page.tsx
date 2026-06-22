import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import Header from '@/components/ui/Header';

/**
 * @component
 * @description 메인 페이지 — 로그인 필요, 지도 뷰어 진입점
 * 비로그인 사용자는 /login으로 리다이렉트
 */
export default async function HomePage() {
  const session = await auth();

  if (!session) redirect('/login');

  return (
    <div className="flex min-h-full flex-col">
      <Header session={session} />
      <main className="flex flex-1 items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-400">지도 뷰어 준비 중</p>
      </main>
    </div>
  );
}
