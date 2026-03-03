import { createMiddlewareChain } from './middleware/middleware-chain';

export default createMiddlewareChain();

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
