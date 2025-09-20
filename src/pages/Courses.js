// src/pages/Courses.js (النسخة الديناميكية من Supabase)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Courses.css";

export default function Courses() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSemester, setOpenSemester] = useState(null);

  useEffect(() => {
    const fetchSemestersAndSpecializations = async () => {
      setLoading(true);
      setError(null);

      // 1. جلب جميع السداسيات مع التخصصات المرتبطة بها في استعلام واحد
      const { data, error } = await supabase
        .from('semesters')
        .select(`
          id,
          name,
          level,
          order,
          specializations (
            id,
            slug,
            name
          )
        `)
        .order('order', { ascending: true }); // ترتيب السداسيات

      if (error) {
        console.error("Error fetching data:", error);
        setError("حدث خطأ أثناء جلب البيانات.");
      } else {
        setSemesters(data);
      }
      setLoading(false);
    };

    fetchSemestersAndSpecializations();
  }, []); // يعمل مرة واحدة فقط عند تحميل الصفحة

  const toggleSemester = (id) => {
    setOpenSemester(openSemester === id ? null : id);
  };
  
  if (loading) {
    return <div className="page-loader"><h1>جاري تحميل السداسيات...</h1></div>;
  }
  
  if (error) {
    return <div className="page-error"><h1>{error}</h1></div>;
  }

  return (
    <div className="courses-page" dir="rtl">
      <header className="courses-hero">
        <span className="hero-icon">📚</span>
        <h1>صفحة الدروس</h1>
        <p>اختر السداسي الذي تريده للوصول إلى المواد والموارد.</p>
      </header>

      <main className="semesters-container">
        {semesters.map((sem) => (
          <div key={sem.id} className="semester-item">
            <button
              onClick={() => toggleSemester(sem.id)}
              className={`semester-button ${openSemester === sem.id ? 'active' : ''}`}
            >
              {sem.name}
            </button>

            {/* 2. عرض القائمة المنسدلة بناءً على البيانات القادمة من Supabase */}
            {openSemester === sem.id && (
              <div className="dropdown-menu">
                {sem.specializations.length > 0 ? (
                  sem.specializations.map((spec) => (
                    <Link
                      key={spec.id}
                      // 3. بناء الرابط الصحيح (semester.id هو 's1', 'm1' etc.)
                      // (specialization.id هو رقم، يمكننا استخدام slug ليكون أفضل)
                      to={`/courses/${sem.id}/${spec.slug}`}
                      className="dropdown-link"
                    >
                      {spec.name}
                    </Link>
                  ))
                ) : (
                  <p className="no-specializations">لا توجد تخصصات متاحة لهذا السداسي بعد.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}