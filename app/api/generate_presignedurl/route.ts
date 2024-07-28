import { NextRequest, NextResponse } from "next/server";
import { generatePreSignedUrl, getSignedUrl } from "../../../utils/gcp";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const fileInfos = body.fileInfos;

    const preSignedUrls = await Promise.all(
      fileInfos?.map(async (fileInfo: any) => {
        const finalFilename = `${Date.now()}_${fileInfo.filename}`
        const url = await generatePreSignedUrl(fileInfo.filename, fileInfo.contentType);

        return {
          preSignedUrl: url,
          documentType: fileInfo.documentType,
          filename: finalFilename
        };
      })
    );

    return NextResponse.json({ preSignedUrls: preSignedUrls });
  } catch (error) {
    console.error("Error generating presigned urls:", error);
    return NextResponse.json(
      { error: "Error generating presigned urls" },
      { status: 500 }
    );
  }
}
