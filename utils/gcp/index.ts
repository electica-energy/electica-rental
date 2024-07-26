import { Storage } from "@google-cloud/storage";
import { PassThrough, Readable } from "stream";
import { AbortController } from "abort-controller";

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  },
});
const bucketName = process.env.GCP_BUCKET_NAME as string;
const bucket = storage.bucket(bucketName);

interface SignedUrlConfig {
  version: "v4";
  action: "read" | "write";
  expires: number;
  contentType?: string;
}

/**
 * Generates a signed URL for read or write access to a file.
 *
 * @param {string} fileName - The name of the file.
 * @param {'read' | 'write'} [action='read'] - The desired access action.
 * @param {string} [contentType='image/jpeg'] - The content type of the file.
 * @returns {Promise<string | undefined>} - The signed URL or undefined if the file doesn't exist.
 */
export async function getSignedUrl(
  fileName: string,
  action: "read" | "write" = "read",
  contentType: string = "image/jpeg"
): Promise<string | undefined> {
  try {
    const [fileExists] = await bucket.file(fileName).exists();
    if (!fileExists) {
      return undefined;
    }

    const readConfig: SignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    };

    const writeConfig: SignedUrlConfig = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    };

    const config = action === "read" ? readConfig : writeConfig;

    await bucket.setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ["PUT", "GET", "HEAD", "DELETE", "POST", "OPTIONS"],
        origin: ["*"],
        responseHeader: [
          "Content-Type",
          "Access-Control-Allow-Origin",
          "x-goog-resumable",
        ],
      },
    ]);

    const [signedUrl] = await bucket.file(fileName).getSignedUrl(config);
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

/**
 * Gets a signed URL for image uploads.
 *
 * @param {string} fileName - The name of the file.
 * @param {string} fileType - The type of the file.
 * @returns {Promise<string>} - The signed URL for uploading.
 */
export async function getSignedUrlUpload(
  fileName: string,
  fileType: string = "image/jpeg"
): Promise<string> {
  const url = await getSignedUrl(fileName, "write", fileType);
  return url!;
}

/**
 * Uploads a file to Google Cloud Storage.
 *
 * @param {string} filePath - The local path to the file.
 * @param {string} destination - The destination path in the bucket.
 * @returns {Promise<void>}
 */
export async function uploadFile(
  filePath: string,
  destination: string
): Promise<void> {
  try {
    await bucket.upload(filePath, {
      destination,
      contentType: "image/jpeg",
      public: true,
    });
    console.log(`${filePath} uploaded to ${destination}`);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Uploads a file stream to Google Cloud Storage.
 *
 * @param {Readable} fileStream - The file stream.
 * @param {string} fileName - The name of the file.
 * @returns {Promise<void>}
 */
export async function uploadFileStream(stream: Readable, filePath: string): Promise<void> {
  const controller = new AbortController();
  const signal = controller.signal;

  const passThrough = new PassThrough();

  stream.pipe(passThrough);

  return new Promise((resolve, reject) => {
    const file = bucket.file(filePath);
    const writeStream = file.createWriteStream({
      resumable: true,
      validation: "crc32c",
      metadata: {
        contentType: "application/octet-stream",
      },
    });

    passThrough.pipe(writeStream).on("finish", resolve).on("error", reject);

    // Manually abort the stream on signal
    signal.addEventListener("abort", () => {
      writeStream.destroy(new Error("Upload aborted"));
    });

    // Optional: Abort the request after a timeout
    setTimeout(() => controller.abort(), 60000);
  });
}

/**
 * Gets a public URL for the uploaded file.
 *
 * @param {string} fileName - The name of the file.
 * @returns {string} - The public URL.
 */
export function getPublicUrl(fileName: string): string {
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}
