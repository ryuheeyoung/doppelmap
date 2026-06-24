// Cloudflare D1 REST API 기본 URL
const D1_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_D1_DATABASE_ID}`;

// D1 쿼리 응답 타입
interface D1Response<T> {
  result: { results: T[] }[];
  success: boolean;
  errors: { message: string }[];
}

/**
 * @function
 * @description Cloudflare D1 REST API로 SQL 쿼리 실행
 * @param sql - 실행할 SQL 쿼리
 * @param params - 바인딩할 파라미터 배열
 * @returns 쿼리 결과 배열
 */
export async function queryD1<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await fetch(`${D1_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const data: D1Response<T> = await res.json();

  if (!data.success) {
    throw new Error(data.errors[0]?.message ?? 'D1 쿼리 실패');
  }

  return data.result[0]?.results ?? [];
}
