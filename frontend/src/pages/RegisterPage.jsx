import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock } from 'lucide-react';

const schema = yup.object({
  name: yup.string().min(2, 'Minimum 2 characters').max(50, 'Maximum 50 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/');
    } catch (error) {
      // error handled by interceptor
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md bg-secondary rounded-2xl shadow-sm border border-primary/10 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text tracking-tight">Create Account</h1>
          <p className="text-text-muted text-sm mt-1">Start analyzing your content</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted/40" strokeWidth={1.5} />
              <input
                {...register('name')}
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border border-primary/20 rounded-lg bg-secondary text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted/40" strokeWidth={1.5} />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-10 pr-4 py-2.5 border border-primary/20 rounded-lg bg-secondary text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted/40" strokeWidth={1.5} />
              <input
                {...register('password')}
                type="password"
                className="w-full pl-10 pr-4 py-2.5 border border-primary/20 rounded-lg bg-secondary text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-dark font-medium transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;