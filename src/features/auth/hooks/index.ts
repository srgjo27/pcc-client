import { useMutation } from '@tanstack/react-query';
import { loginUser, registerUser } from '../services';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

/**
 * Custom hook to handle login mutation using TanStack Query.
 */
export function useLogin() {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload) => loginUser(payload),
  });
}

/**
 * Custom hook to handle register mutation using TanStack Query.
 */
export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (payload) => registerUser(payload),
  });
}
