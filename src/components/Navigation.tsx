import { Link } from 'wouter';
import { Button } from './ui/button';
import { LogOut, Home, LayoutDashboard, ShieldCheck, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface NavigationProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentPath: string;
  onLogout: () => void;
}

export function Navigation({ isAuthenticated, isAdmin, currentPath, onLogout }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white">N</span>
                </div>
                <span className="text-xl dark:text-white">Nomad</span>
              </a>
            </Link>
            
            {isAuthenticated && (
              <div className="flex items-center gap-4">
                <Link href="/">
                  <a className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPath === '/' ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  } dark:text-gray-200`}>
                    <Home className="size-4" />
                    <span>Home</span>
                  </a>
                </Link>
                
                <Link href="/dashboard">
                  <a className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPath === '/dashboard' ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  } dark:text-gray-200`}>
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </a>
                </Link>
                
                {isAdmin && (
                  <Link href="/admin">
                    <a className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      currentPath === '/admin' ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    } dark:text-gray-200`}>
                      <ShieldCheck className="size-4" />
                      <span>Admin Panel</span>
                    </a>
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="dark:text-gray-200"
            >
              {theme === 'light' ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </Button>
            
            {isAuthenticated ? (
              <Button onClick={onLogout} variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}