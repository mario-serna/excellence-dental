export interface IMiddlewareAuthProvider {
  createMiddlewareClient(request: Request): any;
  getSession(request: Request): Promise<{ data: { session: any } }>;
}
