'use server';

import { randomUUID } from 'crypto';

import { auth } from '@/auth';
import { queryD1 } from '@/lib/d1';
import { uploadToR2 } from '@/lib/r2';

import type { GpsPoint } from '@/lib/exif';

interface UploadPhotoInput {
  fileName: string;
  fileType: string;
  fileData: string;
  gpsPoint: GpsPoint | null;
  spaceType: 'real' | 'virtual';
}

interface UploadPhotoResult {
  success: boolean;
  photoId?: string;
  error?: string;
}

/**
 * @function
 * @description 사진을 R2에 업로드하고 D1에 메타데이터 저장
 * @param input - 파일 정보, GPS 포인트, 공간 유형
 * @returns 업로드 성공 여부 및 photoId
 */
export async function uploadPhoto(
  input: UploadPhotoInput,
): Promise<UploadPhotoResult> {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return { success: false, error: '권한이 없습니다.' };
  }

  try {
    const id = randomUUID();
    const ext = input.fileName.split('.').pop() ?? 'jpg';
    const key = `photos/${id}.${ext}`;

    const buffer = Buffer.from(input.fileData, 'base64');
    const fileUrl = await uploadToR2(key, buffer, input.fileType);
    const fileSize = buffer.byteLength;

    await queryD1(
      `INSERT INTO photos (id, file_name, file_url, file_size, has_gps, lat, lng, taken_at, space_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.fileName,
        fileUrl,
        fileSize,
        input.gpsPoint ? 1 : 0,
        input.gpsPoint?.lat ?? null,
        input.gpsPoint?.lng ?? null,
        input.gpsPoint?.timestamp ?? null,
        input.spaceType,
      ],
    );

    return { success: true, photoId: id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '업로드 실패';
    return { success: false, error: message };
  }
}
