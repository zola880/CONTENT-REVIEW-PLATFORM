import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock } from 'lucide-react';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      // error handled by interceptor
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1F2937] tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-[#1F2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
              <input
                {...register('password')}
                type="password"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-[#1F2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#0F766E] text-white font-medium rounded-lg hover:bg-[#115E59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F766E] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#0F766E] hover:text-[#115E59] font-medium transition">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;