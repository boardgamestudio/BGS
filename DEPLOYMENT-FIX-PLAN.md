# Emergency Deployment Fix Plan

## Current Issues
1. **Frontend**: React app not loading (only shows HTML title)
2. **Backend**: API endpoints returning 404 
3. **cPanel**: Node.js app failing due to missing .htaccess

## Immediate Fixes Needed

### 1. Fix Frontend Loading Issue
The React app files aren't loading properly. Need to check:
- Are the built assets in the right location?
- Is the base path configured correctly?
- Are there JavaScript import errors?

### 2. Fix Backend API 
The Node.js server isn't responding. Need to:
- Create the missing .htaccess file
- Ensure Node.js app is configured correctly in cPanel
- Check if files are in the right location after manual move

### 3. Manual File Organization
Current file structure needs to be:
```
/home/peoplein/public_html/
├── index.html                    (React app entry)
├── assets/                       (React app assets)
└── api/
    ├── server.js                 (Node.js entry point)
    ├── package.json
    ├── .env
    ├── .htaccess                 (MISSING - needs creation)
    ├── config/
    ├── routes/
    └── ...
```

## Step-by-Step Recovery Plan

### Step 1: Create Missing .htaccess
Create `/home/peoplein/public_html/api/.htaccess` with:
```
# Node.js application configuration
PassengerEnabled on
PassengerAppRoot /home/peoplein/public_html/api
PassengerStartupFile server.js
PassengerAppType node
PassengerNodejs /home/peoplein/nodevenv/public_html/api/22/bin/node
```

### Step 2: Fix cPanel Node.js Configuration
- Delete current Node.js app in cPanel (to clear errors)
- Recreate pointing to: `/home/peoplein/public_html/api`
- Set startup file: `server.js`
- Add environment variables

### Step 3: Test API Endpoints
After Node.js restart, test:
- https://boardgamestudio.com/api/projects
- https://boardgamestudio.com/api/jobs

### Step 4: Switch Frontend to Real API
Once API works, update `src/api/entities.js` from mock data to real API calls

## Alternative: Quick Working Solution
If manual fixes fail, we can:
1. Keep frontend on mock data (it will load)
2. Fix backend deployment approach later
3. At least have a working website to show
