import { auth } from '@/auth';
import Header from '@/components/ui/Header';

/**
 * @component
 * @description 메인 페이지 — 지도 뷰어 진입점 (누구나 접근 가능)
 */
export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-col">
      <Header session={session} />
      <main className="flex flex-1 items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-400">지도 뷰어 준비 중</p>
      </main>
    </div>
  );
}
