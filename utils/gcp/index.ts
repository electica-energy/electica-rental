import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
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
 * @param {string} [contentType='application/octet-stream'] - The content type of the file.
 * @returns {Promise<string>} - The signed URL.
 */
export async function getSignedUrl(
  fileName: string,
  action: "read" | "write" = "read",
  contentType: string = "application/octet-stream"
): Promise<string> {
  try {
    if (action === "read") {
      const [fileExists] = await bucket.file(fileName).exists();
      if (!fileExists) {
        throw new Error("File does not exist");
      }
    }

    const config: SignedUrlConfig = {
      version: "v4",
      action,
      expires:
        Date.now() + (action === "read" ? 60 * 60 * 1000 : 15 * 60 * 1000), // 1 hour for read, 15 minutes for write
      contentType: action === "write" ? contentType : undefined,
    };

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
 * @param {string} [fileType='application/octet-stream'] - The type of the file.
 * @returns {Promise<string>} - The signed URL for uploading.
 */
export async function getSignedUrlUpload(
  fileName: string,
  fileType: string = "application/octet-stream"
): Promise<string> {
  const url = await getSignedUrl(fileName, "write", fileType);
  return url;
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

// Function to generate a pre-signed URL for uploading a file
export async function generatePreSignedUrl(
  fileName: string,
  contentType: string = "application/octet-stream"
): Promise<string> {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(`uploaded_documents/${fileName}`);

  try {
    const options: any = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType, // Use the provided content type
    };

    const [url] = await file.getSignedUrl(options);

    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}
