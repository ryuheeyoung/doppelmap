import { Geist, Geist_Mono } from 'next/font/google';

import { auth } from '@/auth';
import SessionProvider from '@/components/providers/SessionProvider';

import type { Metadata } from 'next';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Doppelmap',
  description: '한국 공간의 커뮤니티 포인트클라우드 디지털트윈 뷰어',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 세션 조회 후 클라이언트 Provider에 전달
  const session = await auth();

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
