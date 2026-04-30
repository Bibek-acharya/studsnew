import { middleware } from '../middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

describe('middleware', () => {
  it('redirects unauthenticated users from /scholarship-provider/* to login with redirect param', () => {
    const req = {
      url: 'http://localhost/scholarship-provider/dashboard',
      nextUrl: { pathname: '/scholarship-provider/dashboard' },
      cookies: { get: () => undefined },
    } as unknown as NextRequest;
    const res = middleware(req);
    const expectedUrl = new URL('/scholarship-provider', req.url);
    expectedUrl.searchParams.set('redirect', '/scholarship-provider/dashboard');
    expect(res).toEqual(NextResponse.redirect(expectedUrl));
  });

  it('allows authenticated users to access /scholarship-provider/*', () => {
    const req = {
      url: 'http://localhost/scholarship-provider/dashboard',
      nextUrl: { pathname: '/scholarship-provider/dashboard' },
      cookies: { get: () => ({ value: 'valid-token' }) },
    } as unknown as NextRequest;
    const res = middleware(req);
    expect(res).toEqual(NextResponse.next());
  });

  it('does not redirect from exact /scholarship-provider path', () => {
    const req = {
      url: 'http://localhost/scholarship-provider',
      nextUrl: { pathname: '/scholarship-provider' },
      cookies: { get: () => undefined },
    } as unknown as NextRequest;
    const res = middleware(req);
    // Matcher doesn't include exact /scholarship-provider, so middleware returns next
    expect(res).toEqual(NextResponse.next());
  });

  it('redirects unauthenticated users from /user/dashboard/* to login', () => {
    const req = {
      url: 'http://localhost/user/dashboard',
      nextUrl: { pathname: '/user/dashboard' },
      cookies: { get: () => undefined },
    } as unknown as NextRequest;
    const res = middleware(req);
    const expectedUrl = new URL('/login', req.url);
    expectedUrl.searchParams.set('redirect', '/user/dashboard');
    expect(res).toEqual(NextResponse.redirect(expectedUrl));
  });
});
