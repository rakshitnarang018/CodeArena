'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Eye, EyeOff, Github, Mail, Loader2, UserCheck, UserPlus, Gavel, ArrowRight, Trophy, Users, Target, Sparkles, Code, Award, Briefcase } from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as User['role'] | '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    isValid: false
  });
  const { signup, error, clearError } = useAuth();
  const router = useRouter();

  // Password validation function
  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValid = hasUppercase && hasLowercase && hasNumber && password.length >= 8;
    
    setPasswordValidation({
      hasUppercase,
      hasLowercase,
      hasNumber,
      isValid
    });
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password format
    if (!validatePassword(formData.password)) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await signup(formData.email, formData.password, formData.name, formData.role, 'email');
      toast.success('Account created successfully! Please log in to continue.');
      router.push('/auth/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  const roleOptions = [
    { value: 'participant', label: 'Participant', icon: UserPlus, description: 'Join competitions and events' },
    { value: 'organizer', label: 'Organizer', icon: Award, description: 'Host and manage events' },
    { value: 'judge', label: 'Judge', icon: Gavel, description: 'Evaluate and score submissions' },
  ];

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-box">
          {/* Left Section - Desktop Only */}
          <div className="auth-left-section hidden lg:flex">
            <div className="auth-carousel text-white">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">CodeArena</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  Start Your Journey
                  <br />
                  <span className="text-white/90">in Tech Excellence</span>
                </h1>
                <p className="text-white/80 text-lg leading-relaxed">
                  Join thousands of developers, organizers, and judges who are 
                  building the future through competitions and innovation.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Briefcase className="w-5 h-5 text-cyan-300" />
                  <span className="text-white/90">Career Opportunities</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span className="text-white/90">Skill Development</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="text-white/90">Global Network</span>
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
                <h1 className="text-xl font-bold text-foreground mb-1">Create Account</h1>
                <p className="text-sm text-muted-foreground">Join the future of competitive innovation</p>
              </div>

              <Card className="border-0 shadow-none md:border md:shadow-lg bg-transparent md:bg-background">
                <CardContent className="space-y-3 pt-0 px-0 md:px-6">
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-medium text-foreground">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-medium text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-xs font-medium text-foreground">Role</Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as User['role'] }))}
                      >
                        <SelectTrigger className="h-11 bg-muted/30 border-border/50 focus:border-primary/50">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => {
                            const IconComponent = role.icon;
                            return (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  <div>
                                    <span className="font-medium">{role.label}</span>
                                    <span className="text-xs text-muted-foreground ml-1">
                                      - {role.description}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs font-medium text-foreground">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => {
                            const newPassword = e.target.value;
                            setFormData(prev => ({ ...prev, password: newPassword }));
                            if (newPassword) {
                              validatePassword(newPassword);
                            }
                          }}
                          required
                          className={`h-11 bg-muted/30 border-border/50 focus:border-primary/50 pr-12 transition-all duration-200 ${
                            formData.password && !passwordValidation.isValid ? 'border-red-500 focus:border-red-500' : ''
                          }`}
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
                      
                      {/* Password Requirements */}
                      {formData.password && (
                        <div className="space-y-1 mt-2">
                          <p className="text-xs text-muted-foreground">Password requirements:</p>
                          <div className="space-y-1">
                            <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasUppercase ? 'bg-green-600' : 'bg-muted-foreground/50'}`} />
                              At least one uppercase letter
                            </div>
                            <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasLowercase ? 'bg-green-600' : 'bg-muted-foreground/50'}`} />
                              At least one lowercase letter
                            </div>
                            <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasNumber ? 'bg-green-600' : 'bg-muted-foreground/50'}`} />
                              At least one number
                            </div>
                            <div className={`flex items-center gap-2 text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-600' : 'bg-muted-foreground/50'}`} />
                              At least 8 characters
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                          className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 pr-12 transition-all duration-200"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="pt-1">
                      <Button 
                        type="submit" 
                        className="w-full h-11 font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create Account
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
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                      Sign in
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

export default SignUpPage;
