// src/pages/SignupPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // سنحتاج للاسم الكامل عند إنشاء حساب لربطه بجدول `profiles`
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // هنا نمرر البيانات الإضافية التي ستُستخدم لاحقًا
        data: {
          full_name: fullName,
          avatar_url: '/avatars/default-avatar.png', // رابط افتراضي للصورة
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // بعد إنشاء الحساب، يفضل تسجيل الدخول تلقائيًا أو إرسال المستخدم لصفحة تسجيل الدخول
      alert('تم إنشاء حسابك بنجاح! يرجى إختيار الصفحة الرئيسية.');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2>إنشاء حساب جديد</h2>
        <p>انضم إلينا الآن وشارك في مجتمعنا.</p>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="fullName">الاسم الكامل</label>
            <input
              id="fullName"
              type="text"
              placeholder="مثال: محمد العلمي"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
              placeholder="6+ أحرف"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="switch-auth">
          <p>لديك حساب بالفعل؟ <Link to="/login">قم بتسجيل الدخول</Link></p>
        </div>
      </div>
    </div>
  );
}