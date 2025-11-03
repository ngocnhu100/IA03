import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type LoginFormValues = { email: string; password: string };

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string | string[] } | null>(null);
  const navigate = useNavigate();

  async function onSubmit(values: LoginFormValues) {
    setLoading(true);
    setMessage(null);
    setTimeout(() => {
      if (values.email === 'test@example.com' && values.password === 'password') {
        setMessage({ type: 'success', text: 'Login successful' });
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage({ type: 'error', text: 'Invalid credentials' });
      }
      setLoading(false);
    }, 1000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="email"
            className="pl-10 pr-3"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email', {
              required: 'Email required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email (e.g. user@example.com)' },
            })}
          />
        </div>
        {errors.email && (
          <div id="email-error" className="flex items-center text-sm text-destructive" aria-live="polite">
            <XCircle className="h-4 w-4 mr-1" />
            {errors.email.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="password"
            className="pl-10 pr-10"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password', { required: 'Password required' })}
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
          <div id="password-error" className="flex items-center text-sm text-destructive" aria-live="polite">
            <XCircle className="h-4 w-4 mr-1" />
            {errors.password.message}
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Logging in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {message?.type === 'success' && (
        <Alert className="flex items-start gap-2 [&>svg]:static [&>svg~*]:pl-0 [&>svg+div]:translate-y-0 break-words">
          <CheckCircle className="h-4 w-4 mt-0.5" />
          <div>
            <AlertTitle>Login successful</AlertTitle>
            <AlertDescription className="mt-1">
              {Array.isArray(message.text) || String(message.text).includes('\n') ? (
                <ul className="list-disc list-inside space-y-1">
                  {(Array.isArray(message.text) ? message.text : String(message.text).split('\n')).map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              ) : (
                <span>{String(message.text)}</span>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}
      {message?.type === 'error' && (
        <Alert variant="destructive" className="flex items-start gap-2 [&>svg]:static [&>svg~*]:pl-0 [&>svg+div]:translate-y-0 break-words">
          <XCircle className="h-4 w-4 mt-0.5" />
          <div>
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription className="mt-1">
              {Array.isArray(message.text) || String(message.text).includes('\n') ? (
                <ul className="list-disc list-inside space-y-1">
                  {(Array.isArray(message.text) ? message.text : String(message.text).split('\n')).map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              ) : (
                <span>{String(message.text)}</span>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </form>
  );
}
