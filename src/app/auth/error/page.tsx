'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const AuthErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An error occurred during authentication';
  
  // Xử lý các loại lỗi phổ biến
  if (error === 'OAuthSignin') errorMessage = 'Error starting OAuth sign in';
  if (error === 'OAuthCallback') errorMessage = 'Error during OAuth callback';
  if (error === 'OAuthCreateAccount') errorMessage = 'Error creating OAuth account';
  if (error === 'EmailCreateAccount') errorMessage = 'Error creating email account';
  if (error === 'Callback') errorMessage = 'Error during callback';
  if (error === 'OAuthAccountNotLinked') errorMessage = 'Email already used with different provider';
  if (error === 'EmailSignin') errorMessage = 'Error sending email sign in link';
  if (error === 'CredentialsSignin') errorMessage = 'Invalid credentials';
  if (error === 'SessionRequired') errorMessage = 'Please sign in to access this page';
  if (error === 'Default') errorMessage = 'Unable to sign in';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Authentication Error
        </h1>
        <p className="text-gray-600">
          {errorMessage}
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <Link
          href="/auth/signin"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
        >
          Back to Sign In
        </Link>
        
        <Link
          href="/"
          className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
        >
          Go to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default AuthErrorPage; 