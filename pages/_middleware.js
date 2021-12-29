import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  //Allow requests if
  //1) Its a request for next-auth session % providerr fetching
  //2) The token exists

  if (pathname.includes('/api/auth' || token)) {
    return NextResponse.next();
  }
  //redirect to login if doesnt have token AND  requesting a protected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login');
  }
}
