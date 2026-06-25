import { z } from 'zod';
import { strings, type TranslationType } from '../../../constants/strings';

// Base schemas for TypeScript type inference
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: strings.id.auth.validation.emailRequired })
    .email({ message: strings.id.auth.validation.emailInvalid }),
  password: z
    .string()
    .min(1, { message: strings.id.auth.validation.passwordRequired })
    .min(8, { message: strings.id.auth.validation.passwordMin }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: strings.id.auth.validation.nameRequired })
      .min(2, { message: strings.id.auth.validation.nameMin }),
    email: z
      .string()
      .min(1, { message: strings.id.auth.validation.emailRequired })
      .email({ message: strings.id.auth.validation.emailInvalid }),
    password: z
      .string()
      .min(1, { message: strings.id.auth.validation.passwordRequired })
      .min(8, { message: strings.id.auth.validation.passwordMin }),
    confirmPassword: z
      .string()
      .min(1, { message: strings.id.auth.validation.confirmPasswordRequired }),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, { message: strings.id.auth.validation.termsRequired }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: strings.id.auth.validation.passwordsMustMatch,
    path: ['confirmPassword'],
  });

// Dynamic schema builder functions for forms
export const getLoginSchema = (t: TranslationType) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t.auth.validation.emailRequired })
      .email({ message: t.auth.validation.emailInvalid }),
    password: z
      .string()
      .min(1, { message: t.auth.validation.passwordRequired })
      .min(8, { message: t.auth.validation.passwordMin }),
  });

export const getRegisterSchema = (t: TranslationType) =>
  z
    .object({
      name: z
        .string()
        .min(1, { message: t.auth.validation.nameRequired })
        .min(2, { message: t.auth.validation.nameMin }),
      email: z
        .string()
        .min(1, { message: t.auth.validation.emailRequired })
        .email({ message: t.auth.validation.emailInvalid }),
      password: z
        .string()
        .min(1, { message: t.auth.validation.passwordRequired })
        .min(8, { message: t.auth.validation.passwordMin }),
      confirmPassword: z
        .string()
        .min(1, { message: t.auth.validation.confirmPasswordRequired }),
      acceptTerms: z
        .boolean()
        .refine((val) => val === true, { message: t.auth.validation.termsRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.auth.validation.passwordsMustMatch,
      path: ['confirmPassword'],
    });
