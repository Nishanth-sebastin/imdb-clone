
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
      toast.success('Signed in successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(signupName, signupEmail, signupPassword);
      toast.success('Account created successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    toast.info('Signed out successfully');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cinema-800 bg-black/80 backdrop-blur">
      <div className="flex h-16 items-center px-6 md:px-10 max-w-7xl mx-auto justify-between">
        <Link to="/" className="flex items-center space-x-2 animate-fade-in">
          <Film className="h-6 w-6 text-gold" />
          <span className="text-xl font-bold tracking-tight">CinemaGrove</span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-cinema-300 hidden md:inline-block">
                Welcome, {user.name}
              </span>
              <Button 
                onClick={handleSignOut}
                variant="secondary"
                className="font-medium bg-cinema-800 hover:bg-cinema-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gold hover:bg-gold/90 text-cinema-950 font-medium"
                >
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-cinema-900 border border-cinema-800">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-cinema-800">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-6">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="input-field"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full mt-4 bg-gold hover:bg-gold/90 text-cinema-950 font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register" className="mt-6">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          type="text" 
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input 
                          id="signupEmail" 
                          type="email" 
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password</Label>
                        <Input 
                          id="signupPassword" 
                          type="password" 
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          className="input-field"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full mt-4 bg-gold hover:bg-gold/90 text-cinema-950 font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}
