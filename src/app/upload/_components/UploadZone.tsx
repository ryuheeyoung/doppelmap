'use client';

import { useCallback, useState } from 'react';

import exifr from 'exifr';

import { extractGpsFromExif, isValidCoordinate } from '@/lib/exif';

import type { GpsPoint } from '@/lib/exif';

interface ParseResult {
  // GPS 있는 사진 (지도 마커용)
  withGps: { point: GpsPoint; file: File }[];
  // GPS 없는 사진 (실내 포인트클라우드용)
  withoutGps: File[];
}

interface Props {
  onParsed: (result: ParseResult) => void;
}

/**
 * @component
 * @description 사진 드래그앤드롭 업로드 존 — EXIF GPS 파싱 후 상위 컴포넌트에 전달
 * @param props.onParsed - 파싱 완료 시 GPS 포인트 배열과 파일 배열을 전달하는 콜백
 */
export default function UploadZone({ onParsed }: Props) {
  // 드래그 오버 상태 (스타일 전환용)
  const [isDragging, setIsDragging] = useState(false);
  // 파싱 진행 중 여부
  const [isParsing, setIsParsing] = useState(false);

  async function parseFiles(files: File[]) {
    setIsParsing(true);

    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    const withGps: { point: GpsPoint; file: File }[] = [];
    const withoutGps: File[] = [];

    await Promise.all(
      imageFiles.map(async (file) => {
        try {
          const exifData = await exifr.parse(file, {
            pick: ['latitude', 'longitude', 'DateTimeOriginal'],
          });

          const point = exifData ? extractGpsFromExif(exifData) : null;

          if (point && isValidCoordinate(point.lat, point.lng)) {
            withGps.push({ point, file });
          } else {
            withoutGps.push(file);
          }
        } catch {
          // EXIF 파싱 실패한 파일은 GPS 없음으로 처리
          withoutGps.push(file);
        }
      }),
    );

    setIsParsing(false);
    onParsed({ withGps, withoutGps });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    await parseFiles(Array.from(e.dataTransfer.files));
  }

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      await parseFiles(Array.from(e.target.files));
    },
    [],
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 transition-colors ${
        isDragging
          ? 'border-zinc-900 bg-zinc-50'
          : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
    >
      {isParsing ? (
        <p className="text-sm text-zinc-500">GPS 정보 파싱 중...</p>
      ) : (
        <>
          <p className="text-sm font-medium text-zinc-700">
            사진을 드래그하거나 클릭해서 업로드
          </p>
          <p className="text-xs text-zinc-400">GPS 정보가 포함된 JPG, HEIC</p>
          <label className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
            파일 선택
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </>
      )}
    </div>
  );
}
