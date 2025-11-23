import { useState, useEffect } from 'react';
import { ProjectRequestForm } from './ProjectRequestForm';
import { ProjectList } from './ProjectList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2 } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface Project {
  id: string;
  projectName: string;
  description: string;
  developerType: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedDeveloper?: {
    name: string;
    type: string;
  } | null;
  createdAt: string;
  rejectionReason?: string;
}

export function UserDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65957310/projects`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch projects');
        setIsLoading(false);
        return;
      }

      setProjects(data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('An unexpected error occurred while loading projects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl mb-2 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your project requests and view their status</p>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
            <TabsTrigger value="projects" className="dark:data-[state=active]:bg-gray-800 dark:text-gray-400 dark:data-[state=active]:text-white">My Projects</TabsTrigger>
            <TabsTrigger value="new" className="dark:data-[state=active]:bg-gray-800 dark:text-gray-400 dark:data-[state=active]:text-white">New Project</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ProjectList projects={projects} />
            )}
          </TabsContent>
          
          <TabsContent value="new" className="mt-6">
            <ProjectRequestForm onSuccess={fetchProjects} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}