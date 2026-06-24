import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// R2 S3 호환 클라이언트 (싱글톤)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// R2 버킷 이름
const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

/**
 * @function
 * @description 파일을 R2에 업로드하고 공개 URL 반환
 * @param key - R2 저장 경로 (예: photos/uuid.jpg)
 * @param body - 업로드할 파일 Buffer
 * @param contentType - 파일 MIME 타입
 * @returns 업로드된 파일의 공개 URL
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return `${process.env.R2_ENDPOINT}/${BUCKET_NAME}/${key}`;
}
