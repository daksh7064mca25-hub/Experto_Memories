import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME || "";
}

export function getR2PublicDomain(): string {
  return (process.env.R2_PUBLIC_DOMAIN || "").replace(/\/+$/, "");
}

let s3ClientInstance: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY
  );
}

export function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Cloudflare R2 is not configured. Please supply R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY."
    );
  }

  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return s3ClientInstance;
}

export function getR2PublicUrl(key: string): string {
  const cleanKey = key.replace(/^\/+/, "");
  const publicDomain = getR2PublicDomain();
  if (publicDomain) {
    return `${publicDomain}/${cleanKey}`;
  }
  return `/api/media/view?key=${encodeURIComponent(cleanKey)}`;
}

/**
 * Generates a presigned PUT URL allowing clients to upload directly to Cloudflare R2
 * without routing heavy binary payloads through the Next.js serverless functions.
 */
export async function createR2PresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 900 // 15 minutes
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const client = getR2Client();
  const cleanKey = key.replace(/^\/+/, "");
  const bucket = getR2BucketName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  const publicUrl = getR2PublicUrl(cleanKey);

  return {
    uploadUrl,
    publicUrl,
    key: cleanKey,
  };
}

/**
 * Direct server-side buffer upload to Cloudflare R2
 */
export async function uploadBufferToR2(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<{ publicUrl: string; key: string; bytes: number }> {
  const client = getR2Client();
  const cleanKey = key.replace(/^\/+/, "");
  const bucket = getR2BucketName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  return {
    publicUrl: getR2PublicUrl(cleanKey),
    key: cleanKey,
    bytes: buffer.byteLength,
  };
}

/**
 * Deletes an object from Cloudflare R2
 */
export async function deleteR2Object(key: string): Promise<void> {
  const client = getR2Client();
  const cleanKey = key.replace(/^\/+/, "");
  const bucket = getR2BucketName();

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
  });

  await client.send(command);
}

/**
 * Generates a presigned GET URL allowing authorized clients to view/download private R2 objects
 */
export async function createR2PresignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 3600 // 1 hour
): Promise<string> {
  const client = getR2Client();
  const cleanKey = key.replace(/^\/+/, "");
  const bucket = getR2BucketName();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
  });

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}
