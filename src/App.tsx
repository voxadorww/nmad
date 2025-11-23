import { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { ThemeProvider } from './components/ThemeProvider';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

function App() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );

      const { data: { user: authUser }, error } = await supabase.auth.getUser(accessToken);

      if (error || !authUser) {
        localStorage.removeItem('access_token');
        setIsLoading(false);
        return;
      }

      // Fetch user info from backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65957310/user`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('access_token');
      }
    } catch (err) {
      console.error('Auth check error:', err);
      localStorage.removeItem('access_token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    checkAuth();
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );

      await supabase.auth.signOut();
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setUser(null);
      setLocation('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Navigation
          isAuthenticated={isAuthenticated}
          isAdmin={user?.role === 'admin'}
          currentPath={location}
          onLogout={handleLogout}
        />
        
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
          
          <Route path="/login">
            {isAuthenticated ? (
              <div className="container mx-auto px-4 py-8">
                <p className="dark:text-gray-200">You are already logged in. <a href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</a></p>
              </div>
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )}
          </Route>
          
          <Route path="/signup">
            {isAuthenticated ? (
              <div className="container mx-auto px-4 py-8">
                <p className="dark:text-gray-200">You are already logged in. <a href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</a></p>
              </div>
            ) : (
              <SignupPage />
            )}
          </Route>
          
          <Route path="/dashboard">
            {isAuthenticated ? (
              <UserDashboard />
            ) : (
              <div className="container mx-auto px-4 py-8">
                <p className="dark:text-gray-200">Please <a href="/login" className="text-blue-600 hover:underline">login</a> to access your dashboard.</p>
              </div>
            )}
          </Route>
          
          <Route path="/admin">
            {isAuthenticated && user?.role === 'admin' ? (
              <AdminPanel />
            ) : isAuthenticated ? (
              <div className="container mx-auto px-4 py-8">
                <p className="dark:text-gray-200">You do not have permission to access this page.</p>
              </div>
            ) : (
              <div className="container mx-auto px-4 py-8">
                <p className="dark:text-gray-200">Please <a href="/login" className="text-blue-600 hover:underline">login</a> to access the admin panel.</p>
              </div>
            )}
          </Route>
          
          <Route>
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-2xl mb-4 dark:text-white">404 - Page Not Found</h1>
              <p className="dark:text-gray-200">The page you're looking for doesn't exist. <a href="/" className="text-blue-600 hover:underline">Go home</a></p>
            </div>
          </Route>
        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;