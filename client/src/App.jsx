// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link, useNavigate } from 'react-router-dom';
import logo from './assets/final.png';
import { Home, Post } from './pages';
import Login from './pages/login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import VerifyCode from './pages/VerifyCode';
import Upgrade from './pages/Upgrade';


const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full backdrop-blur-md bg-white/80 dark:bg-gray-900 dark:text-white shadow-md sticky top-0 z-50 flex justify-between items-center px-6 py-4">
      <Link to="/">
        <img src={logo} alt="logo" className="w-52 h-auto object-contain" />
      </Link>

      <div className="flex items-center gap-4">
        

        {user ? (
          <>
            <span className="bg-white dark:bg-gray-800 border border-[#6469ff] text-[#6469ff] hover:bg-[#6469ff] hover:text-white transition text-sm px-4 py-2 rounded-xl shadow">
              Hi, {user.name?.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-xl shadow transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white dark:bg-gray-800 border border-[#6469ff] text-[#6469ff] hover:bg-[#6469ff] hover:text-white transition text-sm px-4 py-2 rounded-xl shadow"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white dark:bg-gray-800 border border-[#6469ff] text-[#6469ff] hover:bg-[#6469ff] hover:text-white transition text-sm px-4 py-2 rounded-xl shadow"
            >
              Signup
            </Link>
          </>
        )}

        <Link
          to="/post"
          className="bg-[#6469ff] hover:bg-[#4e53d2] transition text-white text-sm px-5 py-2 rounded-xl shadow"
        >
          Create
        </Link>

        <Link
          to="/upgrade"
          className="bg-white dark:bg-gray-800 border border-[#6469ff] text-[#6469ff] hover:bg-[#6469ff] hover:text-white transition text-sm px-4 py-2 rounded-xl shadow"
        >
          Upgrade to Premium
        </Link>
      </div>
    </header>
  );
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0f4ff] to-[#ffffff] dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white font-sans">
        <Header />

        {/* Main Content */}
        <main className="flex-grow px-4 sm:px-8 py-8 bg-[#f9fafe] dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/post"
                element={
                  <PrivateRoute>
                    <Post />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-code" element={<VerifyCode />} />
              <Route path="/upgrade" element={<Upgrade />} />
            </Routes>
          </div>
        </main>
      </div>
    
  );
};

export default App;
