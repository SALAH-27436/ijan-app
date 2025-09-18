// src/pages/ServiceDetailPage.js (النسخة النهائية والمصححة)
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, MessageCircle, Star, Clock, Users, MapPin, Image as ImageIcon } from 'lucide-react';
import './ServiceDetailPage.css';

const LongText = ({ text }) => {
  if (!text) return null;
  // استبدال كل حرف "سطر جديد" بوسم <br />
  const formattedText = text.split('\n').map((str, index, array) => 
    index === array.length - 1 ? str : <React.Fragment key={index}>{str}<br /></React.Fragment>
  );
  return <p>{formattedText}</p>;
};

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching service details:", error);
        setError("لم نتمكن من العثور على هذه الخدمة.");
      } else {
        setService(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  if (loading) {
    return <div className="page-loader"><h1>جاري تحميل التفاصيل...</h1></div>;
  }

  if (error || !service) {
    return <div className="page-error"><h1>{error || "لم يتم العثور على الخدمة."}</h1></div>;
  }

  return (
    <div className="service-detail-page" dir="rtl">
      {/* ===== التغيير هنا: دمجنا المحتوى داخل صورة الغلاف ===== */}
      <header className="detail-header">
        <div className="cover-image">
          <div> {/* Container for text */}
            <nav className="breadcrumb">
              <Link to="/services">الخدمات</Link>
              <span>›</span>
              <Link to={`/services?category=${service.category}`}>{service.category}</Link>
              <span>›</span>
              <span>{service.title}</span>
            </nav>
            <h1>{service.title}</h1>
            <p>مقدمة بواسطة: <strong>{service.author}</strong></p>
          </div>
        </div>
      </header>

      <div className="detail-layout">
        <main className="main-content-detail">
          <h2>عن هذه الخدمة</h2>
          <LongText text={service.description_long || service.description} />
          
          {/* ===== معرض الصور (إذا كان موجودًا) ===== */}
          {Array.isArray(service.gallery_urls) && service.gallery_urls.length > 0 && (
            <div className="gallery-section">
              <h2><ImageIcon size={24} /> معرض الصور</h2>
              <div className="gallery-grid">
                {service.gallery_urls.map((url, index) => (
                  <a href={url} key={index} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`صورة من المعرض ${index + 1}`} loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          )}
          {/* ========================================= */}
          
        </main>

        <aside className="sidebar-detail">
          <div className="sidebar-card">
            <div className="price-section">
              {service.price ? (
                <>
                  <span className="price">{service.price}</span>
                  <span className="price-type">/ساعة</span>
                </>
              ) : (
                <span className="price">مجاني</span>
              )}
            </div>
            <div className="contact-info-section">
              {/* ===== عرض معلومات التواصل بالشكل الجديد ===== */}
              {service.contact_whatsapp && (
                <a href={`https://wa.me/${service.contact_whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-info-item whatsapp">
                  <MessageCircle size={20} />
                  <div>
                    <span className="info-label">واتساب</span>
                    <span className="info-value">{service.contact_whatsapp}</span>
                  </div>
                </a>
              )}
              {service.contact_email && (
                <a href={`mailto:${service.contact_email}`} className="contact-info-item email">
                  <Mail size={20} />
                  <div>
                    <span className="info-label">البريد الإلكتروني</span>
                    <span className="info-value">{service.contact_email}</span>
                  </div>
                </a>
              )}
              {service.location_url && (
                <a href={service.location_url} target="_blank" rel="noopener noreferrer" className="contact-info-item location">
                  <MapPin size={20} />
                  <div>
                    <span className="info-label">الموقع الجغرافي</span>
                    <span className="info-value">عرض على الخريطة</span>
                  </div>
                </a>
              )}
              {/* ============================================= */}
            </div>

            <div className="quick-info">
              <div><Star size={16} /> <span>4.8 (15 مراجعة)</span></div>
              <div><Clock size={16} /> <span>مدة الحصة: 60 دقيقة</span></div>
              <div><Users size={16} /> <span>فردي / جماعي</span></div>
            </div>
          </div>
        </aside>
      </div>

      <section className="reviews-section">
        <h2>التقييمات والمراجعات</h2>
        <p>لا توجد مراجعات لهذه الخدمة بعد.</p>
      </section>
    </div>
  );
}