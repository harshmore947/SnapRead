import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "snap-read-uploads";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxx.r2.dev or https://cdn.snapread.ai

/**
 * Cloudflare R2 S3-Compatible Client
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

/**
 * Uploads a file buffer directly to Cloudflare R2 bucket.
 * If R2_PUBLIC_URL is configured, returns direct public URL.
 * Otherwise, generates a long-lived presigned GET URL (7 days).
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string = "application/pdf"
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  let fileUrl: string;
  if (R2_PUBLIC_URL) {
    const cleanPublicUrl = R2_PUBLIC_URL.replace(/\/$/, "");
    fileUrl = `${cleanPublicUrl}/${key}`;
  } else {
    // Generate a 7-day presigned URL if no public custom domain is configured
    fileUrl = await getPresignedDownloadUrl(key, 60 * 60 * 24 * 7);
  }

  return {
    key,
    url: fileUrl,
    bucket: R2_BUCKET_NAME,
  };
}

/**
 * Generates a presigned GET URL for secure, temporary document access.
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, {
    expiresIn: expiresInSeconds,
  });
}

/**
 * Deletes an object from Cloudflare R2 bucket.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}
