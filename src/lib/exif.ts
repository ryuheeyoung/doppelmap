// exifr 라이브러리가 반환하는 EXIF 데이터 중 GPS 관련 필드
interface ExifData {
  latitude?: number;
  longitude?: number;
  DateTimeOriginal?: Date;
  [key: string]: unknown;
}

// 파싱된 GPS 포인트 데이터
export interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: string | null;
}

/**
 * @function
 * @description exifr로 파싱한 EXIF 데이터에서 GPS 좌표와 타임스탬프 추출
 * @param exifData - exifr.parse() 반환값
 * @returns GPS 좌표와 타임스탬프, GPS 정보 없으면 null
 */
export function extractGpsFromExif(exifData: ExifData): GpsPoint | null {
  const { latitude, longitude, DateTimeOriginal } = exifData;

  if (latitude === undefined || longitude === undefined) return null;

  return {
    lat: latitude,
    lng: longitude,
    timestamp: DateTimeOriginal ? DateTimeOriginal.toISOString() : null,
  };
}

/**
 * @function
 * @description 위도/경도 값이 유효한 범위인지 검증
 * @param lat - 위도 (-90 ~ 90)
 * @param lng - 경도 (-180 ~ 180)
 * @returns 유효 여부
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  if (isNaN(lat) || isNaN(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * @function
 * @description GPS 포인트 배열을 타임스탬프 오름차순 정렬 (null은 맨 뒤)
 * @param points - GpsPoint 배열
 * @returns 정렬된 GpsPoint 배열
 */
export function sortByTimestamp(points: GpsPoint[]): GpsPoint[] {
  return [...points].sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
}
