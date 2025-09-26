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

  const [signInHumanConfirmed, setSignInHumanConfirmed] = useState(false);

  // reCAPTCHA v3 setup (fallback to math challenge when not configured)
  const recaptchaSiteKey = (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY || '';
  const loadRecaptcha = (): Promise<any> => new Promise((resolve) => {
    if (!recaptchaSiteKey) return resolve(null);
    const w: any = window as any;
    if (w.grecaptcha) return resolve(w.grecaptcha);
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    s.async = true;
    s.onload = () => resolve((window as any).grecaptcha);
    document.head.appendChild(s);
  });
  const getRecaptchaToken = async (action: string) => {
    const grecaptcha: any = await loadRecaptcha();
    if (!grecaptcha || !recaptchaSiteKey) return null;
    try {
      return await grecaptcha.execute(recaptchaSiteKey, { action });
    } catch {
      return null;
    }
  };
  const verifyRecaptcha = async (token: string | null, action: string): Promise<{ ok: boolean; score: number | null; }> => {
    if (!token) return { ok: false, score: null };
    try {
      const res = await fetch('/.netlify/functions/verify-recaptcha', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, action })
      });
      if (!res.ok) return { ok: false, score: null };
      const data = await res.json();
      const score = typeof data.score === 'number' ? data.score : null;
      return { ok: !!data.success && (score ?? 0) >= 0.5, score };
    } catch {
      return { ok: false, score: null };
    }
  };

  // Human verification challenge (fallback)
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
      const msg = (error && ((error as any).message || (typeof error === 'string' ? error : JSON.stringify(error)))) || 'Unknown error';
      toast({
        title: "Sign In Failed",
        description: msg,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      setSignInEmail('');
      setSignInPassword('');

      // Backfill consent log if missing (first login after email confirmation)
      try {
        const { data: userRes } = await supabase.auth.getUser();
        const uid = userRes?.user?.id;
        if (uid) {
          const { count } = await supabase
            .from('user_consents')
            .select('user_id', { count: 'exact', head: true })
            .eq('user_id', uid);
          if (!count || count === 0) {
            const meta: any = userRes.user.user_metadata || {};
            await supabase.from('user_consents').insert({
              user_id: uid,
              email: userRes.user.email,
              agree_to_terms: !!meta.agree_to_terms,
              agree_to_privacy: !!meta.agree_to_privacy,
              consented_at: meta.consented_at || new Date().toISOString(),
              provider: meta.recaptcha_provider || 'unknown',
              recaptcha_score: meta.recaptcha_score ?? null,
            });
          }
        }
      } catch (e) {
        console.warn('Consent log backfill on login failed:', e);
      }
    }
    setIsSigningIn(false);
  };

  const signUp = async (email: string, password: string, meta?: Record<string, any>) => {
    console.log('Starting signup process', { email });
    setIsSigningUp(true);
    // Use explicit redirect only if configured; otherwise rely on Supabase project's Site URL
    const configuredRedirect = (import.meta as any).env?.VITE_SUPABASE_REDIRECT_URL as string | undefined;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          ...(configuredRedirect ? { emailRedirectTo: configuredRedirect } : {}),
          data: meta || {}
        }
      });

      if (error) {
        console.error('Signup error:', error);
        const msg = (error && ((error as any).message || (typeof error === 'string' ? error : JSON.stringify(error)))) || 'Unknown error';
        toast({ title: "Sign Up Failed", description: msg, variant: "destructive" });
      } else {
        toast({ title: "Account Created!", description: "Check your email to confirm your account." });
        setSignUpEmail('');
        setSignUpPassword('');
        setConfirmPassword('');
        // Attempt to persist consent details if session/user is available
        try {
          const { data: userRes } = await supabase.auth.getUser();
          const uid = (data && data.user && data.user.id) ? data.user.id : (userRes?.user?.id || null);
          if (uid) {
            await supabase.from('user_consents').insert({
              user_id: uid,
              email,
              agree_to_terms: !!(meta && (meta as any).agree_to_terms),
              agree_to_privacy: !!(meta && (meta as any).agree_to_privacy),
              consented_at: (meta && (meta as any).consented_at) || new Date().toISOString(),
              provider: (meta && (meta as any).recaptcha_provider) || 'unknown',
              recaptcha_score: (meta && (meta as any).recaptcha_score) ?? null,
            });
          }
        } catch (e) {
          console.warn('Consent log insert failed (will try after first login):', e);
        }
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      toast({ title: "Sign Up Failed", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast({ title: "Missing Information", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }
    if (!signInHumanConfirmed) {
      toast({ title: "Confirmation Required", description: "Please confirm you are human before signing in.", variant: "destructive" });
      return;
    }
    if (recaptchaSiteKey) {
      const token = await getRecaptchaToken('signin');
      const { ok } = await verifyRecaptcha(token, 'signin');
      if (!ok) {
        toast({ title: "Verification Failed", description: "We could not verify your request. Please try again.", variant: "destructive" });
        return;
      }
    }
    signIn(signInEmail, signInPassword);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up form submitted', { signUpEmail, signUpPassword, confirmPassword, agreeToTerms, agreeToPrivacy, recaptchaVerified });

    if (!signUpEmail || !signUpPassword || !confirmPassword) {
      toast({ title: "Missing Information", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (signUpPassword !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (signUpPassword.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    if (!agreeToTerms) {
      toast({ title: "Terms Required", description: "You must agree to the Terms of Service to create an account.", variant: "destructive" });
      return;
    }
    if (!agreeToPrivacy) {
      toast({ title: "Privacy Policy Required", description: "You must agree to the Privacy Policy to create an account.", variant: "destructive" });
      return;
    }

    let recaptchaScore: number | null = null;
    if (recaptchaSiteKey) {
      const token = await getRecaptchaToken('signup');
      const { ok, score } = await verifyRecaptcha(token, 'signup');
      recaptchaScore = score;
      if (!ok) {
        toast({ title: "Verification Failed", description: "We could not verify your request. Please try again.", variant: "destructive" });
        return;
      }
    } else {
      if (!recaptchaVerified) {
        toast({ title: "Verification Required", description: "Please complete the human verification to create an account.", variant: "destructive" });
        return;
      }
    }

    const consentMeta = {
      agree_to_terms: true,
      agree_to_privacy: true,
      consented_at: new Date().toISOString(),
      consent_version: 'v1',
      recaptcha_provider: recaptchaSiteKey ? 'recaptcha_v3' : 'math_challenge',
      recaptcha_score: recaptchaScore,
    };

    signUp(signUpEmail, signUpPassword, consentMeta);
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

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="signin-human"
                    checked={signInHumanConfirmed}
                    onCheckedChange={(checked) => setSignInHumanConfirmed(checked as boolean)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="signin-human"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm I am human
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isSigningIn || !signInHumanConfirmed}>
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
                {recaptchaSiteKey ? (
                  <div className="pt-2 text-xs text-muted-foreground">
                    This form is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                  </div>
                ) : (
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
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSigningUp || !agreeToTerms || !agreeToPrivacy || (!recaptchaSiteKey && !recaptchaVerified)}
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