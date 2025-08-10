# Board Game Studio - Complete Setup Guide

## Current Status
✅ **React App Working**: Your site now loads with mock data at https://boardgamestudio.com
✅ **Base44 Dependencies Removed**: Completely independent from Base44 API
✅ **Node.js Backend Created**: Complete API server with MySQL support ready to deploy

## Next Steps to Complete Database Integration

### 1. Set Up MySQL Database in cPanel

1. **Login to your cPanel** at your hosting provider
2. **Go to MySQL Databases**
3. **Create a new database**:
   - Database name: `boardgamestudio_main` (or similar)
4. **Create a database user**:
   - Username: `bgs_api_user` (or similar)
   - Strong password (save this!)
5. **Add user to database** with all privileges
6. **Run the database schema**:
   - Go to phpMyAdmin in cPanel
   - Select your new database
   - Go to SQL tab
   - Copy and paste the contents of `server/database/schema.sql`
   - Click "Go" to execute

### 2. Deploy Node.js API Server

**Option A: Railway (Recommended)**
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Create new project from GitHub repo
4. Select your BGS repository
5. Railway will auto-detect the Node.js app in `/server` folder
6. Add environment variables in Railway dashboard:
   ```
   DB_HOST=localhost (or your cPanel MySQL host)
   DB_USER=your_cpanel_db_username
   DB_PASSWORD=your_cpanel_db_password
   DB_NAME=your_cpanel_db_name
   FRONTEND_URL=https://boardgamestudio.com
   NODE_ENV=production
   ```
7. Your API will be available at something like `https://your-app.railway.app`

**Option B: Render**
1. Go to [render.com](https://render.com)
2. Connect GitHub account
3. Create new Web Service from your repo
4. Set root directory to `server`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add the same environment variables as above

### 3. Update React App to Use Real API

Once your API is deployed, update the React app:

1. **Edit `src/api/entities.js`**:
   ```javascript
   // Change this line to your Railway/Render API URL
   const API_BASE_URL = 'https://your-railway-app.railway.app/api';
   
   // Then replace the mock imports with real API calls
   // (I'll provide this code once your API is deployed)
   ```

### 4. Database Connection Setup

**If using external API (Railway/Render) with cPanel MySQL:**
- You may need to configure remote MySQL access in cPanel
- Go to "Remote MySQL" in cPanel
- Add your Railway/Render server IP to allowed hosts
- Or use `%` to allow all (less secure but easier for testing)

### 5. Test the Complete System

1. **Test API directly**: Visit `https://your-api-url.com/health`
2. **Test database**: Visit `https://your-api-url.com/api/users` 
3. **Update React app** to use real API
4. **Deploy updated React app**

## Alternative: If cPanel Supports Node.js

Some cPanel hosts support Node.js. If yours does:

1. **Upload server folder** to your cPanel file manager
2. **Install dependencies** via cPanel terminal: `npm install`
3. **Create .env file** with your database credentials
4. **Start the server** via cPanel Node.js interface
5. **Update React app** to use `https://boardgamestudio.com/api`

## Files Created

- `server/` - Complete Node.js API server
- `server/package.json` - Dependencies and scripts
- `server/server.js` - Main server file
- `server/config/database.js` - MySQL connection setup
- `server/routes/*.js` - API endpoints for each entity
- `server/database/schema.sql` - Database structure + sample data
- `server/.env.example` - Environment variables template

## What Works Right Now

- ✅ React app loads and displays sample data
- ✅ All pages navigate correctly  
- ✅ Professional UI/UX intact
- ✅ No more blank page issues
- ✅ Ready for database integration

## Next Action Required

**Choose your API hosting option** (Railway recommended) and I'll help you complete the integration!
