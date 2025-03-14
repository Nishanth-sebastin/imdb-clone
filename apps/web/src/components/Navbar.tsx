import AuthContext, { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import { loginSchema, registerSchema } from '@/schemas';

export default function Navbar() {
  const { user, login, logout, register } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [signupState, setSignupState] = useState({
    user_name: '',
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [loginState, setLoginState] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = loginSchema.safeParse({
      usernameOrEmail: loginState.usernameOrEmail,
      password: loginState.password,
    });

    if (!validationResult.success) {
      validationResult.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    setIsLoading(true);
    login({ usernameOrEmail: loginState.usernameOrEmail, password: loginState.password })
      .then(() => {
        toast.success('Signed in successfully');
        setIsOpen(false);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'Failed to sign in';
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = registerSchema.safeParse({
      username: signupState.user_name,
      name: signupState.name,
      email: signupState.email,
      password: signupState.password,
    });

    if (!validationResult.success) {
      validationResult.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    setIsLoading(true);

    register({
      username: signupState.user_name,
      name: signupState.name,
      email: signupState.email,
      password: signupState.password,
    })
      .then(() => {
        toast.success('Account created successfully');
        setIsOpen(false);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'Failed to create account';
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    logout();
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
              <span className="text-sm text-cinema-300 hidden md:inline-block">Welcome, {user.name}</span>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="font-medium bg-cinema-800 hover:bg-cinema-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold/90 text-cinema-950 font-medium">Sign In</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-cinema-900 border border-cinema-800">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-cinema-800">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email / Username</Label>
                        <Input
                          id="email"
                          type="text"
                          value={loginState.usernameOrEmail}
                          onChange={(e) => setLoginState({ ...loginState, usernameOrEmail: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginState.password}
                          onChange={(e) => setLoginState({ ...loginState, password: e.target.value })}
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
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={signupState.name}
                          onChange={(e) => setSignupState({ ...signupState, name: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Username</Label>
                        <Input
                          id="name"
                          type="text"
                          value={signupState.user_name}
                          onChange={(e) => setSignupState({ ...signupState, user_name: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          value={signupState.email}
                          onChange={(e) => setSignupState({ ...signupState, email: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          value={signupState.password}
                          onChange={(e) => setSignupState({ ...signupState, password: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Confirm Password</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          value={signupState.confirm_password}
                          onChange={(e) => setSignupState({ ...signupState, confirm_password: e.target.value })}
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
