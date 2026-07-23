import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/about', '/privacy', '/terms', '/api'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('truth_engine_session')?.value;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isProtectedPath = ['/dashboard', '/analyze', '/history', '/profile'].some((path) => pathname.startsWith(path));

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/analyze/:path*', '/history/:path*', '/profile/:path*', '/login'],
};
