'use client';

import { useState } from 'react';

import { uploadPhoto } from '@/app/actions/uploadPhoto';

import UploadPreview from './UploadPreview';
import UploadZone from './UploadZone';

import type { GpsPoint } from '@/lib/exif';

interface ParsedState {
  withGps: { point: GpsPoint; file: File }[];
  withoutGps: File[];
}

// 업로드 진행 상태
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

/**
 * @component
 * @description 업로드 흐름 전체를 관리하는 클라이언트 컨테이너
 * 파싱 → 공간 유형 선택 → 저장까지 상태 관리
 */
export default function UploadContainer() {
  // GPS 포함/미포함 파싱 결과
  const [parsed, setParsed] = useState<ParsedState | null>(null);
  // 현실/가상 공간 유형 선택
  const [spaceType, setSpaceType] = useState<'real' | 'virtual'>('real');
  // 업로드 진행 상태
  const [status, setStatus] = useState<UploadStatus>('idle');
  // 업로드 완료 카운트
  const [doneCount, setDoneCount] = useState(0);

  function handleParsed(result: ParsedState) {
    setParsed(result);
    setStatus('idle');
    setDoneCount(0);
  }

  function handleSpaceTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSpaceType(e.target.value as 'real' | 'virtual');
  }

  async function handleSave() {
    if (!parsed) return;

    setStatus('uploading');
    setDoneCount(0);

    const allFiles: { file: File; gpsPoint: GpsPoint | null }[] = [
      ...parsed.withGps.map(({ file, point }) => ({ file, gpsPoint: point })),
      ...parsed.withoutGps.map((file) => ({ file, gpsPoint: null })),
    ];

    let successCount = 0;

    for (const { file, gpsPoint } of allFiles) {
      try {
        const fileData = await fileToBase64(file);
        const result = await uploadPhoto({
          fileName: file.name,
          fileType: file.type,
          fileData,
          gpsPoint,
          spaceType,
        });

        if (result.success) {
          successCount++;
          setDoneCount(successCount);
        }
      } catch (error: unknown) {
        console.error(`${file.name} 업로드 실패:`, error);
      }
    }

    setStatus(successCount === allFiles.length ? 'done' : 'error');
  }

  const totalCount = parsed
    ? parsed.withGps.length + parsed.withoutGps.length
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <UploadZone onParsed={handleParsed} />

      {parsed && (
        <>
          <UploadPreview
            withGps={parsed.withGps}
            withoutGps={parsed.withoutGps}
          />

          {/* 공간 유형 선택 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-700">공간 유형</p>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
                <input
                  type="radio"
                  name="spaceType"
                  value="real"
                  checked={spaceType === 'real'}
                  onChange={handleSpaceTypeChange}
                />
                현실 공간 (여행, 실내 등)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
                <input
                  type="radio"
                  name="spaceType"
                  value="virtual"
                  checked={spaceType === 'virtual'}
                  onChange={handleSpaceTypeChange}
                />
                가상 공간 (게임 스크린샷 등)
              </label>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={status === 'uploading'}
              className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {status === 'uploading'
                ? `저장 중... (${doneCount}/${totalCount})`
                : `${totalCount}장 저장`}
            </button>
            {status === 'done' && (
              <p className="text-sm text-green-600">{doneCount}장 저장 완료!</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-500">
                일부 파일 저장에 실패했습니다.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * @function
 * @description File 객체를 base64 문자열로 변환
 * @param file - 변환할 File 객체
 * @returns base64 인코딩된 문자열
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
