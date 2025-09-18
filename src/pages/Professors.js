// src/pages/Professors.js (النسخة النهائية والديناميكية)
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient'; // استيراد Supabase
import { BookOpen, Search, UserCheck } from 'lucide-react';
import './Professors.css';

// مكون لعرض النصوص مع الحفاظ على فواصل الأسطر
const MultiLineText = ({ text }) => {
  if (!text) return null;
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

// --- مكون بطاقة الأستاذ (المحدث) ---
function ProfessorCard({ professor }) {
  return (
    <div className="professor-card">
      <div className="card-header">
        <img src={professor.avatar_url || '/avatars/default-avatar.png'} alt={`صورة ${professor.name}`} className="avatar" />
      </div>
      <div className="card-body">
        <h2 className="prof-name">{professor.name}</h2>
        <p className="prof-title">{professor.title}</p>
        <span className="prof-specialty">{professor.specialty}</span>
        <div className="prof-bio">
          <MultiLineText text={professor.bio} />
        </div>
        
        <div className="exam-style-box">
          <BookOpen size={20} className="icon" />
          <div>
            <strong>أسلوب الامتحانات:</strong>
            <MultiLineText text={professor.exam_style} />
          </div>
        </div>
      </div>
      {/* استبدال زر التواصل بمعلومة مفيدة */}
      <div className="card-footer">
        <div className="footer-info">
          <UserCheck size={18} />
          <MultiLineText text={professor.excellence} />
        </div>
      </div>
    </div>
  );
}

// --- المكون الرئيسي للصفحة ---
export default function Professors() {
  const [professorsData, setProfessorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .order('name', { ascending: true }); // ترتيب أبجدي حسب الاسم

      if (error) {
        console.error("Error fetching professors:", error);
      } else {
        setProfessorsData(data);
      }
      setLoading(false);
    };
    fetchProfessors();
  }, []);

  const filteredProfessors = useMemo(() => {
    return professorsData
      .filter(prof => {
        if (filter === 'all') return true;
        return prof.department === filter;
      })
      .filter(prof => {
        return prof.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [searchTerm, filter, professorsData]);

  return (
    <div className="professors-page" dir="rtl">
      <header className="professors-hero">
        <h1>👨‍🏫 دليل الأساتذة</h1>
        <p>تعرف على أساتذتك، تخصصاتهم، وأساليبهم الأكاديمية.</p>
      </header>
      
      <div className="filters-container">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="ابحث عن أستاذ بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="department-filter">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>الكل</button>
          <button onClick={() => setFilter('عام')} className={filter === 'عام' ? 'active' : ''}>القانون العام</button>
          <button onClick={() => setFilter('خاص')} className={filter === 'خاص' ? 'active' : ''}>القانون الخاص</button>
        </div>
      </div>

      <main className="professors-grid">
        {loading ? (
          <p className="loading-text">جاري تحميل بيانات الأساتذة...</p>
        ) : filteredProfessors.length > 0 ? (
          filteredProfessors.map(prof => (
            <ProfessorCard key={prof.id} professor={prof} />
          ))
        ) : (
          <p className="no-results">لا توجد نتائج تطابق بحثك.</p>
        )}
      </main>
    </div>
  );
}