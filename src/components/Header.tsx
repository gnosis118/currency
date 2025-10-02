import { useState, useEffect, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, User as UserIcon, LogOut, Calculator, BarChart3, Bell, Plane, BookOpen, X, TrendingUp } from 'lucide-react';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-top">
      <div className="container flex h-14 md:h-14 items-center justify-between px-3 sm:px-4 md:px-6 overflow-hidden">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2 min-w-0" aria-label="Currency Converter homepage">
            <Logo width={48} height={48} className="flex-shrink-0" />
            <span className="font-bold text-xl sm:text-2xl truncate">Currency Converter</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6" aria-label="Main navigation">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Converter
            </Link>
            <Link 
              to="/charts" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                isActive('/charts') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Charts
            </Link>
            <Link 
              to="/alerts" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                isActive('/alerts') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Bell className="h-4 w-4" />
              Alerts
            </Link>
            <Link 
              to="/travel" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                isActive('/travel') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Plane className="h-4 w-4" />
              Travel
            </Link>
            <Link 
              to="/brokers" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                isActive('/brokers') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Best Brokers
            </Link>

            <Link 
              to="/blog" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                isActive('/blog') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Blog
            </Link>
            <Link 
              to="/faq" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/faq') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              FAQ
            </Link>
            
            <Link 
              to="/privacy-policy" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/privacy-policy') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Privacy
            </Link>
            <Link 
              to="/terms-of-service" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/terms-of-service') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Terms
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="min-h-11 min-w-11 touch-manipulation" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 max-w-[92vw] sm:max-w-[90vw]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center space-x-2">
                    <Logo width={48} height={48} />
                    <span className="font-bold text-2xl">Currency Converter</span>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm" className="h-11 w-11 p-0 touch-manipulation">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex-1 p-4 space-y-2" aria-label="Mobile navigation">
                  <Link 
                    to="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Calculator className="h-5 w-5" />
                    Converter
                  </Link>
                  <Link 
                    to="/charts" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/charts') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    Charts
                  </Link>
                  <Link 
                    to="/alerts" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/alerts') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                    Alerts
                  </Link>
                  <Link 
                    to="/travel" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/travel') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Plane className="h-5 w-5" />
                    Travel
                  </Link>
                  <Link 
                    to="/brokers" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/brokers') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <TrendingUp className="h-5 w-5" />
                    Best Brokers
                  </Link>

                  <Link 
                    to="/blog" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/blog') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <BookOpen className="h-5 w-5" />
                    Blog
                  </Link>
                  <Link 
                    to="/faq" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/faq') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    FAQ
                  </Link>
                  
                  {/* Privacy and Legal Links - Prominent in Mobile */}
                  <Link 
                    to="/privacy-policy" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/privacy-policy') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    to="/terms-of-service" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation ${
                      isActive('/terms-of-service') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    Terms of Service
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 min-h-11 touch-manipulation">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[40vw] truncate">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="min-h-11 touch-manipulation">
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="min-h-11 touch-manipulation">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Presidential-level performance optimization with React.memo
export default memo(Header);