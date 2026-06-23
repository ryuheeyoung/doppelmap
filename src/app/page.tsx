import { auth } from '@/auth';
import MapView from '@/components/map/MapView';
import Header from '@/components/ui/Header';

/**
 * @component
 * @description 메인 페이지 — 지도 뷰어 진입점 (누구나 접근 가능)
 */
export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex h-screen flex-col">
      <Header session={session} />
      <main className="flex-1">
        <MapView />
      </main>
    </div>
  );
}
