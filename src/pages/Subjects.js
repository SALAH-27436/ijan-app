// src/pages/Subjects.js (النسخة الديناميكية من Supabase)
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Subjects.css";

export default function Subjects() {
  const { semester, type } = useParams();
  const [specialization, setSpecialization] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      console.log(`Fetching subjects for semester: ${semester}, type: ${type}`); // تتبع 1
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('specializations')
        .select(`
          name,
          subjects (
            id,
            name,
            slug
          )
        `)
        .eq('slug', type)
        .eq('semester_id', semester)
        .single();

      if (fetchError) {
        console.error("Error fetching subjects from Supabase:", fetchError); // تتبع 2
        setError("حدث خطأ أثناء جلب المواد.");
      } else if (data) {
        console.log("Data fetched successfully:", data); // تتبع 3
        setSpecialization(data);
        setSubjects(data.subjects || []); // تأكد من أنها مصفوفة
      } else {
        console.warn("No data found for this semester/type combination."); // تتبع 4
        setError("لم يتم العثور على تخصص يطابق هذه المعايير.");
      }
      setLoading(false);
    };

    if (semester && type) {
      fetchSubjects();
    } else {
        setLoading(false);
        setError("معلمات السداسي أو التخصص مفقودة.");
    }
  }, [semester, type]);
  if (loading) {
    return <div className="page-loader"><h1>جاري تحميل المواد...</h1></div>;
  }
  
  if (error) {
    return <div className="page-error"><h1>{error}</h1></div>;
  }

  return (
    <div className="subjects-page" dir="rtl">
      <nav className="breadcrumb">
        <Link to="/">🏠 الرئيسية</Link>
        <span>›</span>
        <Link to="/courses">📚 الدروس</Link>
        <span>›</span>
        {/* 2. عرض اسم التخصص الديناميكي من قاعدة البيانات */}
        <span>{specialization ? specialization.name : '...'}</span>
      </nav>

      <header className="subjects-hero">
        <h1>مواد تخصص: {specialization ? specialization.name : '...'}</h1>
        <p>السداسي: <strong>{semester.toUpperCase()}</strong></p>
      </header>

      <main className="subjects-grid">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <Link
              key={subject.id}
              // ===== التعديل هنا: استخدام slug بدلاً من name =====
              to={`/courses/${semester}/${type}/${subject.slug}`}
              className="subject-card"
            >
              <h3>{subject.name}</h3>
              <span className="arrow">→</span>
            </Link>
          ))
        ) : (
          <div className="empty-state-subjects">
            <p>لا توجد مواد متاحة لهذا التخصص حاليًا.</p>
            <Link to="/courses" className="btn-back">العودة للسداسيات</Link>
          </div>
        )}
      </main>
    </div>
  );
}