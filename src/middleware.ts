import { auth } from '@/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin/');
  const isH5Page = request.nextUrl.pathname.startsWith('/h5/');

  const isAdmin = session?.user?.isAdmin;

  // 如果用户未登录且不在认证页面，重定向到登录页
  if (!session && !isAuthPage && !isH5Page) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 如果用户已登录且访问认证页面，重定向到首页
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 如果用户已登录且访问管理员页面，重定向到首页
  if (session && isAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
