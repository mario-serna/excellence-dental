import { AuthProviderFactory } from '../factories/auth-provider-factory';
import { IAuthProvider, User } from '../interfaces/auth-provider.interface';

export class AuthService {
  private provider: IAuthProvider;

  constructor() {
    this.provider = AuthProviderFactory.createAuthProvider();
  }

  async signIn(email: string, password: string) {
    return this.provider.signIn(email, password);
  }

  async signOut() {
    return this.provider.signOut();
  }

  async getCurrentUser() {
    return this.provider.getCurrentUser();
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.provider.onAuthStateChange(callback);
  }
}

// Singleton instance
export const authService = new AuthService();
