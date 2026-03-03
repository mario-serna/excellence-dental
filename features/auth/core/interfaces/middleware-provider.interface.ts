export interface IMiddlewareAuthProvider {
  createMiddlewareClient(request: Request): any;
  getSession(request: Request): Promise<{ data: { session: any } }>;
  getUser(request: Request): Promise<{ data: { user: any } }>;
}
