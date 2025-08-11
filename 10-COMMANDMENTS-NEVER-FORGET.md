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

*Write these on your heart. Forget them at your peril.* 💀
