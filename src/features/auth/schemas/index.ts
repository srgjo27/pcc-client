import { z } from 'zod';
import { strings } from '../../../constants/strings';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: strings.auth.validation.emailRequired })
    .email({ message: strings.auth.validation.emailInvalid }),
  password: z
    .string()
    .min(1, { message: strings.auth.validation.passwordRequired })
    .min(8, { message: strings.auth.validation.passwordMin }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: strings.auth.validation.nameRequired })
      .min(2, { message: strings.auth.validation.nameMin }),
    email: z
      .string()
      .min(1, { message: strings.auth.validation.emailRequired })
      .email({ message: strings.auth.validation.emailInvalid }),
    password: z
      .string()
      .min(1, { message: strings.auth.validation.passwordRequired })
      .min(8, { message: strings.auth.validation.passwordMin }),
    confirmPassword: z
      .string()
      .min(1, { message: strings.auth.validation.confirmPasswordRequired }),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, { message: strings.auth.validation.termsRequired }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: strings.auth.validation.passwordsMustMatch,
    path: ['confirmPassword'],
  });
