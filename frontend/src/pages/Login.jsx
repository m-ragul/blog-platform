import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs for auth page */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-electric-violet opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue opacity-10 blur-[100px] rounded-full"></div>

      <div className="max-w-md w-full glass-card p-10 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Welcome Back.</h2>
          <p className="text-slate-400 font-medium">Continue your creative journey.</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-2">
          <Input
            label="Email or Username"
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            placeholder="johndoe@example.com"
            autoComplete="new-password"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full !py-4 shadow-xl"
              loading={loading}
            >
              Sign In to BLOG.
            </Button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 font-medium">
            New here?{' '}
            <Link to="/register" className="text-electric-blue hover:text-white transition-colors font-bold ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;