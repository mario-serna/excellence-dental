/**
 * Shared error class for authentication failures.
 * Extends Error to allow instanceof checks.
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 401 | 403
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
