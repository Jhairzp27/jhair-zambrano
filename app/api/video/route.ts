import { NextResponse } from 'next/server';
import { imagekit } from '@/lib/imagekit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  const referer = request.headers.get('referer');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const myDomain = "https://jhair-zambrano.vercel.app/";

  if (!isDevelopment) {
    if (!referer || !referer.includes(myDomain)) {
      return new NextResponse('ACCESO DENEGADO: Intento de descarga bloqueado.', { status: 403 });
    }
  }

  if (!path) {
    return new NextResponse('Falta la ruta del video', { status: 400 });
  }

  const signedUrl = imagekit.url({
    path: path,
    signed: true,
    expireSeconds: 180,
  });

  return NextResponse.redirect(signedUrl);
}