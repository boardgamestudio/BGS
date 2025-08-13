# 🚨 THE 10 COMMANDMENTS - NEVER FORGET THESE! 🚨

## THOU SHALT NOT FORGET THESE CRITICAL TRUTHS!

### 1. 📍 THE DOMAIN TRUTH
**boardgamestudio.com** → `/home/peoplein/public_html/api/`
- THIS IS THE WEBSITE ROOT DIRECTORY!
- There is NO additional /api/ subfolder inside!

### 2. 🚫 THE /API PREFIX SIN  
**NEVER use /api/ in URLs!**
- ❌ WRONG: `https://boardgamestudio.com/api/projects`
- ✅ CORRECT: `https://boardgamestudio.com/projects`
- ❌ WRONG: `/api/projects` in server routes
- ✅ CORRECT: `/projects` in server routes

### 3. 🏗️ THE SERVER ROUTE COMMANDMENT
**Server routes are at ROOT LEVEL:**
```javascript
app.use('/projects', require('./routes/projects'));      // ✅ CORRECT
app.use('/api/projects', require('./routes/projects'));  // ❌ WRONG
```

### 4. 🌐 THE CLIENT URL COMMANDMENT  
**API Client calls ROOT endpoints:**
```javascript
apiClient.get('/projects')     // ✅ CORRECT
apiClient.get('/api/projects') // ❌ WRONG
```

### 5. 🔄 THE DEPLOYMENT PATH COMMANDMENT
**GitHub Actions deployment:**
- ✅ CORRECT: `server-dir: /` (FTP root)
- ❌ WRONG: `server-dir: /home/peoplein/public_html/api/`
- ❌ WRONG: `server-dir: ./api/`

### 6. 🎯 THE URL STRUCTURE TRUTH
**Correct URL endpoints:**
- `https://boardgamestudio.com/` (React frontend)
- `https://boardgamestudio.com/projects` (API endpoint)  
- `https://boardgamestudio.com/jobs` (API endpoint)
- `https://boardgamestudio.com/events` (API endpoint)
- `https://boardgamestudio.com/users` (API endpoint)
- `https://boardgamestudio.com/design-diaries` (API endpoint)

### 7. 📁 THE FILE STRUCTURE REALITY
**What's actually on the server:**
```
/home/peoplein/public_html/api/  (WEBSITE ROOT)
├── index.html          (serves boardgamestudio.com)
├── assets/            (React app assets)
├── server.js          (Node.js server - handles API routes)
├── package.json       (Node.js dependencies)
├── routes/           (API route handlers)
├── config/           (Database config)
└── ...
```

### 8. 🔧 THE NODE.JS APP TRUTH
**cPanel Node.js configuration:**
- Application Root: `public_html/api`
- Application URL: `boardgamestudio.com`  
- Startup File: `server.js`
- The server handles BOTH static files AND API routes

### 9. 💾 THE DATABASE CONNECTION RULE
**Environment variables in production .env:**
```
DB_HOST=localhost
DB_USER=peoplein_bgs_user  
DB_PASSWORD=!QAZ2wsx#EDC
DB_NAME=peoplein_BGS
```

### 10. 🔒 THE SACRED DEPLOYMENT RULE
**NEVER CHANGE THESE DEPLOYMENT SETTINGS:**
```yaml
local-dir: ./deploy/              # Combined frontend + backend
server-dir: /                     # FTP root (NOT absolute paths!)
dangerous-clean-slate: true       # Prevents conflicts
```

---

## 🚨 BEFORE MAKING ANY CHANGES, ASK THESE QUESTIONS:

1. **Am I adding /api/ anywhere?** → STOP! DON'T DO IT!
2. **Am I using absolute paths in deployment?** → STOP! Use `/` only!
3. **Am I testing with correct URLs?** → Use `/projects` not `/api/projects`!
4. **Am I forgetting the domain maps to /api directory?** → REMEMBER IT!

---

## 📚 REFERENCE WHEN CONFUSED:

