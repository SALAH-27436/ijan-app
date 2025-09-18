// src/pages/Home.js (النسخة النظيفة)
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
// ===== استيراد المكونات من الملف الجديد =====
import { CreatePost, PostCard } from '../components/FeedComponents'; 
import './Home.css';

// --- المكون الرئيسي للصفحة ---
export default function Home() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`*, likes(user_id), comments(*)`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleNewPostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
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
  
  return (
    <div className="home-page-container-unique" dir="rtl">
      <main className="feed-container-unique">
        {user && <CreatePost user={user} profile={profile} onPostCreated={handleNewPostCreated} />}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#65676b' }}>جاري تحميل المنشورات...</p>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} onDelete={handleDeletePost} onUpdate={handlePostUpdate} />)
        )}
      </main>
    </div>
  );
}