import { strings } from '../../../constants/strings';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

/**
 * Mock API service to login a user with simulated network latency.
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For slicing, we will accept any login but fail on a specific test password/email if desired.
      // Let's mock a successful login.
      if (payload.email === 'error@example.com') {
        reject(new Error(strings.auth.errorMessage));
      } else {
        resolve({
          user: {
            id: 'usr_12345',
            name: 'John Doe',
            email: payload.email,
          },
          token: 'mock_jwt_token_xyz_54321',
        });
      }
    }, 1500);
  });
}

/**
 * Mock API service to register a user with simulated network latency.
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (payload.email === 'error@example.com') {
        reject(new Error(strings.auth.errorRegisterMessage));
      } else {
        resolve({
          user: {
            id: 'usr_reg_' + Math.random().toString(36).substring(2, 9),
            name: payload.name,
            email: payload.email,
          },
          token: 'mock_jwt_token_register_xyz_54321',
        });
      }
    }, 1500);
  });
}
