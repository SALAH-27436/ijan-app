// src/components/FeedComponents.js (النسخة النهائية والكاملة حقًا هذه المرة)
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, MoreVertical, Trash2, Edit } from 'lucide-react';

// --- مكون لدعم فواصل الأسطر ---
const MultiLineText = ({ text }) => {
  if (!text) return null;
  return text.split('\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index !== array.length - 1 && <br />}
    </React.Fragment>
  ));
};

// --- Hook لمراقبة التمرير ---
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const updatePosition = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  return scrollPosition;
};

// --- مكون كتابة المنشور ---
export const CreatePost = ({ user, profile, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (scrollPosition > 150 && !isLoading && content === '' && title === '') {
      setIsExpanded(false);
    }
  }, [scrollPosition, isLoading, content, title]);

  const handlePost = async () => {
    setError('');
    if (content.trim().length < 3) {
      alert("محتوى المنشور قصير جدًا.");
      return;
    }
    setIsLoading(true);
    const postData = {
      title: title.trim(),
      content: content.trim(),
      user_id: user.id,
      user_full_name: profile?.full_name || user.email,
      user_avatar_url: profile?.avatar_url || '/avatars/default-avatar.png',
    };
    const { data: newPost, error: insertError } = await supabase.from('posts').insert(postData).select().single();
    if (insertError) {
      console.error('Error creating post:', insertError);
      setError('حدث خطأ أثناء النشر، يرجى المحاولة مرة أخرى.');
    } else {
      const postWithRelations = { ...newPost, likes: [], comments: [] };
      onPostCreated(postWithRelations);
      setTitle('');
      setContent('');
    }
    setIsLoading(false);
  };

  if (!isExpanded) {
    const handleExpand = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsExpanded(true);
    };
    return (
      <div className="create-post-unique shrunk" onClick={handleExpand}>
        <p>💡 بنات أفكارك...</p>
      </div>
    );
  }

  return (
    <div className="create-post-unique expanded">
      <input type="text" className="post-title-input" placeholder="عنوان المنشور ..." value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading} />
      <textarea placeholder={`بنات أفكارك هنا ${profile?.full_name || 'طالبنا'}؟`} value={content} onChange={(e) => setContent(e.target.value)} disabled={isLoading} />
      <div className="create-post-footer">
        {error && <p className="error-message-post">{error}</p>}
        <button onClick={handlePost} className="publish-btn" disabled={isLoading}><Send size={18} /><span>{isLoading ? 'جاري النشر...' : 'نشر'}</span></button>
      </div>
    </div>
  );
};

