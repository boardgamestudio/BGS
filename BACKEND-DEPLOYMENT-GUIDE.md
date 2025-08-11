# Backend API Deployment Fix for cPanel

## Current Status
✅ **Frontend Fixed**: Website should now load at https://boardgamestudio.com (using mock data)
❌ **Backend API**: 404 error at https://boardgamestudio.com/api

## The Problem
The GitHub Actions successfully deployed files, but cPanel needs additional configuration to serve the Node.js backend at the `/api` endpoint.

## Solution Steps

### Step 1: Configure Node.js App in cPanel
1. **Login to cPanel**
2. **Find "Node.js Selector"** or "Node.js App" in your control panel
3. **Create New Node.js Application**:
   - **App URL**: `/api` (so it serves at yourdomain.com/api)
   - **App Root**: `/home/peoplein/api` (where GitHub Actions deployed the server files)
   - **Startup File**: `server.js`
   - **Node.js Version**: `18.x` or `20.x`

### Step 2: Install Dependencies
In cPanel's Node.js interface or terminal:
```bash
cd /home/peoplein/api
npm install --production
```

### Step 3: Set Environment Variables
In the Node.js app configuration, add these environment variables:
```
DB_HOST=localhost
DB_USER=peoplein_bgs_user
DB_PASSWORD=!QAZ2wsx#EDC
DB_NAME=peoplein_BGS
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://boardgamestudio.com
JWT_SECRET=your_production_jwt_secret_here
```

### Step 4: Start the Application
- Click "Restart" or "Start" in the Node.js app interface
- The API should now be available at https://boardgamestudio.com/api/projects

### Step 5: Test the API
Visit these URLs to verify:
- https://boardgamestudio.com/api/projects (should return JSON data)
- https://boardgamestudio.com/api/jobs (should return JSON data)
- https://boardgamestudio.com/api/events (should return JSON data)

### Step 6: Switch Back to Real API
Once the API is working, we can switch from mock data back to the real API by updating `src/api/entities.js` and redeploying.

## Alternative: Manual Backend Deployment

If cPanel's Node.js interface doesn't work well, you can:

1. **Upload server files manually** to `/public_html/api/`
2. **Create a `.htaccess` file** in `/public_html/api/`:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ server.js [QSA,L]
   ```
3. **Configure PHP wrapper** (some cPanel hosts require this for Node.js)

## Next Steps After Backend is Working

1. **Test API endpoints** thoroughly
2. **Switch entities.js back to real API calls**
3. **Deploy the updated frontend**
4. **Verify full functionality**

The refactoring work is complete - we just need proper cPanel configuration to serve the Node.js backend!
