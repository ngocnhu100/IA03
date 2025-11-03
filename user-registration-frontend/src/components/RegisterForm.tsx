import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { registerUser, RegisterDto } from '../api';
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FormValues = {
  email: string;
  password: string;
  confirm: string;
};

export default function RegisterForm() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: RegisterDto) => registerUser(data),
    onSuccess: () => {
      reset();
    },
  });

  async function onSubmit(values: FormValues) {
    if (values.password !== values.confirm) {
      // Handle password mismatch
      return;
    }
    mutation.mutate({ email: values.email, password: values.password });
  }

  // Normalize API error messages for nicer rendering (supports string or string[])
  const apiErrorRaw = (mutation.error as any)?.response?.data?.message;
  const errorMessages: string[] = Array.isArray(apiErrorRaw)
    ? apiErrorRaw
    : apiErrorRaw
    ? [apiErrorRaw]
    : ['Unknown error'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="email"
            className="pl-10 pr-3"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'reg-email-error' : undefined}
            {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
          />
        </div>
        {errors.email && (
          <div id="reg-email-error" className="flex items-center text-sm text-destructive" aria-live="polite">
            <XCircle className="h-4 w-4 mr-1" />
            {errors.email.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="password"
            className="pl-10 pr-10"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'reg-password-error' : undefined}
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            title={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && (
          <div id="reg-password-error" className="flex items-center text-sm text-destructive" aria-live="polite">
            <XCircle className="h-4 w-4 mr-1" />
            {errors.password.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="confirm"
            className="pl-10 pr-10"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm your password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirm || (watch('confirm') && watch('password') !== watch('confirm')) || false}
            aria-describedby={errors.confirm || (watch('confirm') && watch('password') !== watch('confirm')) ? 'reg-confirm-error' : undefined}
            {...register('confirm', { required: 'Please confirm password' })}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            aria-pressed={showConfirm}
            title={showConfirm ? 'Hide password' : 'Show password'}
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.confirm && (
          <div id="reg-confirm-error" className="flex items-center text-sm text-destructive" aria-live="polite">
            <XCircle className="h-4 w-4 mr-1" />
            {errors.confirm.message}
          </div>
        )}
        {watch('password') !== watch('confirm') && watch('confirm') && (
          <div id="reg-confirm-error" className="flex items-center text-sm text-destructive" aria-live="polite">
            <XCircle className="h-4 w-4 mr-1" />
            Passwords do not match
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Registering...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {mutation.isSuccess && (
        <Alert className="flex items-start gap-3 [&>svg]:static [&>svg~*]:pl-0 [&>svg+div]:translate-y-0">
          <CheckCircle className="h-4 w-4 mt-0.5" />
          <div className="text-left">
            <AlertTitle className="mb-1">You’re all set!</AlertTitle>
            <AlertDescription className="leading-relaxed break-words">
              Registration successful. Welcome aboard.
            </AlertDescription>
          </div>
        </Alert>
      )}
      {mutation.isError && (
        <Alert variant="destructive" className="flex items-start gap-3 [&>svg]:static [&>svg~*]:pl-0 [&>svg+div]:translate-y-0">
          <XCircle className="h-4 w-4 mt-0.5" />
          <div className="text-left">
            <AlertTitle className="mb-1">Registration failed</AlertTitle>
            <AlertDescription className="leading-relaxed break-words">
              {errorMessages.length > 1 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {errorMessages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              ) : (
                <> {errorMessages[0]} </>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </form>
  );
}
