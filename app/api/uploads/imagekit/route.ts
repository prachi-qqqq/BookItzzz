import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ''
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fileName = body.fileName || `upload_${Date.now()}`;
    const params = {
      folder: 'bookitzzz',
      fileName,
      expire: 600
    };
    const token = imagekit.getAuthenticationParameters();
    // return signature + publicKey + urlEndpoint to client
    return NextResponse.json({
      signature: token.signature,
      token: token.token,
      expire: token.expire,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
