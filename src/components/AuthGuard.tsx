import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User as UserIcon, LogOut, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface AuthGuardProps {
  children: (user: User) => React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { toast } = useToast();

  // Auth form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Compliance states
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  
  // Human verification challenge
  const [challengeQuestion, setChallengeQuestion] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Generate initial challenge
    generateChallenge();

    return () => subscription.unsubscribe();
  }, []);

  // Generate a simple math challenge
  const generateChallenge = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    
    let question, answer;
    if (operation === '+') {
      question = `${num1} + ${num2}`;
      answer = (num1 + num2).toString();
    } else {
      // Ensure positive result
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      question = `${larger} - ${smaller}`;
      answer = (larger - smaller).toString();
    }
    
    setChallengeQuestion(question);
    setChallengeAnswer(answer);
    setUserAnswer('');
    setRecaptchaVerified(false);
  };

  const signIn = async (email: string, password: string) => {
    setIsSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      setSignInEmail('');
      setSignInPassword('');
    }
    setIsSigningIn(false);
  };

  const signUp = async (email: string, password: string) => {
    console.log('Starting signup process', { email, password });
    setIsSigningUp(true);
    const redirectUrl = `${window.location.origin}/`;
    console.log('Redirect URL:', redirectUrl);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Signup successful');
        toast({
          title: "Account Created!",
          description: "Check your email to confirm your account.",
        });
        setSignUpEmail('');
        setSignUpPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    setIsSigningUp(false);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    signIn(signInEmail, signInPassword);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up form submitted', { signUpEmail, signUpPassword, confirmPassword, agreeToTerms, agreeToPrivacy, recaptchaVerified });
    
    if (!signUpEmail || !signUpPassword || !confirmPassword) {
      console.log('Missing information');
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    if (signUpPassword !== confirmPassword) {
      console.log('Password mismatch');
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    if (signUpPassword.length < 6) {
      console.log('Password too short');
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "You must agree to the Terms of Service to create an account.",
        variant: "destructive"
      });
      return;
    }
    if (!agreeToPrivacy) {
      toast({
        title: "Privacy Policy Required",
        description: "You must agree to the Privacy Policy to create an account.",
        variant: "destructive"
      });
      return;
    }
    if (!recaptchaVerified) {
      toast({
        title: "Verification Required",
        description: "Please complete the human verification to create an account.",
        variant: "destructive"
      });
      return;
    }
    console.log('Calling signUp function');
    signUp(signUpEmail, signUpPassword);
  };

  // Verify the math challenge
  const handleChallengeVerify = () => {
    if (userAnswer.trim() === challengeAnswer) {
      setRecaptchaVerified(true);
      setRecaptchaToken('challenge-token-' + Date.now());
      toast({
        title: "Verification Complete",
        description: "Human verification successful.",
      });
    } else {
      toast({
        title: "Incorrect Answer",
        description: "Please try again or generate a new challenge.",
        variant: "destructive"
      });
      generateChallenge();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="text-sm">Welcome, {user.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        {children(user)}
      </div>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to manage your rate alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                  {isSigningIn ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Choose a password (min 6 characters)"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Terms and Privacy Agreement */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree-terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="agree-terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{' '}
                        <Link 
                          to="/terms-of-service" 
                          target="_blank" 
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Terms of Service
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree-privacy"
                      checked={agreeToPrivacy}
                      onCheckedChange={(checked) => setAgreeToPrivacy(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="agree-privacy"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{' '}
                        <Link 
                          to="/privacy-policy" 
                          target="_blank" 
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Privacy Policy
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Human Verification */}
                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-medium">Human Verification</Label>
                  {!recaptchaVerified ? (
                    <div className="space-y-3 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Please solve this simple math problem to verify you're human:
                        </p>
                        <p className="text-lg font-semibold">
                          What is {challengeQuestion}?
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Your answer"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleChallengeVerify}
                          className="flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          Verify
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generateChallenge}
                        className="w-full text-xs"
                      >
                        Generate New Challenge
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Verification Complete</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSigningUp || !agreeToTerms || !agreeToPrivacy || !recaptchaVerified}
                >
                  {isSigningUp ? "Creating account..." : "Sign Up"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By creating an account, you agree to our Terms of Service and Privacy Policy. 
                  We use cookies to enhance your experience.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGuard;