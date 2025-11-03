import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, LogIn, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-lg w-full text-center fade-in">
        <div className="mb-6">
          <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome to Our Platform</h2>
          <p className="text-gray-600 text-sm sm:text-base">Join thousands of users and start your journey today. Secure, fast, and easy to use.</p>
        </div>
        <div className="space-y-4">
          <Link
            to="/signup"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center font-medium"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Get Started - Sign Up
          </Link>
          <Link
            to="/login"
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-medium"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
