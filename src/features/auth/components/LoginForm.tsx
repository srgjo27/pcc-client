import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ASSETS } from '@/constants/assets';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useLogin } from '../hooks';
import type { LoginPayload } from '../types';
import { loginSchema } from '../schemas';

export const LoginForm: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    try {
      await login(data);
      navigate("/dashboard");
    } catch (e) {
      // TODO:
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
            {t.auth.loginTitle}
          </CardTitle>
          <CardDescription className="text-center">
            {t.auth.loginDescription}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              type="email"
              label={t.auth.emailLabel}
              placeholder={t.auth.emailPlaceholder}
              error={errors.email?.message}
              disabled={isPending}
              {...register('email')}
            />

            <div className="space-y-1">
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
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:underline"
                >
                  {t.auth.forgotPasswordLink}
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                isLoading={isPending}
                className="w-full font-bold mt-2"
              >
                {!isPending && t.auth.submitButton}
              </Button>

              <div className="text-center text-sm text-slate-600">
                <span>{t.auth.dontHaveAccountText} </span>
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:underline"
                >
                  {t.auth.registerLinkText}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
