// Provider scope constants - avoids string repetition
export const PROVIDER_VENDORS = {
  SUPABASE: 'supabase',
  MOCK: 'mock',
} as const;

export type ProviderVendor =
  (typeof PROVIDER_VENDORS)[keyof typeof PROVIDER_VENDORS];

export const PROVIDER_CONTEXTS = {
  SERVER: 'server',
  CLIENT: 'client',
} as const;

export type ProviderContext =
  (typeof PROVIDER_CONTEXTS)[keyof typeof PROVIDER_CONTEXTS];

export const PROVIDER_DOMAINS = {
  AUTH: 'auth',
  DATABASE: 'database',
  STORAGE: 'storage',
} as const;

export type ProviderDomain =
  (typeof PROVIDER_DOMAINS)[keyof typeof PROVIDER_DOMAINS];

export abstract class Provider {
  /**
   * Identifies the vendor, context, and domain of this implementation.
   * Convention: '<vendor>:<context>:<domain>'
   *
   * Examples:
   *   'supabase:server:auth'
   *   'supabase:client:auth'
   *   'mock:client:auth'
   */
  abstract readonly name: string;

  /**
   * Helper method to generate standardized provider names
   * Prevents string repetition across implementations
   */
  protected static createName(
    vendor: ProviderVendor,
    context: ProviderContext,
    domain: ProviderDomain
  ): string {
    return `${vendor}:${context}:${domain}`;
  }
}
