import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('Registration successful! Welcome!');
      navigate('/');
    } catch (error) {
      const errorData = error.response?.data;
      if (typeof errorData === 'object' && !errorData.message) {
        // Validation errors from backend
        setErrors(errorData);
      } else {
        toast.error(errorData?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs for auth page */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-electric-violet opacity-10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-electric-blue opacity-10 blur-[100px] rounded-full"></div>

      <div className="max-w-md w-full glass-card p-10 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Join BLOG.</h2>
          <p className="text-slate-400 font-medium">Start sharing your story today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-1">
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="johndoe"
            error={errors.username}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose something strong"
            error={errors.password}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat for safety"
            error={errors.confirmPassword}
            required
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full !py-4 shadow-xl"
              loading={loading}
            >
              Initialize Account
            </Button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-electric-blue hover:text-white transition-colors font-bold ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;