import React, { useState } from 'react';
import { CircleCheck, CircleX, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { ASSETS } from '@/constants/assets';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import type { RegisterPayload } from '../types';
import { useForm } from 'react-hook-form';
import { useRegister } from '../hooks';
import { registerSchema } from '../schemas';
import { getErrorMessage } from '@/shared/utils/error';

export const RegisterForm: React.FC = () => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutateAsync: registration, isPending } = useRegister();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      const result = await registration(data)
      setSuccess(result);
    } catch (e) {
      const msg = getErrorMessage(e)
      setError(msg);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img src={ASSETS.images.pcc} alt="PCC Logo" loading="lazy" className="h-24 w-auto object-contain" />
          </div>
          <CardTitle className="text-center">
            {t.auth.registerTitle}
          </CardTitle>
          <CardDescription className="text-center">
            {t.auth.registerDescription}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {error && (
              <div className="flex items-center h-10 w-full p-4 rounded-lg border border-red-300 bg-red-500/15">
                <div className="flex items-center gap-2">
                  <CircleX className="h-4 w-4 text-red-500" />
                  <p className="text-red-500 text-xs">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-center min-h-15 w-full p-4 rounded-lg border border-emerald-300 bg-emerald-500/15">
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-7 w-7 text-emerald-500" />
                  <p className="text-emerald-500 text-xs">{success}. Click on the link sent to your email to verify your account.</p>
                </div>
              </div>
            )}

            <Input
              label={t.auth.nameLabel}
              placeholder={t.auth.namePlaceholder}
              error={errors.name?.message}
              disabled={isPending}
              {...register('name')}
            />

            <Input
              type="email"
              label={t.auth.emailLabel}
              placeholder={t.auth.emailPlaceholder}
              error={errors.email?.message}
              disabled={isPending}
              {...register('email')}
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label={t.auth.passwordLabel}
              placeholder={t.auth.passwordPlaceholder}
              error={errors.password?.message}
              disabled={isPending}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              {...register('password')}
            />

            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label={t.auth.confirmPasswordLabel}
              placeholder={t.auth.confirmPasswordPlaceholder}
              error={errors.confirmPassword?.message}
              disabled={isPending}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              {...register('confirmPassword')}
            />

            <div className="flex flex-col gap-2 pt-1">
              <label className="flex items-start gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  {...register('acceptTerms')}
                />
                <span>
                  {t.auth.termsLabel}
                </span>
              </label>
              {errors.acceptTerms?.message && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full font-bold mt-2"
                isLoading={isPending}
              >
                {!isPending && t.auth.registerButton}
              </Button>

              <div className="text-center text-sm text-slate-600">
                <span>{t.auth.alreadyHaveAccountText} </span>
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:underline"
                >
                  {t.auth.loginLinkText}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
