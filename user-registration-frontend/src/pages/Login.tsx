import React from 'react';
import { LogIn } from 'lucide-react';
import LoginForm from '@/components/LoginForm';

export default function Login() {
  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full fade-in">
        <div className="text-center mb-6">
          <LogIn className="h-10 w-10 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">Sign in to your account to continue</p>
        </div>
      <LoginForm />
      </div>
    </div>
  );
}
