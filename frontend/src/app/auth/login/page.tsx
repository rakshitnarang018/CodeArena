'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Eye, EyeOff, Github, Mail, Loader2, ArrowRight, Trophy, Users, Target, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-box">
          {/* Left Section - Desktop Only */}
          <div className="auth-left-section hidden md:flex">
            <div className="auth-carousel text-white">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">CodeArena</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  Welcome Back to
                  <br />
                  <span className="text-white/90">Competitive Innovation</span>
                </h1>
                <p className="text-white/80 text-lg leading-relaxed">
                  Continue your journey with developers, participate in cutting-edge competitions, 
                  and unlock your potential in the global tech ecosystem.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span className="text-white/90">50+ Active Competitions</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="text-white/90">10K+ Active Developers</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Target className="w-5 h-5 text-green-300" />
                  <span className="text-white/90">95% Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="flex-1 auth-form-container">
            <div className="auth-form-wrapper">
              {/* Mobile Logo */}
              <div className="md:hidden text-center mb-4">
                <Link href="/" className="inline-flex items-center space-x-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                   CodeArena
                  </span>
                </Link>
                <h1 className="text-xl font-bold text-foreground mb-1">Welcome Back</h1>
                <p className="text-sm text-muted-foreground">Sign in to continue your journey</p>
              </div>

              <Card className="border-0 shadow-none md:border md:shadow-lg bg-transparent md:bg-background">
                <CardHeader className="space-y-2 text-center md:text-left pb-2 hidden md:block">
                  <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Sign in to continue your journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 px-0 md:px-6">
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-medium text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs font-medium text-foreground">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 pr-12 transition-all duration-200"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Link 
                        href="/forgot-password" 
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {error && (
                      <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                      </div>
                    )}

                    <div className="pt-1">
                      <Button 
                        type="submit" 
                        className="w-full h-11 font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-3 text-muted-foreground font-medium">
                        OR CONTINUE WITH
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin('GitHub')}
                      className="h-10 bg-muted/50 hover:bg-muted border-border/50 hover:border-border"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin('Google')}
                      className="h-10 bg-muted/50 hover:bg-muted border-border/50 hover:border-border"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>

                  <p className="text-center text-xs text-muted-foreground pt-1">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
                      Sign up
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
