# Nomad - Admin Setup Guide

## Making a User an Admin

To access the Admin Panel, a user account must have admin privileges. Here's how to grant admin access:

### Method 1: Using the API Endpoint

1. **Create a regular user account** through the signup page
2. **Make an API call** to promote the user to admin:

```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-65957310/admin/make-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email": "admin@example.com"}'
```

Replace:
- `YOUR_PROJECT_ID` with your Supabase project ID
- `YOUR_ANON_KEY` with your Supabase anon key
- `admin@example.com` with the email of the user you want to make an admin

### Method 2: Using Browser Console

1. Sign up for an account
2. Open browser developer tools (F12)
3. Go to the Console tab
4. Run this code:

```javascript
const email = 'your-email@example.com'; // Replace with your email

fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-65957310/admin/make-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({ email })
})
.then(res => res.json())
.then(data => console.log(data));
```

4. Log out and log back in to see the Admin Panel link in the navigation

## Admin Features

Once you have admin access, you can:

1. **View All Projects** - See all project requests from all users
2. **Filter & Search** - Search projects by name, user, or description
3. **Approve Projects** - Approve projects and assign developers
4. **Reject Projects** - Reject projects with a reason
5. **Manage Developers** - View available developers by type
6. **Track Commissions** - System automatically records 20% commission on approved projects

## Pre-loaded Developers

The system comes with 8 pre-loaded developers:
- 2 Roblox Developers
- 2 Web Developers
- 2 App Developers
- 1 Full Stack Developer
- 1 Game Developer

These developers can be assigned to approved projects based on their specialization.

## Testing the Application

1. **Create a regular user account** (signup)
2. **Submit a project request** from the dashboard
3. **Make your account admin** using one of the methods above
4. **Log out and log back in**
5. **Go to Admin Panel** to review and approve/reject the project
6. **Check your user dashboard** to see the approved project with assigned developer

## Security Notes

⚠️ **Important**: In a production environment, the `/admin/make-admin` endpoint should be removed or heavily restricted. This endpoint is provided for testing and demonstration purposes only.

For production:
- Implement proper role-based access control
- Use database-level permissions
- Restrict admin creation to authorized personnel only
- Implement audit logging for admin actions
