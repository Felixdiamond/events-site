import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAdmin = token?.role === 'admin';
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  // Allow access to login page
  if (isLoginPage) {
    // If already logged in and admin, redirect to admin dashboard
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (!isAdmin) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 