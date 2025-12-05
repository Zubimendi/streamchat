import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register(username, email, password);
      toast.success('Account created successfully!');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
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
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border-none outline-none focus:outline-none focus:ring-0 backdrop-blur-sm transition"
              placeholder="johndoe"
            />
          </div>

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
                  <EyeOff className="w-5 h-5" color='#fff' />
                ) : (
                  <Eye className="w-5 h-5" color='#fff' />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent border-none p-1 focus:outline-none"
              >
                {showConfirmPassword ? (
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
            className="w-full py-3 bg-white text-primary rounded-lg font-bold hover:scale-105 transition transform disabled:opacity-50 disabled:hover:scale-100 mt-6"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-white/80">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}