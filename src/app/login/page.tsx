import { redirect } from 'next/navigation';

import { auth, signIn } from '@/auth';

/**
 * @component
 * @description Google OAuth 로그인 페이지
 * 이미 로그인된 경우 메인 페이지로 리다이렉트
 */
export default async function LoginPage() {
  const session = await auth();

  if (session) redirect('/');

  async function handleSignIn() {
    'use server';
    await signIn('google', { redirectTo: '/' });
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-50">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-2xl bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Dotted
          </h1>
          <p className="text-sm text-zinc-500">한국 공간의 디지털트윈 플랫폼</p>
        </div>

        <form action={handleSignIn} className="w-full">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <GoogleIcon />
            Google로 계속하기
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400">
          로그인하면 지도 뷰어를 이용할 수 있습니다.
          <br />
          업로드는 관리자만 가능합니다.
        </p>
      </div>
    </div>
  );
}

/**
 * @component
 * @description Google 브랜드 아이콘 SVG 컴포넌트
 */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"
      />
      <path
        fill="#34A853"
        d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"
      />
      <path
        fill="#FBBC05"
        d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"
      />
      <path
        fill="#EA4335"
        d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"
      />
    </svg>
  );
}
