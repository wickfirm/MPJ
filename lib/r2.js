import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

export const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || ''

// Lazy-initialize R2 client (avoids build-time error when env vars aren't set)
let _r2Client = null
function getR2Client() {
  if (!_r2Client) {
    _r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return _r2Client
}

/**
 * Upload a file buffer to Cloudflare R2
 * @param {Buffer} fileBuffer - The file data
 * @param {string} key - The storage key/path (e.g., 'creatives/Smoki Moto/2026-02/123456-ad.jpg')
 * @param {string} contentType - MIME type (e.g., 'image/jpeg')
 * @returns {string} The public URL of the uploaded file
 */
export async function uploadToR2(fileBuffer, key, contentType) {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  )
  return `${R2_PUBLIC_URL}/${key}`
}

/**
 * Delete a file from Cloudflare R2
 * @param {string} key - The storage key/path to delete
 */
export async function deleteFromR2(key) {
  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    })
  )
}

/**
 * Generate a storage key for a creative image
 * @param {string} venueName - Venue name
 * @param {string} month - Month string (e.g., '2026-02')
 * @param {string} fileName - Original file name
 * @returns {string} The R2 storage key
 */
export function generateR2Key(venueName, month, fileName) {
  const safeName = venueName.replace(/[^a-zA-Z0-9-_ ]/g, '').trim()
  const safeFile = fileName.replace(/[^a-zA-Z0-9-_.]/g, '_')
  return `creatives/${safeName}/${month}/${Date.now()}-${safeFile}`
}
