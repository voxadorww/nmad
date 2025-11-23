import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProjectRequestFormProps {
  onSuccess: () => void;
}

const developerTypes = [
  'Roblox Developer',
  'Web Developer',
  'App Developer',
  'Full Stack Developer',
  'Game Developer',
  'UI/UX Designer',
  'Backend Developer',
  'Frontend Developer',
];

export function ProjectRequestForm({ onSuccess }: ProjectRequestFormProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [developerType, setDeveloperType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65957310/projects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ projectName, description, developerType }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit project');
        setIsLoading(false);
        return;
      }

      setSuccess('Project submitted successfully! Our team will review it shortly.');
      setProjectName('');
      setDescription('');
      setDeveloperType('');
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Project submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Submit New Project</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Tell us about your project and we'll match you with the perfect developer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="projectName" className="dark:text-gray-200">Project Name</Label>
            <Input
              id="projectName"
              type="text"
              placeholder="e.g., E-commerce Website"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="developerType" className="dark:text-gray-200">Developer Type</Label>
            <Select value={developerType} onValueChange={setDeveloperType} required>
              <SelectTrigger id="developerType" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Select developer type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {developerTypes.map((type) => (
                  <SelectItem key={type} value={type} className="dark:text-gray-200 dark:focus:bg-gray-700">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-gray-200">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about your project requirements, timeline, and budget..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Project Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}