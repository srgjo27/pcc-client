import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/Card';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { loginSchema } from '../schemas';
import { useLogin } from '../hooks';
import { strings } from '../../../constants/strings';
import { ASSETS } from '../../../constants/assets';
import type { LoginPayload } from '../types';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { mutateAsync: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    setAuthFeedback(null);
    try {
      await login(data);
      setAuthFeedback({
        type: 'success',
        message: strings.auth.successMessage,
      });
    } catch (err) {
      setAuthFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : strings.auth.errorMessage,
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
            {strings.auth.loginTitle}
          </CardTitle>
          <CardDescription className="text-center">
            {strings.auth.loginDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              type="email"
              label={strings.auth.emailLabel}
              placeholder={strings.auth.emailPlaceholder}
              error={errors.email?.message}
              disabled={isPending}
              {...register('email')}
            />

            <div className="space-y-1">
              <Input
                type={showPassword ? 'text' : 'password'}
                label={strings.auth.passwordLabel}
                placeholder={strings.auth.passwordPlaceholder}
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
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:underline"
                >
                  {strings.auth.forgotPasswordLink}
                </Link>
              </div>
            </div>

            {authFeedback && (
              <div
                role="alert"
                className={`p-3 rounded-lg text-sm font-medium border ${authFeedback.type === 'success'
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
                {isPending ? strings.auth.submittingButton : strings.auth.submitButton}
              </Button>

              <div className="text-center text-sm text-slate-600">
                <span>{strings.auth.dontHaveAccountText} </span>
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:underline"
                >
                  {strings.auth.registerLinkText}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
