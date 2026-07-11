import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import {
  ArrowRight,
  Zap,
  Users,
  Trophy,
  Code,
  Flame,
  BookOpen,
  Award,
  Play,
  Star,
  CheckCircle2,
  Rocket,
  Brain,
  Target,
  TrendingUp,
  Sparkles,
  Mic,
  Smartphone,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = getLoginUrl();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Codelearnify
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600 hidden sm:block">{user?.name}</span>
                <Button onClick={() => window.location.href = "/dashboard"} variant="default" size="sm" className="shadow-lg shadow-blue-500/25">
                  Dashboard
                </Button>
              </>
            ) : (
              <Button onClick={handleGetStarted} variant="default" size="sm" className="shadow-lg shadow-blue-500/25">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Animated background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60"
          style={{
            backgroundPosition: `${mousePosition.x / 50}px ${mousePosition.y / 50}px`,
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                The #1 Interactive Learning Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Learn to code by{" "}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    actually coding
                  </span>
                  <span className="absolute bottom-2 left-0 right-0 h-3 bg-blue-200/50 -z-0 transform -rotate-1" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Real code, real execution, real results. Master programming with interactive lessons,
                AI-powered tutoring, and a community of 500K+ developers. From zero to job-ready.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="gap-2 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                >
                  Start Learning Free <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = "/courses"}
                  className="gap-2 border-2 hover:bg-slate-50"
                >
                  <Play className="w-4 h-4" /> Explore Courses
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm font-medium text-slate-700 ml-1">4.9/5 from 12K+ reviews</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                {/* Code editor mockup */}
                <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-slate-400 ml-2 font-mono">main.py</span>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Running</Badge>
                  </div>
                </div>
                <div className="p-6 bg-slate-950 font-mono text-sm">
                  <div className="space-y-1">
                    <div>
                      <span className="text-purple-400">def </span>
                      <span className="text-blue-400">calculate_gpa</span>
                      <span className="text-slate-300">(grades):</span>
                    </div>
                    <div className="pl-4 text-slate-300">
                      <span className="text-purple-400">return </span>
                      <span className="text-yellow-300">sum</span>
                      <span className="text-slate-300">(grades) / </span>
                      <span className="text-yellow-300">len</span>
                      <span className="text-slate-300">(grades)</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Output: 3.75</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 mt-2">
                      <Zap className="w-4 h-4" />
                      <span>+10 XP earned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Social Proof */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 mb-8 uppercase tracking-wider">
            Trusted by engineers from world-class companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale">
            {["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix"].map((company) => (
              <span key={company} className="text-xl font-bold text-slate-400">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "500K+", label: "Active Learners" },
              { icon: BookOpen, value: "50+", label: "Expert Courses" },
              { icon: Trophy, value: "1M+", label: "Challenges Completed" },
              { icon: Award, value: "95%", label: "Success Rate" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-blue-50 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-24">
            <Badge variant="outline" className="mb-4">
              <Rocket className="w-3 h-3 mr-1" />
              Why Choose Codelearnify
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
              Everything you need to master coding
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From interactive lessons to AI tutoring, we've built the most effective learning experience on the web.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Code,
                title: "Real Code Execution",
                description: "Write and run actual code in your browser. No setup, no installations. See results instantly with our secure sandbox.",
                color: "blue",
              },
              {
                icon: Brain,
                title: "AI Tutor That Actually Helps",
                description: "Get personalized hints, step-by-step guidance, and instant feedback. Our AI sees what you're working on and helps you think, not just tells you the answer.",
                color: "purple",
              },
              {
                icon: Flame,
                title: "Streaks & Gamification",
                description: "Build unstoppable momentum with daily streaks, XP rewards, and global leaderboards. Learning shouldn't feel like a chore.",
                color: "orange",
              },
              {
                icon: Target,
                title: "Structured Learning Paths",
                description: "Follow curated paths from beginner to job-ready. Each course builds on the last, ensuring you master fundamentals before advancing.",
                color: "green",
              },
              {
                icon: Users,
                title: "Community & Challenges",
                description: "Compete with friends, join coding challenges, and learn together. The best way to stay motivated is with others on the same journey.",
                color: "pink",
              },
              {
                icon: Award,
                title: "Industry-Recognized Certificates",
                description: "Earn verifiable certificates for every course. Add them to your LinkedIn profile and showcase your skills to employers.",
                color: "yellow",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="group border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${feature.color}-50 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
              Start coding in minutes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No downloads, no configuration. Just open your browser and start learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Free Account",
                description: "Sign up in seconds. No credit card required. Start learning immediately with our free tier.",
                icon: Users,
              },
              {
                step: "02",
                title: "Choose Your Path",
                description: "Pick a course that matches your goals. From Python fundamentals to advanced algorithms, we've got you covered.",
                icon: Target,
              },
              {
                step: "03",
                title: "Write Real Code",
                description: "Learn by doing. Write actual code in our interactive editor, run it instantly, and get AI-powered feedback.",
                icon: Code,
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 mx-auto bg-blue-50 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Popular Courses
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
              Start with the fundamentals
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Or dive into advanced topics. Every course features interactive coding, AI tutoring, and real projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Python Fundamentals",
                level: "Beginner",
                lessons: 24,
                students: "12K+",
                rating: 4.9,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "JavaScript Essentials",
                level: "Beginner",
                lessons: 28,
                students: "15K+",
                rating: 4.8,
                color: "from-yellow-400 to-orange-500",
              },
              {
                title: "Web Development Bootcamp",
                level: "Intermediate",
                lessons: 32,
                students: "8K+",
                rating: 4.9,
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Data Science with Python",
                level: "Intermediate",
                lessons: 26,
                students: "5K+",
                rating: 4.7,
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Advanced Algorithms",
                level: "Advanced",
                lessons: 20,
                students: "3K+",
                rating: 4.8,
                color: "from-red-500 to-rose-500",
              },
              {
                title: "Full-Stack Development",
                level: "Advanced",
                lessons: 35,
                students: "4K+",
                rating: 4.9,
                color: "from-indigo-500 to-purple-500",
              },
            ].map((course, idx) => (
              <Card key={idx} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-slate-200 hover:border-blue-200 bg-white">
                <CardHeader>
                  <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${course.color} mb-4 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <Code className="w-12 h-12 text-white/90 relative z-10" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={
                        course.level === "Beginner"
                          ? "default"
                          : course.level === "Intermediate"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {course.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-lg">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span>{course.lessons} lessons</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{course.students} students</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group-hover:bg-blue-600 transition-colors" variant="outline"
                    onClick={() => window.location.href = "/courses"}>
                    Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={() => window.location.href = "/courses"} size="lg" variant="outline" className="border-2">
              View All Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">Loved by learners worldwide</h2>
            <p className="text-lg text-slate-600">Join 500K+ developers who are learning to code with Codelearnify</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I went from zero to building my first web app in just 3 months. The gamification and AI tutor kept me motivated every single day.",
                author: "Sarah Chen",
                role: "Software Developer at Google",
                avatar: "SC",
              },
              {
                quote: "The streak system is amazing. I've never been more consistent with learning. 365 days and counting! The certificate helped me land my first dev job.",
                author: "Marcus Johnson",
                role: "Frontend Developer",
                avatar: "MJ",
              },
              {
                quote: "Real code execution in the browser? Game changer. The instant feedback from the AI tutor helped me debug faster than any tutorial I've tried.",
                author: "Emma Rodriguez",
                role: "Career Switcher to Tech",
                avatar: "ER",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-slate-200 hover:shadow-xl transition-shadow bg-white">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.author}</p>
                      <p className="text-sm text-slate-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Simple Pricing
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">Start free, upgrade when ready</h2>
            <p className="text-lg text-slate-600">No hidden fees. No commitments. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="border-2 border-slate-200 bg-white">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-600 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {[
                    "5 beginner courses",
                    "In-browser code editor",
                    "Daily streaks & XP",
                    "Basic leaderboard",
                    "Community access",
                    "5 coding challenges/day",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleGetStarted} variant="outline" className="w-full py-6 text-lg">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="border-2 border-blue-600 relative bg-white shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="pb-8 pt-8">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>For serious developers</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-slate-900">$19</span>
                  <span className="text-slate-600 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {[
                    "All 50+ courses & projects",
                    "Advanced code editor with AI",
                    "AI tutor with screen awareness",
                    "Global leaderboard",
                    "Friend challenges & tournaments",
                    "Verified certificates",
                    "Unlimited code execution",
                    "Priority support",
                    "Offline mobile access",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleGetStarted} className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25">
                  Start Premium Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
            Ready to start your coding journey?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join 500,000+ learners who are building real skills, one line of code at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              variant="secondary"
              className="gap-2 shadow-xl hover:shadow-2xl transition-all"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => window.location.href = "/courses"}
              size="lg"
              variant="ghost"
              className="text-white border-2 border-white/30 hover:bg-white/10"
            >
              Browse Courses
            </Button>
          </div>
          <p className="text-sm text-blue-200">No credit card required. Free forever tier available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Codelearnify</span>
              </div>
              <p className="text-sm text-slate-400">The interactive platform for mastering programming skills.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/courses" className="hover:text-white transition">Courses</a></li>
                <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="/achievements" className="hover:text-white transition">Achievements</a></li>
                <li><a href="/leaderboard" className="hover:text-white transition">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Community</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
            <p> 2026 Codelearnify. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
