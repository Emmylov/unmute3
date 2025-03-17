import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface SupabaseContextType {
  supabase: typeof supabase;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  uploadFile: (bucket: string, path: string, file: File) => Promise<string | null>;
  getFileUrl: (bucket: string, path: string) => Promise<string | null>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      if (response.data.user) {
        setUser(response.data.user);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (response.data.user) {
        setUser(response.data.user);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const uploadFile = async (bucket: string, path: string, file: File): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const getFileUrl = async (bucket: string, path: string): Promise<string | null> => {
    try {
      const { data } = await supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  };

  const value = {
    supabase,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    uploadFile,
    getFileUrl,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};