// src/context/AuthContext.js (النسخة النهائية المبسطة)
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب الجلسة الأولية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // جلب الملف الشخصي للمستخدم المسجل دخوله
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => {
            setProfile(data);
            setLoading(false);
          });
      } else {
        setLoading(false); // مهم: إيقاف التحميل حتى لو لم يكن هناك مستخدم
      }
    });

    // إعداد المستمع للتغيرات
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          supabase.from('profiles').select('*').eq('id', session.user.id).single()
            .then(({ data }) => setProfile(data));
        } else {
          setProfile(null);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

const value = {
  session,
  user,
  profile,
  signOut: () => supabase.auth.signOut(), // <-- أضفنا الدالة هنا
};

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}