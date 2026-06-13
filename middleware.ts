import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta ya tiene el prefijo /en
  const hasEnglishLocale = pathname.startsWith('/en/') || pathname === '/en';

  // Si ya tiene /en, solo agregar el header y continuar
  if (hasEnglishLocale) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Para rutas en español (sin prefijo), agregar el header y continuar
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
