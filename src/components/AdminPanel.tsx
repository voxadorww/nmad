import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Loader2, CheckCircle2, XCircle, Clock, User, Search } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface Developer {
  id: string;
  name: string;
  type: string;
  available: boolean;
}

interface Project {
  id: string;
  userId: string;
  username: string;
  projectName: string;
  description: string;
  developerType: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedDeveloper?: Developer | null;
  createdAt: string;
  rejectionReason?: string;
}

export function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      // Fetch projects
      const projectsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65957310/admin/projects`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const projectsData = await projectsResponse.json();

      if (!projectsResponse.ok) {
        setError(projectsData.error || 'Failed to fetch projects');
        setIsLoading(false);
        return;
      }

      setProjects(projectsData.projects);

      // Fetch developers
      const developersResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65957310/developers`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const developersData = await developersResponse.json();

      if (developersResponse.ok) {
        setDevelopers(developersData.developers);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('An unexpected error occurred while loading data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async () => {
    if (!selectedProject || !selectedDeveloper) return;
    
    setActionLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65957310/admin/projects/${selectedProject.id}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ developerId: selectedDeveloper }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to approve project');
        return;
      }

      setApproveDialogOpen(false);
      setSelectedProject(null);
      setSelectedDeveloper('');
      fetchData();
    } catch (err) {
      console.error('Error approving project:', err);
      setError('An unexpected error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProject) return;
    
    setActionLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65957310/admin/projects/${selectedProject.id}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reject project');
        return;
      }

      setRejectDialogOpen(false);
      setSelectedProject(null);
      setRejectionReason('');
      fetchData();
    } catch (err) {
      console.error('Error rejecting project:', err);
      setError('An unexpected error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="size-3 mr-1" />
            Pending
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

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const availableDevelopers = developers.filter((dev) => 
    dev.available && dev.type === selectedProject?.developerType
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl mb-2 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage project requests and assign developers</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="dark:text-gray-200">Search Projects</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by project name, user, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="filter" className="dark:text-gray-200">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filter" className="mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="all" className="dark:text-gray-200 dark:focus:bg-gray-700">All Projects</SelectItem>
                    <SelectItem value="pending" className="dark:text-gray-200 dark:focus:bg-gray-700">Pending</SelectItem>
                    <SelectItem value="approved" className="dark:text-gray-200 dark:focus:bg-gray-700">Approved</SelectItem>
                    <SelectItem value="rejected" className="dark:text-gray-200 dark:focus:bg-gray-700">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-gray-400" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="dark:text-white">{project.projectName}</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Requested by: {project.username} • {project.developerType}
                      </CardDescription>
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
                        <p className="text-xs text-gray-600 dark:text-gray-400">Nomad Commission: 20%</p>
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
                  
                  <div className="flex items-center justify-between pt-4 border-t dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Submitted on {formatDate(project.createdAt)}</p>
                    
                    {project.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setRejectDialogOpen(true);
                          }}
                        >
                          <XCircle className="size-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setApproveDialogOpen(true);
                          }}
                        >
                          <CheckCircle2 className="size-4 mr-2" />
                          Approve & Assign
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Approve Dialog */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Approve Project & Assign Developer</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Select a developer to assign to this project. Nomad will take 20% commission.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-200">Project: {selectedProject?.projectName}</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProject?.developerType}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="developer" className="dark:text-gray-200">Assign Developer</Label>
                <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
                  <SelectTrigger id="developer" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Select a developer" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {availableDevelopers.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                        No available developers for this type
                      </div>
                    ) : (
                      availableDevelopers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id} className="dark:text-gray-200 dark:focus:bg-gray-700">
                          {dev.name} - {dev.type}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setApproveDialogOpen(false);
                  setSelectedProject(null);
                  setSelectedDeveloper('');
                }}
                disabled={actionLoading}
                className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={!selectedDeveloper || actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Approve & Assign'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Reject Project</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Provide a reason for rejecting this project request.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-200">Project: {selectedProject?.projectName}</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">by {selectedProject?.username}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason" className="dark:text-gray-200">Rejection Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why this project is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false);
                  setSelectedProject(null);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
                className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Reject Project'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}