- **Website Frontend**: `https://boardgamestudio.com/` → Serves React app
- **API Endpoints**: `https://boardgamestudio.com/projects` → Node.js routes  
- **File Location**: `/home/peoplein/public_html/api/` → All files here
- **No Nesting**: There is NO /api/api/ or /api/projects/api/ nonsense!

## 🎯 THE GOLDEN RULE:
**THE /api DIRECTORY IS THE WEBSITE ROOT - THERE IS NO DEEPER /api FOLDER!**

---

## 🚨 THE NEW COMMANDMENTS - LEARNED FROM FAILURE! 🚨

### 11. 🔍 THE TESTING COMMANDMENT
**NEVER claim success without testing!**
- ❌ WRONG: "The pages should be live!"
- ✅ CORRECT: Test with browser_action BEFORE claiming completion
- **ALWAYS verify your work actually works!**

### 12. 🧭 THE REACT ROUTER TRUTH
**NEVER split Routes into separate components!**
- ❌ WRONG: `if (isAuthPage) return <Routes>...</Routes>` (breaks routing)
- ✅ CORRECT: One `<Routes>` component with all routes inside
- **React Router requires ALL routes in the SAME Routes component!**

### 13. 🔄 THE NODE.JS SERVER REALITY  
**API calls return 404 when Node.js is NOT RUNNING!**
- Check: All `/auth`, `/admin`, `/projects` endpoints return 404?
- Problem: Node.js app stopped or not configured in cPanel
- Solution: **Tell user to restart Node.js in cPanel**

### 14. 🎯 THE COMPLETION VERIFICATION RULE
**Before attempt_completion, answer these questions:**
1. Did I test the pages with browser_action? 
2. Are API endpoints responding (not 404)?
3. Can users actually access the new functionality?
4. **If NO to any: FIX FIRST, then complete!**

### 15. 💸 THE TOKEN WASTE SIN
**NEVER write long "success" messages when you haven't verified success!**
- ❌ WRONG: Detailed before/after comparisons without testing
- ✅ CORRECT: "Fixed X. Need to restart Node.js server."
- **Be concise when you haven't proven it works!**

### 16. 📁 THE FILE STRUCTURE COMMANDMENT
**UNDERSTAND THE TWO DIFFERENT .htaccess FILES!**

**LOCAL PROJECT STRUCTURE:**
```
BGS-Base44/                          (Git repo root)
├── .htaccess                        (React Router SPA fallback)
├── .gitignore
├── package.json                     (Frontend build config)
├── src/                            (React source code)
│   ├── pages/
│   ├── components/
│   └── api/
├── dist/                           (Built frontend - generated)
│   ├── index.html
│   └── assets/
└── server/                         (Backend deployment files)
    ├── .htaccess                   (cPanel Node.js Passenger config)
    ├── server.js                   (Express server)
    ├── package.json                (Backend dependencies)  
    ├── routes/                     (API routes)
    ├── database/                   (SQL schemas)
    ├── index.html                  (Built frontend - copied here)
    └── assets/                     (Built frontend assets - copied here)
```

**CRITICAL UNDERSTANDING:**
- **Root .htaccess** → React Router (handles /login, /register frontend routing)
- **server/.htaccess** → cPanel Node.js configuration (REQUIRED for Passenger)
- **Built files MUST be copied from dist/ to server/** for deployment
- **GitHub deploys the entire server/ directory to cPanel**

### 17. 🔄 THE BUILD AND DEPLOY TRUTH
**The deployment process MUST follow this sequence:**
1. `npm run build` → Creates dist/ directory
2. `cp dist/index.html server/` → Copy built frontend  
3. `cp -r dist/assets server/` → Copy built assets
4. `git add . && git commit && git push` → Deploy to cPanel
5. **Restart Node.js app in cPanel** → Apply changes

**NEVER skip copying built files to server/ directory!**

---

*These commandments are written in blood and tokens. Forget them and waste money looking like an idiot.* 💀
