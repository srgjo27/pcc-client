import { useMutation } from '@tanstack/react-query';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';
import { loginUser, registerUser } from '../services';
import { setSecureItem } from '@/shared/utils/storage';

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload) => loginUser(payload),
    onSuccess: (data) => {
      setSecureItem('access_token', data.session.access_token);
      setSecureItem('refresh_token', data.session.refresh_token);
    },
  });
}

export function useRegister() {
  return useMutation<string, Error, RegisterPayload>({
    mutationFn: (payload) => registerUser(payload),
    onSuccess: (res) => {
      return res;
    },
  });
}