export type Role = 'customer' | 'driver' | 'owner';

export const AuthService = {
  async login(email: string, password: string, role: Role) {
    // Placeholder for real backend or Firebase
    return { ok: true, email, role };
  },
  async registerCustomer(name: string, email: string, password: string) {
    return { ok: true, name, email };
  },
  async submitDriverApplication(payload: Record<string, any>) {
    return { ok: true, applicationId: Math.random().toString(36).slice(2), payload };
  },
  async registerOwner(name: string, email: string, password: string) {
    return { ok: true, name, email };
  },
};

