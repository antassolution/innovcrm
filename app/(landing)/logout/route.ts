import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Clear cookies on the server side
  const response = NextResponse.redirect(new URL('/#home', request.url));
  response.cookies.set('authToken', '', { expires: new Date(0) });

  return response;
}