# Supabase Database Setup Guide

## Step 1: Create a Supabase Project

1. Go to the [Supabase dashboard](https://supabase.com/dashboard/projects)
2. Click "New Project" to create a new project
3. Choose your organization and provide:
   - Project name: `zerodna-platform` (or your preferred name)
   - Database password: Create a strong password and save it securely
   - Region: Choose the region closest to your users

## Step 2: Get Your Database Connection String

1. Once your project is created, navigate to your project dashboard
2. Click the "Connect" button in the top toolbar
3. Select "Connection string" from the dropdown
4. Copy the URI value under "Transaction pooler" (recommended for serverless)
5. Replace `[YOUR-PASSWORD]` with the database password you set in Step 1

Your connection string will look like:
```
postgresql://postgres.abc123xyz:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

## Step 3: Set Up Environment Variables

1. In your Replit project, go to the "Secrets" tab (🔒 icon in the sidebar)
2. Add a new secret with:
   - Key: `DATABASE_URL`
   - Value: Your complete connection string from Step 2

## Step 4: Push Database Schema

Once your DATABASE_URL is set, run the following command to create all the necessary tables:

```bash
npm run db:push
```

This will create all the tables defined in your schema, including:
- Users and authentication tables
- Content management (pages, posts, articles)
- Media management
- Website settings
- Role-based permissions system

## Step 5: Seed Initial Data

After the schema is pushed, run the seed command to populate initial data:

```bash
npm run db:seed
```

This will create:
- Default admin user (username: admin_user, password: hashed_password_123)
- Default roles and permissions
- Sample website settings

## Step 6: Verify Connection

Your application should now be able to connect to Supabase. You can verify by:
1. Starting the application: `npm run dev`
2. Visiting the admin login page
3. Logging in with the default credentials

## Benefits of Supabase

- **Real-time capabilities**: Built-in subscriptions for live updates
- **Scalability**: Automatically scales with your application
- **Security**: Built-in security features and SSL by default
- **Dashboard**: Visual interface to manage your database
- **Backup**: Automatic backups and point-in-time recovery

## Next Steps

After successful setup, you can:
1. Access the Supabase dashboard to view your data
2. Use the SQL editor for custom queries
3. Set up real-time subscriptions for live updates
4. Configure additional security rules if needed

Your ZeroDNA platform is now powered by Supabase! 🚀