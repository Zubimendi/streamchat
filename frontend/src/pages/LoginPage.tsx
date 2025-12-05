import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20">
        <div className="flex items-center justify-center mb-8">
          <MessageSquare className="w-12 h-12 text-white mr-3" />
          <h1 className="text-3xl font-bold text-white">StreamChat</h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border-none outline-none focus:outline-none focus:ring-0 backdrop-blur-sm transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border-none outline-none focus:outline-none focus:ring-0 backdrop-blur-sm transition pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent border-none p-1 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white text-primary rounded-lg font-bold hover:scale-105 transition transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-white/80">
          Don't have an account?{' '}
          <Link to="/register" className="text-white font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
