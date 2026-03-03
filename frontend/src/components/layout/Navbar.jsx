import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-4 z-50 mx-4 lg:mx-auto max-w-7xl">
      <div className="glass-card px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter text-gradient">
            BLOG.
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="nav-link font-medium"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="nav-link flex items-center font-medium"
                >
                  <FaPlusCircle className="mr-2 text-electric-blue" />
                  Create
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-3 group px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-electric-violet to-electric-blue text-white rounded-lg flex items-center justify-center font-bold shadow-lg shadow-electric-violet/20 group-hover:scale-110 transition-transform">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{user?.username}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-52 glass-card py-2 border-white/10 ring-1 ring-black/20 animate-in fade-in slide-in-from-top-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaUser className="mr-3 text-electric-blue" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all font-medium"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-linear-to-r from-electric-violet to-electric-blue text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-electric-violet/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;