'use client';

import { formatDateTime } from '@/lib/dateUtils';

import type { GpsPoint } from '@/lib/exif';

interface Props {
  withGps: { point: GpsPoint; file: File }[];
  withoutGps: File[];
}

/**
 * @component
 * @description 파싱 결과 미리보기 — GPS 포함/미포함 사진 분리 표시
 * @param props.withGps - GPS 좌표가 있는 사진 목록
 * @param props.withoutGps - GPS 정보가 없는 사진 목록 (실내 포인트클라우드용)
 */
export default function UploadPreview({ withGps, withoutGps }: Props) {
  const total = withGps.length + withoutGps.length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-zinc-500">
        총 {total}장 — GPS 있음 {withGps.length}장 / GPS 없음{' '}
        {withoutGps.length}장
      </p>

      {withGps.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-700">
            📍 지도 마커로 표시될 사진
          </p>
          <ul className="flex flex-col gap-2">
            {withGps.map(({ point, file }, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-zinc-700">
                    {file.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">
                  {point.timestamp
                    ? formatDateTime(point.timestamp)
                    : '시간 정보 없음'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {withoutGps.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-700">
            🏠 실내 포인트클라우드용 사진 (GPS 없음)
          </p>
          <ul className="flex flex-col gap-2">
            {withoutGps.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white px-4 py-3"
              >
                <span className="text-xs font-medium text-zinc-700">
                  {file.name}
                </span>
                <span className="text-xs text-zinc-400">위치 정보 없음</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
