# Plesk VPS Deployment Guide

## Architecture Overview

Your deployment will use a hybrid architecture:
- **Frontend + Backend**: Hosted on your Plesk VPS
- **Database**: Supabase (cloud-hosted PostgreSQL)
- **Benefits**: Easy management through Plesk interface, scalable database with professional hosting control

## Prerequisites

- VPS with Plesk Panel installed
- Domain name added to Plesk
- Node.js extension installed in Plesk
- SSH access to your VPS (optional but recommended)

## Step 1: Prepare Plesk Environment

### Install Node.js Extension
1. **Login to Plesk Panel**
2. **Go to Extensions** → Search for "Node.js" → Install
3. **Or manually install via SSH:**
```bash
# SSH into your server
plesk bin extension --install nodejs
```

### Create Your Domain/Subdomain
1. **In Plesk Panel** → Domains → Add Domain
2. **Configure your domain** (e.g., zerodna.yourdomain.com)
3. **Enable SSL** (Let's Encrypt available in Plesk)

### Install PM2 for Process Management (via SSH)
```bash
# SSH into your server and install PM2 globally
npm install -g pm2
```

## Step 2: Deploy via Plesk Interface

### Method A: Using Plesk Git Repository (Recommended)

1. **Go to your domain in Plesk** → Node.js → Git
2. **Add Repository**:
   - Repository URL: Your GitHub/GitLab repository
   - Branch: `main` or `master`
   - Deploy path: `httpdocs` (or custom folder)

3. **Set up automatic deployment** (optional)
4. **Install dependencies** will run automatically

### Method B: Manual File Upload

1. **Go to File Manager** in Plesk
2. **Upload your project files** to `httpdocs` folder
3. **Or use SSH:**
```bash
# Navigate to your domain folder
cd /var/www/vhosts/yourdomain.com/httpdocs

# Clone repository
git clone https://github.com/yourusername/zerodna-platform.git .

# Install dependencies
npm install
```

### Environment Configuration in Plesk

1. **Go to your domain** → Node.js → Environment Variables
2. **Add these variables through Plesk interface:**
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (or available port)
   - `DATABASE_URL` = `postgresql://postgres.sqbimonsfjieidbrkucc:Ayoub062019@aws-0-eu-north-1.pooler.supabase.com:6543/postgres`
   - `SESSION_SECRET` = `your-generated-secret-key`

**Generate SESSION_SECRET via SSH:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Configure Node.js Application in Plesk

### Method A: Using Plesk Node.js Interface (Easiest)

1. **Go to your domain** → Node.js
2. **Configure Application:**
   - Document Root: `httpdocs` (or your project folder)
   - Application URL: `/` (root domain)
   - Application Startup File: `server/index.ts` (or built file)
   - Node.js version: 18.x or higher

3. **Application Mode:** Production
4. **Click "Enable Node.js"**

### Method B: Using PM2 (Advanced Control)

Create PM2 configuration in your project folder:
```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

Add the configuration:
```javascript
module.exports = {
  apps: [{
    name: 'zerodna-platform',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/vhosts/yourdomain.com/httpdocs',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Build Scripts Configuration
Ensure your `package.json` has production scripts:
```json
{
  "scripts": {
    "start": "NODE_ENV=production tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/server/index.js --external:pg-native"
  }
}
```

## Step 4: Configure Reverse Proxy in Plesk

### Method A: Using Plesk Proxy Rules (Recommended)

1. **Go to your domain** → Apache & Nginx Settings
2. **Enable "Proxy mode"**
3. **Add proxy rules** in the "Additional directives for HTTP":

```nginx
# Static files optimization
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri @nodejs;
}

# Main application proxy
location / {
    try_files $uri @nodejs;
}

location @nodejs {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 86400;
}
```

4. **Apply the configuration**

### Method B: Manual Nginx Configuration (Advanced)

If you prefer manual Nginx configuration, create custom configuration:

```bash
# Edit domain-specific nginx config
nano /var/www/vhosts/system/yourdomain.com/conf/vhost_nginx.conf
```

Add proxy configuration and restart services through Plesk.

## Step 5: SSL Certificate Setup in Plesk

### Using Let's Encrypt (Free SSL)

1. **Go to your domain** → SSL/TLS Certificates
2. **Click "Get free certificate from Let's Encrypt"**
3. **Configure:**
   - Email: Your email address
   - Domain names: Include www and non-www versions
   - Key type: RSA-2048 (recommended)
4. **Get Certificate** and **Install**
5. **Enable "Permanent SEO-safe 301 redirect from HTTP to HTTPS"**

### Using Custom SSL Certificate

1. **Upload your certificate files** through Plesk interface
2. **Or use Plesk's built-in certificate management**
3. **Auto-renewal** is handled automatically by Plesk

## Step 6: Build and Start Application

### Method A: Using Plesk Node.js Interface

1. **Go to your domain** → Node.js
2. **Install Dependencies:**
   - Click "NPM Install" button
   - Or run custom commands in the interface

3. **Build Application:**
   - Add custom script: `npm run build`
   - Run the build process

4. **Start Application:**
   - Click "Start" in the Node.js interface
   - Monitor status through Plesk dashboard

### Method B: Manual Build and PM2 Start

```bash
# Navigate to your project directory
cd /var/www/vhosts/yourdomain.com/httpdocs

# Install dependencies
npm install

# Build the application
npm run build

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot (if you have root access)
pm2 startup
```

## Step 7: Security Configuration in Plesk

### Firewall Settings
1. **Go to Tools & Settings** → Security → Firewall
2. **Enable firewall** if not already active
3. **Default ports** (SSH, HTTP, HTTPS) are usually pre-configured
4. **Custom rules** can be added for specific needs

### Security Headers (Optional)
Add security headers in Apache & Nginx Settings → Additional directives:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

## Step 8: Monitoring and Maintenance

### Using Plesk Interface
1. **Go to your domain** → Node.js
2. **Monitor application status** in real-time
3. **View logs** through the interface
4. **Restart/Stop** application with one click

### PM2 Commands (If using PM2)
```bash
# Check application status
pm2 status

# View logs
pm2 logs zerodna-platform

# Restart application
pm2 restart zerodna-platform

# Monitor resources
pm2 monit
```

### Database Connection Test
Test your Supabase connection:
```bash
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.sqbimonsfjieidbrkucc:Ayoub062019@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Error:', err);
  else console.log('DB Connected:', res.rows[0]);
  process.exit(0);
});
"
```

## Step 9: Deployment Automation in Plesk

### Method A: Using Plesk Git Auto-Deploy
1. **Go to your domain** → Node.js → Git
2. **Enable "Deploy automatically"**
3. **Configure webhook** (if using GitHub/GitLab)
4. **Set deployment actions:**
   - `npm install`
   - `npm run build`
   - Restart Node.js application

### Method B: Custom Deploy Script
Create deployment script in your project:
```bash
# Create deployment script
nano plesk-deploy.sh
```

```bash
#!/bin/bash
echo "Starting Plesk deployment..."

# Navigate to project directory
cd /var/www/vhosts/yourdomain.com/httpdocs

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart via Plesk or PM2
if command -v pm2 &> /dev/null; then
    pm2 restart zerodna-platform
else
    # Restart via Plesk CLI
    /usr/local/psa/bin/site --update yourdomain.com -nodejs-restart
fi

echo "Deployment completed!"
```

### Method C: Plesk Scheduled Tasks
1. **Go to your domain** → Scheduled Tasks
2. **Add task** to run deployment script
3. **Configure frequency** (on-demand or scheduled)

## Benefits of This Architecture

✅ **Cost Effective**: Pay only for VPS, database managed by Supabase
✅ **Scalable**: Supabase handles database scaling automatically
✅ **Reliable**: Professional database hosting with backups
✅ **Secure**: SSL encryption, firewall protection
✅ **Maintainable**: Easy updates via git and PM2
✅ **Monitoring**: Built-in logs and process management

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure port 3000 is available
2. **Database connection**: Verify DATABASE_URL and SSL settings
3. **Nginx errors**: Check nginx configuration with `sudo nginx -t`
4. **PM2 issues**: Check logs with `pm2 logs`

### Log Locations
- Application logs: `~/zerodna-platform/logs/`
- Nginx logs: `/var/log/nginx/`
- PM2 logs: `~/.pm2/logs/`

Your ZeroDNA platform will be running on your VPS with the database hosted on Supabase, giving you the best of both worlds!