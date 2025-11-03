import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2, LogIn } from 'lucide-react';

type LoginForm = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  async function onSubmit(values: LoginForm) {
    setLoading(true);
    setMessage(null);
    setTimeout(() => {
      if (values.email === 'test@example.com' && values.password === 'password') {
        setMessage({type: 'success', text: 'Login successful'});
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage({type: 'error', text: 'Invalid credentials'});
      }
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full fade-in">
        <div className="text-center mb-6">
          <LogIn className="h-10 w-10 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">Sign in to your account to continue</p>
        </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              type="email"
              placeholder="Enter your email"
              {...register('email', { required: 'Email required' })}
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
              {...register('password', { required: 'Password required' })}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Logging in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {message?.type === 'success' && (
          <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5 mr-2" />
            {message.text}
          </div>
        )}
        {message?.type === 'error' && (
          <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
            <XCircle className="h-5 w-5 mr-2" />
            Login failed: {message.text}
          </div>
        )}
      </form>
      </div>
    </div>
  );
}
