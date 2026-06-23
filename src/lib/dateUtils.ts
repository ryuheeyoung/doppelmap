// 날짜/시간 포맷 옵션 (한국어 기준)
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
  timeZone: 'Asia/Seoul',
};

const DATETIME_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'Asia/Seoul',
};

/**
 * @function
 * @description ISO 문자열을 한국어 날짜 형식으로 변환 (예: 5월 30일 (토))
 * @param iso - ISO 8601 날짜 문자열
 * @returns 한국어 날짜 문자열
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', DATE_FORMAT);
}

/**
 * @function
 * @description ISO 문자열을 한국어 날짜+시간 형식으로 변환 (예: 2024. 5. 30. 오후 8:00)
 * @param iso - ISO 8601 날짜 문자열
 * @returns 한국어 날짜+시간 문자열
 */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', DATETIME_FORMAT);
}
