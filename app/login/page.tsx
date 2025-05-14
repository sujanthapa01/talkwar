'use client'

import { title } from "@/components/primitives";
import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/d`,
      },
    });

    if (error) {
      console.error('Error during Google login:', error);
    }
  };

 
  return (
    <div>
      <h1 className={title({ color: 'yellow' })}>Login</h1>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Login</h1>
        <button
          onClick={loginWithGoogle}
          className="bg-black text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
