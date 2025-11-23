import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Helper function to generate unique IDs
const generateId = () => crypto.randomUUID();

// Initialize some developers on first run
const initializeDevelopers = async () => {
  const existingDevs = await kv.getByPrefix('developer:');
  if (existingDevs.length === 0) {
    const developers = [
      { id: generateId(), name: 'Alex Johnson', type: 'Roblox Developer', available: true },
      { id: generateId(), name: 'Sarah Chen', type: 'Roblox Developer', available: true },
      { id: generateId(), name: 'Mike Rodriguez', type: 'Web Developer', available: true },
      { id: generateId(), name: 'Emily Davis', type: 'Web Developer', available: true },
      { id: generateId(), name: 'James Wilson', type: 'App Developer', available: true },
      { id: generateId(), name: 'Lisa Anderson', type: 'App Developer', available: true },
      { id: generateId(), name: 'David Kim', type: 'Full Stack Developer', available: true },
      { id: generateId(), name: 'Rachel Taylor', type: 'Game Developer', available: true },
    ];
    
    for (const dev of developers) {
      await kv.set(`developer:${dev.id}`, dev);
    }
    console.log('Initialized developers');
  }
};

// Initialize developers
initializeDevelopers();

// User signup
app.post('/make-server-65957310/signup', async (c) => {
  try {
    const { email, username, password } = await c.req.json();
    
    if (!email || !username || !password) {
      return c.json({ error: 'Email, username, and password are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user info in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      username,
      role: 'user', // Default role
      createdAt: new Date().toISOString(),
    });

    return c.json({ 
      message: 'User created successfully',
      user: { id: userId, email, username, role: 'user' }
    });
  } catch (error) {
    console.log(`Error in signup route: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get current user info
app.get('/make-server-65957310/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userInfo = await kv.get(`user:${user.id}`);
    
    if (!userInfo) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user: userInfo });
  } catch (error) {
    console.log(`Error getting user info: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Submit project request
app.post('/make-server-65957310/projects', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { projectName, description, developerType } = await c.req.json();
    
    if (!projectName || !description || !developerType) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    const projectId = generateId();
    const project = {
      id: projectId,
      userId: user.id,
      projectName,
      description,
      developerType,
      status: 'pending',
      assignedDeveloper: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`project:${projectId}`, project);
    
    // Add project to user's project list
    const userProjects = await kv.get(`user_projects:${user.id}`) || [];
    userProjects.push(projectId);
    await kv.set(`user_projects:${user.id}`, userProjects);

    return c.json({ 
      message: 'Project submitted successfully',
      project 
    });
  } catch (error) {
    console.log(`Error submitting project: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user's projects
app.get('/make-server-65957310/projects', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectIds = await kv.get(`user_projects:${user.id}`) || [];
    const projects = [];
    
    for (const projectId of projectIds) {
      const project = await kv.get(`project:${projectId}`);
      if (project) {
        projects.push(project);
      }
    }

    // Sort by created date (newest first)
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ projects });
  } catch (error) {
    console.log(`Error getting user projects: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all projects (admin only)
app.get('/make-server-65957310/admin/projects', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userInfo = await kv.get(`user:${user.id}`);
    if (!userInfo || userInfo.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const allProjects = await kv.getByPrefix('project:');
    
    // Get usernames for each project
    const projectsWithUserInfo = await Promise.all(
      allProjects.map(async (project) => {
        const userInfo = await kv.get(`user:${project.userId}`);
        return {
          ...project,
          username: userInfo?.username || 'Unknown',
        };
      })
    );

    // Sort by created date (newest first)
    projectsWithUserInfo.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ projects: projectsWithUserInfo });
  } catch (error) {
    console.log(`Error getting all projects: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Approve project and assign developer (admin only)
app.post('/make-server-65957310/admin/projects/:id/approve', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userInfo = await kv.get(`user:${user.id}`);
    if (!userInfo || userInfo.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const projectId = c.req.param('id');
    const { developerId } = await c.req.json();

    const project = await kv.get(`project:${projectId}`);
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    const developer = await kv.get(`developer:${developerId}`);
    
    if (!developer) {
      return c.json({ error: 'Developer not found' }, 404);
    }

    // Update project status
    project.status = 'approved';
    project.assignedDeveloper = developer;
    project.updatedAt = new Date().toISOString();
    project.nomadCommission = 20; // 20% commission

    await kv.set(`project:${projectId}`, project);

    // Update developer availability
    developer.available = false;
    await kv.set(`developer:${developerId}`, developer);

    return c.json({ 
      message: 'Project approved and developer assigned',
      project 
    });
  } catch (error) {
    console.log(`Error approving project: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Reject project (admin only)
app.post('/make-server-65957310/admin/projects/:id/reject', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userInfo = await kv.get(`user:${user.id}`);
    if (!userInfo || userInfo.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const projectId = c.req.param('id');
    const { reason } = await c.req.json();

    const project = await kv.get(`project:${projectId}`);
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    // Update project status
    project.status = 'rejected';
    project.rejectionReason = reason || 'No reason provided';
    project.updatedAt = new Date().toISOString();

    await kv.set(`project:${projectId}`, project);

    return c.json({ 
      message: 'Project rejected',
      project 
    });
  } catch (error) {
    console.log(`Error rejecting project: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all developers
app.get('/make-server-65957310/developers', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userInfo = await kv.get(`user:${user.id}`);
    if (!userInfo || userInfo.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const developers = await kv.getByPrefix('developer:');
    
    return c.json({ developers });
  } catch (error) {
    console.log(`Error getting developers: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Make a user admin (for testing purposes - in production, this would be restricted)
app.post('/make-server-65957310/admin/make-admin', async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const users = await kv.getByPrefix('user:');
    const user = users.find((u) => u.email === email);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    user.role = 'admin';
    await kv.set(`user:${user.id}`, user);

    return c.json({ 
      message: 'User role updated to admin',
      user 
    });
  } catch (error) {
    console.log(`Error making user admin: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);
