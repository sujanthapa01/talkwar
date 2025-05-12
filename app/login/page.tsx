'use client'
import { title } from "@/components/primitives";
import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prismaClient'
export default function LoginPage() {
  const supabase = createClient();

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/d`,
      },
    });

    prisma.user.create({
      where: { email: supabase.auth.user()?.email }
    }).then((user) => {
      console.log(user);
    }
    ).catch((error) => {
      console.error("Error creating user:", error);
    }
    );

  };

  return (
    <div>
      <h1 className={title({ color: 'yellow' })}>Login</h1>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Login</h1>
        <button onClick={loginWithGoogle} className="bg-black text-white px-4 py-2 rounded">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
