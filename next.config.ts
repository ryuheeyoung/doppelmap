import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // 사진 업로드를 위해 Server Action body 크기 제한 확장 (기본 1MB → 20MB)
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
