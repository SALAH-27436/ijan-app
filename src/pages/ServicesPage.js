// src/pages/ServicesPage.js (النسخة النهائية والكاملة)
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Search, Briefcase, GraduationCap, FileText, Building, X, Copy, MessageCircle, Mail } from 'lucide-react';
import './ServicesPage.css';

// --- مكون النافذة المنبثقة (Modal) ---
// في ملف src/pages/ServicesPage.js

// --- مكون النافذة المنبثقة (Modal) - مع التعديل النهائي ---
const SubmissionModal = ({ type, onClose }) => {
  const isPremium = type === 'premium';
  
  const premiumDetails = `
- نوع الخدمة: (مؤسسة ، مركز دعم، أستاذ(ة) خاص(ة)، طالب(ة) مساعد(ة) .... )
- عنوان الخدمة: (عنوان محدد: حصص دعم في الاقتصاد - مثلا)
- صاحب(ة) الخدمة: (ذمحمد، مؤسسة المساري، الطالبة صباح، ....)
- وصف قصير: (من الافضل عدم تجاوز 12 كلمة) حول الخدمة المقدمة
- هاشتاغات (Tags): (من 3 إلى 6) تعبر عن مميزاتكم
- السعر: يمكن تحديده بالضبط او (إبتداءا من X0X درهم)
--- التفاصيل ---
- رقم الواتساب:
- البريد الإلكتروني:
- الموقع الجغرافي: (رابط Google Maps إن توفر)
- الوصف الكامل للخدمة:  بالتفاصيل
- صور: (في حدود 4 صور) إختيارية
  `;
  
  const freeDetails = `
- عنوان المقال: (عنوان محدد)
- صاحب(ة) المقال: (ذمحمد، مؤسسة المساري، الطالبة صباح، ....)
- وصف قصير للمقال: من الافضل عدم تجاوز 12 كلمة(حول المقال)
- الهاشتكات(Tags): من 3 الى 6، تعبر عن مجالكم
--- التفاصيل ---
- رقم الواتساب : اختياري
- البريد الإلكتروني  : اختياري
- المقال الكامل
- صور: في حدود 4 صور (إختيارية)
  `;
  
  const textToCopy = isPremium ? premiumDetails.trim() : freeDetails.trim();
  const contactEmail = 'contact.ijan@example.com';
  const contactWhatsapp = '0610101010'; // صيغة عرض أفضل

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    alert('تم نسخ قائمة المعلومات إلى الحافظة!');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}><X size={24} /></button>
        <h2>{isPremium ? 'إضافة خدمة مميزة' : 'إضافة خدمة مجانية (مقال)'}</h2>
        <p>يرجى إرسال المعلومات التالية إلى أحد قنوات التواصل أدناه. يمكنك نسخ القائمة لتسهيل العملية.</p>
        
        <div className="details-box">
          <pre>{textToCopy}</pre>
          <button className="copy-btn" onClick={copyToClipboard} title="نسخ">
            <Copy size={16} />
            <span>نسخ</span>
          </button>
        </div>
        
        <h3>قنوات التواصل:</h3>
        {/* ===== التعديل الرئيسي هنا ===== */}
        <div className="contact-info-section-modal">
          <div className="contact-info-item-modal whatsapp">
            <MessageCircle size={20} />
            <div>
              <span className="info-label">واتساب</span>
              <span className="info-value">{contactWhatsapp}</span>
            </div>
          </div>
          <div className="contact-info-item-modal email">
            <Mail size={20} />
            <div>
              <span className="info-label">البريد الإلكتروني</span>
              <span className="info-value">{contactEmail}</span>
            </div>
          </div>
        </div>
        {/* =============================== */}
      </div>
    </div>
  );
};

// --- بيانات واجهة المستخدم (ثابتة) ---
const categories = [
  { slug: 'all', name: 'جميع الخدمات', icon: <Briefcase size={18} /> },
  { slug: 'tutors', name: 'أساتذة خصوصيين', icon: <GraduationCap size={18} /> },
  { slug: 'institutions', name: 'مؤسسات تكوين', icon: <Building size={18} /> },
  { slug: 'Centers ', name: 'مراكز دعم', icon: <Building size={18} /> },
  { slug: 'articles', name: 'مقالات علمية', icon: <FileText size={18} /> },
];

// --- مكون بطاقة الخدمة ---
const ServiceCard = ({ service }) => (
  <div className={`service-card ${service.type}`}>
    <div className="card-badge">{service.type === 'paid' ? 'مميزة' : 'مجانية'}</div>
    <div className="card-header-service">
      {service.category === 'tutors' && <GraduationCap size={40} className="header-icon" />}
      {service.category === 'institutions' && <Building size={40} className="header-icon" />}
      {service.category === 'articles' && <FileText size={40} className="header-icon" />}
      {service.category === 'Centers' && <Building size={40} className="header-icon" />}
    </div>
    <div className="card-body-service">
      <h3 className="service-title">{service.title}</h3>
      <p className="service-author">بواسطة: {service.author}</p>
      <p className="service-description">{service.description}</p>
      <div className="tags-container">
        {Array.isArray(service.tags) && service.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
    <div className="card-footer-service">
      {service.price && <span className="price-tag">{service.price}</span>}
      <Link to={`/services/${service.id}`} className="details-btn">
        معرفة المزيد
      </Link>
    </div>
  </div>
);

// --- المكون الرئيسي للصفحة ---
export default function ServicesPage() {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching services:", error);
      } else {
        setServicesData(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return servicesData
      .filter(service => activeCategory === 'all' || service.category === activeCategory)
      .filter(service => service.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, activeCategory, servicesData]);

  return (
    <div className="services-page-container" dir="rtl">
      <header className="services-hero">
        <h1>📌 منصة الخدمات الجامعية</h1>
        <p>استكشف، تعلم، وتطور. مكان يجمع بين الأساتذة، المؤسسات، والطلبة لتبادل المعرفة والخدمات.</p>
      </header>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث عن خدمة، أستاذ، أو مقال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`tab-btn ${activeCategory === cat.slug ? 'active' : ''}`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <main className="services-grid">
        {loading ? (
          <p className="loading-text">جاري تحميل الخدمات...</p>
        ) : filteredServices.length > 0 ? (
          filteredServices.map(service => <ServiceCard key={service.id} service={service} />)
        ) : (
          <p className="no-results-services">لا توجد خدمات تطابق بحثك حاليًا.</p>
        )}
      </main>

      <footer className="services-cta">
        <h2>هل ترغب في نشر خدمتك هنا؟</h2>
        <p>انضم إلى منصتنا وشارك خبراتك مع آلاف الطلبة.</p>
        <div className="cta-buttons">
          <button onClick={() => setModalType('free')} className="cta-btn free">إضافة خدمة مجانية</button>
          <button onClick={() => setModalType('premium')} className="cta-btn premium">إضافة خدمة مميزة</button>
        </div>
      </footer>
      
      {modalType && <SubmissionModal type={modalType} onClose={() => setModalType(null)} />}
    </div>
  );
}