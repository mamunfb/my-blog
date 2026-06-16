import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Globe,
  MessageCircle,
  Share2,
  Zap,
  BarChart3,
  Lock,
  Smartphone,
  Sparkles,
  BookOpen,
  Heart,
  Search,
  Palette,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import Breadcrumb from "@/components/Breadcrumb";

export default function FeaturesShowcase() {
  const { data: categories } = trpc.blog.getAllCategories.useQuery();

  useEffect(() => {
    // Set page title
    document.title = "Features - My Blog";
  }, []);

  const features = [
    {
      icon: Globe,
      title: "100+ Languages",
      description: "Automatic translation to over 100 languages with AI-powered accuracy",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40",
    },
    {
      icon: MessageCircle,
      title: "Smart Comments",
      description: "Nested comments with moderation, ratings, and spam protection",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40",
    },
    {
      icon: Share2,
      title: "Social Sharing",
      description: "Share to 7 platforms with tracking and analytics",
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with lazy loading and CDN delivery",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track views, engagement, language preferences, and more",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Enterprise-grade security with OAuth 2.0 authentication",
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Fully responsive design that looks perfect on all devices",
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40",
    },
    {
      icon: Sparkles,
      title: "AI Powered",
      description: "AI-powered content suggestions, SEO optimization, and more",
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40",
    },
  ];

  const blogFeatures = [
    {
      title: "📝 Rich Text Editor",
      description: "Create beautiful posts with TipTap editor, code blocks, and formatting",
    },
    {
      title: "🏷️ Categories & Tags",
      description: "Organize content with flexible categorization system",
    },
    {
      title: "📧 Newsletter System",
      description: "Build subscriber list and send automated email notifications",
    },
    {
      title: "⭐ Post Ratings",
      description: "Let readers rate and like your posts",
    },
    {
      title: "🔍 Full-Text Search",
      description: "Help readers find content with powerful search",
    },
    {
      title: "📚 Related Posts",
      description: "Automatically suggest related articles to readers",
    },
    {
      title: "👤 Author Profiles",
      description: "Showcase author information and all their posts",
    },
    {
      title: "📖 Table of Contents",
      description: "Auto-generated TOC for easy navigation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/20 dark:to-purple-950/20">
      <Navigation categories={categories} />

      {/* Breadcrumb */}
      <div className="container py-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Features", current: true },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Everything you need to create, manage, and grow your blog with advanced features and beautiful design
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg">
              Get Started
            </Button>
            <Button variant="outline" className="px-8 py-6 text-lg rounded-lg border-2">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${feature.bgColor} border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg w-fit mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Features Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Blog Management Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            By The Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { number: "100+", label: "Languages Supported" },
              { number: "55+", label: "Features Included" },
              { number: "7", label: "Social Platforms" },
              { number: "∞", label: "Scalability" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-8 text-center"
              >
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700">
        <div className="container text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Blogging?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Create your first post today and reach readers around the world
          </p>
          <Button className="bg-white text-purple-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-lg font-bold shadow-xl">
            Create Your First Post
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border-t-4 border-gradient-to-r from-blue-500 to-purple-500 py-12">
        <div className="container text-center text-gray-300">
          <p>&copy; 2026 My Blog. All rights reserved. ✨</p>
        </div>
      </footer>
    </div>
  );
}