// --- مكون التعليق الواحد ---
const Comment = ({ comment, onDeleteComment }) => {
  const { user } = useAuth();
  const isAuthor = user && user.id === comment.user_id;

  return (
    <div className="comment">
      <img src={comment.user_avatar_url || '/avatars/default-avatar.png'} alt="avatar" className="comment-avatar" />
      <div className="comment-body">
        <div className="comment-header">
          <p className="comment-author">{comment.user_full_name}</p>
          {isAuthor && (
            <button onClick={() => onDeleteComment(comment.id)} className="delete-comment-btn" title="حذف التعليق">
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <p className="comment-content">{comment.content}</p>
      </div>
    </div>
  );
};

// --- مكون المنشور الواحد ---
export const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title || '');
  const [editedContent, setEditedContent] = useState(post.content);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(post.likes.length);
  const [userHasLiked, setUserHasLiked] = useState(post.likes.some(like => like.user_id === user?.id));
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleLike = async () => {
    if (!user) {
      alert("يجب تسجيل الدخول للإعجاب بمنشور.");
      return;
    }
    if (userHasLiked) {
      setUserHasLiked(false);
      setLikes(prev => prev - 1);
      await supabase.from('likes').delete().match({ user_id: user.id, post_id: post.id });
    } else {
      setUserHasLiked(true);
      setLikes(prev => prev + 1);
      await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
    }
  };
    
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim().length < 1 || !user) return;
    setIsSubmittingComment(true);
    const commentData = {
      content: newComment,
      post_id: post.id,
      user_id: user.id,
      user_full_name: profile?.full_name || user.email,
      user_avatar_url: profile?.avatar_url || '/avatars/default-avatar.png',
    };
    const { data, error } = await supabase.from('comments').insert(commentData).select().single();
    if (error) {
      console.error("Error submitting comment:", error);
      alert("حدث خطأ أثناء نشر التعليق.");
    } else {
      setComments(prevComments => [...prevComments, data]);
      setNewComment('');
    }
    setIsSubmittingComment(false);
  };
  
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
      const { error } = await supabase.from('comments').delete().match({ id: commentId });
      if (error) {
        console.error("Error deleting comment:", error);
      } else {
        setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      }
    }
  };

  const handleUpdatePost = async () => {
    if (editedContent.trim().length < 3) {
      alert("محتوى المنشور قصير جدًا.");
      return;
    }
    const { data: updatedPost, error } = await supabase.from('posts').update({ title: editedTitle.trim(), content: editedContent.trim() }).eq('id', post.id).select().single();
    if (error) {
      console.error("Error updating post:", error);
      alert("حدث خطأ أثناء تعديل المنشور.");
    } else {
      onUpdate({ ...post, ...updatedPost });
      setIsEditing(false);
    }
  };

  const isAuthor = user && user.id === post.user_id;
  const CHARACTER_LIMIT = 300;
  const isLongPost = post.content.length > CHARACTER_LIMIT;
  const displayedContent = isLongPost && !isExpanded ? `${post.content.substring(0, CHARACTER_LIMIT)}...` : post.content;

  if (isEditing) {
    return (
      <div className="post-card-unique editing">
        <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="post-title-input" />
        <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="post-content-textarea" />
        <div className="edit-actions">
          <button onClick={() => setIsEditing(false)} className="cancel-btn">إلغاء</button>
          <button onClick={handleUpdatePost} className="save-btn">حفظ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-card-unique">
      <div className="post-header">
        <Link to={`/profile/${post.user_id}`}><img src={post.user_avatar_url || '/avatars/default-avatar.png'} alt="Author Avatar" className="author-avatar" /></Link>
        <div>
          <Link to={`/profile/${post.user_id}`} className="author-link"><p className="author-name">{post.user_full_name || 'مستخدم'}</p></Link>
          <p className="post-timestamp">{new Date(post.created_at).toLocaleString('ar-EG')}</p>
        </div>
        {isAuthor && (
          <div className="post-menu">
            <MoreVertical size={20} />
            <div className="dropdown-content">
              <button onClick={() => setIsEditing(true)}><Edit size={16} /> تعديل</button>
              <button onClick={() => onDelete(post.id)} className="delete-btn"><Trash2 size={16} /> حذف</button>
            </div>
          </div>
        )}
      </div>
      <div className="post-content">
        {post.title && <h3 className="post-title">{post.title}</h3>}
        <div className="post-text"><MultiLineText text={displayedContent} /></div>
        {isLongPost && (<button onClick={() => setIsExpanded(!isExpanded)} className="read-more-btn">{isExpanded ? 'عرض أقل' : 'قراءة المزيد'}</button>)}
      </div>
      <div className="post-stats">
        <span>{likes} مزيونين</span>
        <span>{comments.length} دمهاودات</span>
      </div>
      <div className="post-actions-unique">
        <button onClick={handleLike} className={`action-btn-unique ${userHasLiked ? 'liked' : ''}`}><Heart size={20} /> <span>{userHasLiked ? 'مزيييون' : 'واش هدشي مزيون؟'}</span></button>
        <button onClick={() => setShowComments(!showComments)} className="action-btn-unique"><MessageCircle size={20} /> <span>أجي نتهاودو</span></button>
      </div>
      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <img src={profile?.avatar_url || '/avatars/default-avatar.png'} alt="Your avatar" className="comment-form-avatar" />
            <input
              type="text"
              placeholder="اكتب تعليقك..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={isSubmittingComment}>
              <Send size={16} />
            </button>
          </form>
          <div className="comments-list">
            {comments.map(comment => <Comment key={comment.id} comment={comment} onDeleteComment={handleDeleteComment} />)}
          </div>
        </div>
      )}
    </div>
  );
};