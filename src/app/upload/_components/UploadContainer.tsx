'use client';

import { useState } from 'react';

import UploadPreview from './UploadPreview';
import UploadZone from './UploadZone';

import type { GpsPoint } from '@/lib/exif';

interface ParsedState {
  withGps: { point: GpsPoint; file: File }[];
  withoutGps: File[];
}

/**
 * @component
 * @description 업로드 흐름 전체를 관리하는 클라이언트 컨테이너
 * GPS 있는 사진(지도 마커)과 없는 사진(실내 포인트클라우드) 분리 관리
 */
export default function UploadContainer() {
  // GPS 포함/미포함 파싱 결과
  const [parsed, setParsed] = useState<ParsedState | null>(null);

  function handleParsed(result: ParsedState) {
    setParsed(result);
  }

  return (
    <div className="flex flex-col gap-6">
      <UploadZone onParsed={handleParsed} />
      {parsed && (
        <UploadPreview
          withGps={parsed.withGps}
          withoutGps={parsed.withoutGps}
        />
      )}
    </div>
  );
}
