// src/pages/LoginPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/'); // العودة للصفحة الرئيسية بعد تسجيل الدخول بنجاح
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2>تسجيل الدخول</h2>
        <p>مرحباً بعودتك! أدخل بياناتك للمتابعة.</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">كلمة المرور</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="switch-auth">
          <p>ليس لديك حساب؟ <Link to="/signup">أنشئ حسابًا جديدًا</Link></p>
        </div>
      </div>
    </div>
  );
}