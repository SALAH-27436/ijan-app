// src/pages/Lessons.js (النسخة النهائية والمحسنة)
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Lessons.css";

// --- إعدادات فئات الموارد (ثابتة) ---
const categoryMap = {
  books: { title: "الكتب", icon: "📚" },
  summaries: { title: "الملخصات", icon: "📝" },
  exams: { title: "الامتحانات السابقة", icon: "📄" },
  research: { title: "البحوث", icon: "🔬" },
  presentations: { title: "العروض", icon: "📽️" },
};

// --- مكون الأكورديون لكل فئة ---
function ResourceCategory({ title, icon, items }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);
  
  // تعديل بسيط: استخدام الرابط الكامل مباشرة
  // لم نعد بحاجة لـ formatFilePath

  return (
    <div className="category-card">
      <button className={`category-header ${isOpen ? 'open' : ''}`} onClick={toggleOpen} aria-expanded={isOpen}>
        <div className="header-content">
          <span className="header-icon">{icon}</span>
          <span className="header-title">{title}</span>
          <span className="item-count">({items.length})</span>
        </div>
        <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
      </button>

      <div className={`category-content ${isOpen ? 'open' : ''}`}>
        <ul className="resource-item-list">
          {items.map((item) => (
            <li key={item.id} className="resource-item">
              <div className="item-info">
                <div className="item-text">
                  <p className="item-title">{item.title}</p>
                  <p className="item-description">{item.description}</p>
                </div>
              </div>
              <div className="item-actions">
                <a className="btn btn-view" href={item.file_url} target="_blank" rel="noopener noreferrer">عرض</a>
                <a className="btn btn-download" href={item.file_url} download>تحميل</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- المكون الرئيسي للصفحة ---
export default function Lessons() {
  const { semester, type, subjectSlug } = useParams();
  const [subjectName, setSubjectName] = useState(''); // <-- حالة جديدة لاسم المادة
  const [resources, setResources] = useState([]);
  const [groupedResources, setGroupedResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('subjects')
        .select(`
          name,
          resources ( * )
        `)
        .eq('slug', subjectSlug)
        .single();
      
      if (error || !data) {
        console.error("Error fetching resources:", error);
        setError("لم نتمكن من العثور على موارد لهذه المادة.");
      } else {
        setSubjectName(data.name); // <-- تخزين الاسم الكامل للمادة
        const fetchedResources = data.resources || [];
        setResources(fetchedResources);
        
        const grouped = fetchedResources.reduce((acc, resource) => {
          const category = resource.category || 'other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(resource);
          return acc;
        }, {});
        setGroupedResources(grouped);
      }
      setLoading(false);
    };

    if (subjectSlug) {
      fetchResources();
    }
  }, [subjectSlug]);

  if (loading) {
    return <div className="page-loader"><h1>جاري تحميل الموارد...</h1></div>;
  }
  
  if (error) {
    return <div className="page-error"><h1>{error}</h1></div>;
  }
  
  return (
    <div className="lessons-page" dir="rtl">
      <nav className="breadcrumb">
        <Link to="/">🏠 الرئيسية</Link>
        <span>›</span>
        <Link to="/courses">📚 الدروس</Link>
        <span>›</span>
        <Link to={`/courses/${semester}/${type}`}>{type.includes('master') ? 'الماسترات' : 'التخصصات'}</Link>
        <span>›</span>
        {/* ===== التعديل هنا: عرض الاسم الكامل ===== */}
        <span>{subjectName}</span>
      </nav>

      <header className="lesson-hero">
        <div>
          {/* ===== التعديل هنا: عرض الاسم الكامل ===== */}
          <h1>مادة: {subjectName}</h1>
          <p className="subtitle">كل ما تحتاجه من كتب، ملخصات، وامتحانات في مكان واحد.</p>
        </div>
      </header>

      <main>
        {resources.length > 0 ? (
          <section className="category-accordion">
            {Object.keys(categoryMap).map((categoryKey) => (
              <ResourceCategory
                key={categoryKey}
                title={categoryMap[categoryKey].title}
                icon={categoryMap[categoryKey].icon}
                items={groupedResources[categoryKey]}
              />
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <div className="empty-illustration">🗂️</div>
            <h2>لا توجد موارد لهذه المادة بعد</h2>
            <p>نعمل على إضافة المحتوى قريبًا.</p>
          </section>
        )}
      </main>
    </div>
  );
}