// src/pages/UserProfilePage.js (النسخة المبسطة مع Dicebear)
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
// import { Camera } from 'lucide-react'; // لم نعد بحاجة إليها
import './UserProfilePage.css';
import { PostCard } from '../components/FeedComponents';

export default function UserProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth(); // لم نعد بحاجة لـ refreshUserProfile
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwner = currentUser?.id === userId;

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (profileError) console.error("Error fetching profile:", profileError);
    else setProfile(profileData);
    
    const { data: postsData, error: postsError } = await supabase.from('posts').select('*, likes(user_id), comments(*)').eq('user_id', userId).order('created_at', { ascending: false });
    if (postsError) console.error("Error fetching posts:", postsError);
    else setPosts(postsData);
    
    setLoading(false);
  }, [userId]); // تعتمد فقط على userId

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId, fetchProfileData]);

  const handleDeletePost = async (postId) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنشور؟")) {
      const { error } = await supabase.from('posts').delete().match({ id: postId });
      if (error) {
        console.error('Error deleting post:', error);
      } else {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      }
    }
  };
  
  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p)
    );
  };

  if (loading) return <div className="page-loader"><h1>جاري التحميل...</h1></div>;
  if (!profile) return ( <div className="page-error"><h1>لم يتم العثور على المستخدم.</h1></div> );

  return (
    <div className="profile-page-container">
      <header className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info-bar">
          <div className="avatar-container">
            <img src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name}`} alt="Profile Avatar" className="profile-page-avatar" />
            {/* أزلنا زر تعديل الصورة */}
          </div>
          <div className="profile-name-section">
            <h1>{profile.full_name}</h1>
            <p>@{profile.full_name.replace(/\s+/g, '').toLowerCase()}</p>
          </div>
        </div>
      </header>
      <main className="profile-content-layout">
        <aside className="profile-sidebar"></aside>
        <div className="profile-feed">
          <h2>منشورات {profile.full_name}</h2>
          {posts.map(post => (<PostCard key={post.id} post={post} onDelete={handleDeletePost} onUpdate={handlePostUpdate} />))}
        </div>
      </main>
    </div>
  );
}