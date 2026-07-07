import { z } from 'zod';
import { loginSchema, registerSchema } from '../schemas';

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  timezone: string;
  createdAt: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}