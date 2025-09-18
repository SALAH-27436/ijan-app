// src/pages/SearchUsersPage.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './SearchUsersPage.css';

// --- مكون بطاقة نتيجة البحث ---
const UserResultCard = ({ profile }) => (
  <Link to={`/profile/${profile.id}`} className="user-card-link">
    <div className="user-card">
      <img src={profile.avatar_url} alt={`Avatar for ${profile.full_name}`} className="user-avatar-search" />
      <div className="user-info">
        <p className="user-name">{profile.full_name}</p>
        <p className="user-handle">@{profile.full_name.replace(/\s+/g, '').toLowerCase()}</p>
      </div>
    </div>
  </Link>
);

// --- المكون الرئيسي للصفحة ---
export default function SearchUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialUsers, setInitialUsers] = useState([]);

  // جلب أحدث المستخدمين عند تحميل الصفحة
  useEffect(() => {
    const fetchInitialUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) console.error("Error fetching initial users:", error);
      else setInitialUsers(data);
    };
    fetchInitialUsers();
  }, []);

  // البحث عندما يتغير searchTerm
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${searchTerm}%`) // البحث عن أي اسم يحتوي على searchTerm
        .limit(10);
      
      if (error) {
        console.error("Error searching users:", error);
      } else {
        setResults(data);
      }
      setLoading(false);
    };

    // استخدام Debouncing لتجنب إرسال طلبات كثيرة جدًا
    const debounceTimeout = setTimeout(() => {
      searchUsers();
    }, 300); // انتظر 300ms بعد توقف المستخدم عن الكتابة

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <div className="search-page-container" dir="rtl">
      <header className="search-hero">
        <h1>ابحث عن زملائك</h1>
        <p>تواصل مع الطلاب والأساتذة في مجتمع IJAN.</p>
        <div className="search-input-container">
          <Search size={22} className="search-page-icon" />
          <input
            type="text"
            placeholder="اكتب اسمًا للبحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="results-container">
        {loading && <p>جاري البحث...</p>}
        
        {!loading && searchTerm.length > 1 && results.length === 0 && (
          <p>لم يتم العثور على نتائج للبحث عن "{searchTerm}".</p>
        )}

        {/* عرض نتائج البحث أو المستخدمين الأوليين */}
        {(results.length > 0 ? results : initialUsers).map(profile => (
          <UserResultCard key={profile.id} profile={profile} />
        ))}
      </main>
    </div>
  );
}