import { Link } from 'react-router-dom';
import { MessageSquare, Users, Zap, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">StreamChat</span>
          </div>
          <Link
            to="/login"
            className="px-6 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Sign In
          </Link>
        </nav>

        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-6">
            Connect Instantly
            <br />
            <span className="text-secondary">Chat Seamlessly</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            A modern real-time chat platform that feels instant, looks beautiful, and works everywhere.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:scale-105 transition transform"
          >
            Get Started Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Blazing Fast"
            description="Real-time messaging with zero lag using WebSockets"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Rooms & DMs"
            description="Create public rooms or have private conversations"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Secure"
            description="Your messages are safe with JWT authentication"
          />
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8" />}
            title="Rich Features"
            description="Reactions, typing indicators, file sharing, and more"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
  );
}