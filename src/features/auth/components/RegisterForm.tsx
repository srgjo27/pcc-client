import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getRegisterSchema, useRegister, type RegisterPayload } from '@/features/auth';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { ASSETS } from '@/constants/assets';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { mutateAsync: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(getRegisterSchema(t)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterPayload) => {
    setAuthFeedback(null);
    try {
      await registerUser(data);
      reset();
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setAuthFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : t.auth.errorRegisterMessage,
      });
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
            <Input
              type="text"
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
                  className="text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  className="text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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

            <div className="flex flex-col gap-1.5 pt-1">
              <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  disabled={isPending}
                  className="h-4 w-4 mt-0.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 focus:outline-none focus-visible:ring-2"
                  {...register('acceptTerms')}
                />
                <span className={errors.acceptTerms ? 'text-red-600 font-medium' : ''}>
                  {t.auth.termsLabel}
                </span>
              </label>
              {errors.acceptTerms && (
                <p role="alert" className="text-xs font-medium text-red-600 animate-fadeIn">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {authFeedback && (
              <div
                role="alert"
                className={`p-3 rounded-lg text-sm font-medium border ${
                  authFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {authFeedback.message}
              </div>
            )}

            <div className="space-y-4">
              <Button
                type="submit"
                isLoading={isPending}
                className="w-full mt-2"
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
