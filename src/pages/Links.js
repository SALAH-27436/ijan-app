// src/pages/Links.js (النسخة الديناميكية)
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient'; // استيراد Supabase
import { ExternalLink, Search } from 'lucide-react';
import './Links.css';

// --- مكون بطاقة الرابط (لا تغيير هنا) ---
function LinkCard({ link }) {
  return (
    <div className="link-card">
      <div className="card-icon">{link.icon}</div>
      <h3 className="card-title">{link.title}</h3>
      <p className="card-description">{link.description}</p>
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="card-button">
        <ExternalLink size={16} />
        <span>ولوج المنصة</span>
      </a>
    </div>
  );
}

// --- المكون الرئيسي للصفحة ---
export default function Links() {
  const [linksData, setLinksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('college_links')
        .select('*')
        .order('order', { ascending: true, nullsFirst: false }) // للترتيب حسب الفئة
        .order('created_at', { ascending: true }); // ثم الترتيب حسب تاريخ الإنشاء

      if (error) {
        console.error("Error fetching links:", error);
      } else {
        setLinksData(data);
      }
      setLoading(false);
    };
    fetchLinks();
  }, []);

  const groupedAndFilteredLinks = useMemo(() => {
    const filtered = linksData.filter(link =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.reduce((acc, link) => {
      const category = link.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(link);
      return acc;
    }, {});
  }, [searchTerm, linksData]);

  return (
    <div className="links-page" dir="rtl">
      <header className="links-hero">
        <h1>🎓 روابط تهم طلبة الكلية</h1>
        <p>جميع الروابط الأساسية بين يديك، بلا بحث طويل ولا تضييع وقت.</p>
      </header>

      <div className="search-container">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="ابحث عن خدمة أو رابط..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <main className="links-content">
        {loading ? (
          <p className="loading-text">جاري تحميل الروابط...</p>
        ) : Object.keys(groupedAndFilteredLinks).length > 0 ? (
          Object.entries(groupedAndFilteredLinks).map(([category, links]) => (
            <section key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="links-grid">
                {links.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <p className="no-results">لا توجد روابط تطابق بحثك.</p>
        )}
      </main>

      <footer className="links-footer">
        <p className="cta-text">نجعل مسارك أسهل… رابط واحد يكفي ✨</p>
        <p className="joke-text">هل لديك رابط مهم؟ يمكنك اقتراحه على إدارة التطبيق!</p>
      </footer>
    </div>
  );
}