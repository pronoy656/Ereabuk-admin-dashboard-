import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Protect Admin and Consultant routes
  if (!token) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/consultant')) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // Optional: Redirect logged-in users away from login page
  if (token && pathname === '/login') {
    // Note: We don't decode here to keep middleware lightweight. 
    // The AuthProvider will handle specific dashboard redirection if needed.
    // Or we could just let them in and have AuthProvider redirect.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/consultant/:path*', '/login'],
};
