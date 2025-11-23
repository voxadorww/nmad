import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Clock, XCircle, User } from 'lucide-react';

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

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="size-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="size-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="size-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (projects.length === 0) {
    return (
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No projects yet. Submit your first project to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="dark:text-white">{project.projectName}</CardTitle>
                <CardDescription className="dark:text-gray-400">{project.developerType}</CardDescription>
              </div>
              {getStatusBadge(project.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
            
            {project.assignedDeveloper && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <User className="size-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm dark:text-gray-200">
                    Assigned to: <span className="text-blue-600 dark:text-blue-400">{project.assignedDeveloper.name}</span>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{project.assignedDeveloper.type}</p>
                </div>
              </div>
            )}
            
            {project.status === 'rejected' && project.rejectionReason && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
                <p className="text-sm text-red-900 dark:text-red-400">
                  <span className="font-medium">Reason: </span>
                  {project.rejectionReason}
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400">Submitted on {formatDate(project.createdAt)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}