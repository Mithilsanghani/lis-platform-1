import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const { user, setUser, setLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as 'professor' | 'student') || 'student',
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as 'professor' | 'student') || 'student',
          });
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, setLoading]);

  const signUp = async (email: string, password: string, role: 'professor' | 'student' = 'student') => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role },
        },
      });
      if (error) throw error;
      
      // For mock auth, set user directly
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          role,
        });
      }
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string, role: 'professor' | 'student' = 'student') => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // For mock auth, set user directly with the role
      if (data?.user || !data?.user) {
        setUser({
          id: data?.user?.id || 'user_' + Math.random().toString(36).substr(2, 9),
          email: data?.user?.email || email,
          role,
        });
      }
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  };

  return { user, error, signUp, signIn, signOut };
};
