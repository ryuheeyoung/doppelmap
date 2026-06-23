import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import Header from '@/components/ui/Header';

import UploadContainer from './_components/UploadContainer';

/**
 * @component
 * @description 사진 업로드 페이지 — 관리자 전용
 * 비관리자 접근 시 메인 페이지로 리다이렉트
 */
export default async function UploadPage() {
  const session = await auth();

  if (!session?.user?.isAdmin) redirect('/');

  return (
    <div className="flex min-h-full flex-col">
      <Header session={session} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-zinc-900">사진 업로드</h1>
            <p className="text-sm text-zinc-500">
              GPS 정보가 포함된 사진을 업로드하면 지도에 자동으로 표시됩니다.
            </p>
          </div>
          <UploadContainer />
        </div>
      </main>
    </div>
  );
}
