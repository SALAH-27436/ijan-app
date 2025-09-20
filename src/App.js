// src/App.js (النسخة النهائية مع Navbar متجاوب)
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Home as HomeIcon, BookCopy, GraduationCap, Rocket, Link2, LogOut, User as UserIcon, Users, Menu, X } from 'lucide-react';
import Home from "./pages/Home";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Courses from "./pages/Courses";
import Professors from "./pages/Professors";
import Links from "./pages/Links";
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import Subjects from "./pages/Subjects";
import Lessons from "./pages/Lessons";
import UserProfilePage from './pages/UserProfilePage';
import SearchUsersPage from './pages/SearchUsersPage';
import "./App.css";

// --- مكون Navbar الجديد ---
function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { to: "/", icon: <HomeIcon size={24} />, text: "الرئيسية" },
    { to: "/courses", icon: <BookCopy size={24} />, text: "الدروس" },
    { to: "/professors", icon: <GraduationCap size={24} />, text: "الأساتذة" },
    { to: "/services", icon: <Rocket size={24} />, text: "الخدمات" },
    { to: "/links", icon: <Link2 size={24} />, text: "روابط" },
    { to: "/search-users", icon: <Users size={24} />, text: "بحث" },
  ];

  return (
    <>
      <nav className="main-navbar">
        <div className="nav-left">
          {/* زر الهمبرغر */}
          <button
            className="hamburger-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <div className="nav-logo">IJAN</div>
        </div>

        <div className="nav-center">
          <div className="nav-links">
            {navLinks.map((link) => (
              <NavLink
                to={link.to}
                key={link.to}
                className="nav-link-item"
                end
              >
                {link.icon}
                <span className="link-text">{link.text}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-profile-menu">
            <img
              src={profile?.avatar_url || "/avatars/default-avatar.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <strong>{profile?.full_name || user?.email}</strong>
                <small>{user?.email}</small>
              </div>
              <Link
                to={`/profile/${user?.id}`}
                className="dropdown-item"
              >
                <UserIcon size={16} /> ملفي الشخصي
              </Link>
              <button
                onClick={handleSignOut}
                className="dropdown-item logout"
              >
                <LogOut size={16} /> تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== القائمة الدائرية الجديدة ===== */}
      <div
        className={`circular-menu-container ${isMobileMenuOpen ? "open" : ""}`}
      >
        <div className="circular-menu">
          {navLinks.map((link, index) => (
            <NavLink
              to={link.to}
              key={link.to}
              className="menu-item"
              style={{ "--i": index }}
              onClick={closeMenu}
              end
            >
              {link.icon}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

// --- المكون الرئيسي App ---
function App() {
  const { session } = useAuth();

  if (!session) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/professors" element={<Professors />} />
            <Route path="/links" element={<Links />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/courses/:semester/:type" element={<Subjects />} />
            <Route path="/courses/:semester/:type/:subjectSlug" element={<Lessons />} />
            <Route path="/search-users" element={<SearchUsersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;