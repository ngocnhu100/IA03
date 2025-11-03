import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { registerUser, RegisterDto } from '../api';
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
          />
        </div>
        {errors.email && <p className="text-sm text-red-600 mt-1 flex items-center"><XCircle className="h-4 w-4 mr-1" />{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600 mt-1 flex items-center"><XCircle className="h-4 w-4 mr-1" />{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm your password"
            {...register('confirm', { required: 'Please confirm password' })}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirm && <p className="text-sm text-red-600 mt-1 flex items-center"><XCircle className="h-4 w-4 mr-1" />{errors.confirm.message}</p>}
        {watch('password') !== watch('confirm') && watch('confirm') && <p className="text-sm text-red-600 mt-1 flex items-center"><XCircle className="h-4 w-4 mr-1" />Passwords do not match</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Registering...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {mutation.isSuccess && (
        <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="h-5 w-5 mr-2" />
          Registration successful! Welcome aboard.
        </div>
      )}
      {mutation.isError && (
        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
          <XCircle className="h-5 w-5 mr-2" />
          Registration failed: {(mutation.error as any)?.response?.data?.message || 'Unknown error'}
        </div>
      )}
    </form>
  );
}
