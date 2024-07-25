import { NextRequest, NextResponse } from 'next/server';
import { getPublicUrl, uploadFileStream } from '../../../utils/gcp';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files: { [key: string]: File } = {};
    const urls: { [key: string]: string } = {};

    const profile_pic = formData.get('profile_pic') as File;
    const aadhar_front = formData.get('aadhar_front') as File;
    const aadhar_back = formData.get('aadhar_back') as File;
    const pan = formData.get('pan') as File;
    const dl_front = formData.get('dl_front') as File;
    const dl_back = formData.get('dl_back') as File;

    if (profile_pic) {
      files.profile_pic = profile_pic;
    }
    if (aadhar_front) {
      files.aadhar_front = aadhar_front;
    }
    if (aadhar_back) {
      files.aadhar_back = aadhar_back;
    }
    if (pan) {
      files.pan = pan;
    }
    if (dl_front) {
      files.dl_front = dl_front;
    }
    if (dl_back) {
      files.dl_back = dl_back;
    }

    for (const [key, file] of Object.entries(files)) {
      const fileName = `${file.name}_${Date.now()}`;

      // Convert the file to a readable stream
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      // Upload the file
      await uploadFileStream(stream, `uploaded_documents/${fileName}`);

      // Get the public URL
      const publicUrl = getPublicUrl(fileName);
      urls[`${key}_url`] = publicUrl;
    }

    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Error uploading files' }, { status: 500 });
  }
}