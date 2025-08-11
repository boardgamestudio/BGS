# 🚨 CRITICAL DEPLOYMENT RULES - DO NOT CHANGE! 🚨

## ⚠️ WARNING: THESE PATHS WORKED AFTER HOURS OF DEBUGGING
## CHANGING THEM WILL BREAK THE DEPLOYMENT AGAIN!

### WORKING CONFIGURATION (DO NOT MODIFY):

```yaml
# In .github/workflows/deploy.yml
- name: Deploy combined frontend + backend to website root
  uses: SamKirkland/FTP-Deploy-Action@v4.3.5
  with:
    server: ${{ secrets.FTP_HOST }}
    username: ${{ secrets.FTP_USERNAME }}
    password: ${{ secrets.FTP_PASSWORD }}
    protocol: ftps
    port: 21
    local-dir: ./deploy/          # ✅ CORRECT - Combined folder
    server-dir: /                 # ✅ CORRECT - FTP root (NOT ./api/ or /home/peoplein/...)
    dangerous-clean-slate: true  # ✅ REQUIRED - Prevents conflicts
    log-level: verbose
```

### CRITICAL RULES:

1. **NEVER use absolute paths** like `/home/peoplein/public_html/api/`
   - ❌ WRONG: Creates nested folders
   - ✅ CORRECT: Use `/` for FTP root

2. **ALWAYS combine frontend and backend** into single deployment
   - ❌ WRONG: Two separate FTP deployments conflict
   - ✅ CORRECT: Merge dist/ and server/ into ./deploy/ first

3. **ALWAYS use dangerous-clean-slate: true**
   - Prevents file conflicts between deployments

4. **Domain Configuration:**
   - boardgamestudio.com → /home/peoplein/public_html/api/
   - FTP root (/) maps directly to this directory
   - server-dir: / deploys to the correct location

### DEPLOYMENT STRUCTURE THAT WORKS:
```
/home/peoplein/public_html/api/ (WEBSITE ROOT)
├── index.html      (React frontend)
├── assets/         (React assets)
├── server.js       (Node.js backend)
├── package.json    
├── config/         
├── routes/         
└── ... (all files at same level)
```

### WHAT NOT TO DO (WILL BREAK DEPLOYMENT):
- ❌ server-dir: /home/peoplein/public_html/api/
- ❌ server-dir: ./api/
- ❌ server-dir: /home/peoplein/api/
- ❌ Two separate FTP deployments
- ❌ clean: true (use dangerous-clean-slate instead)

### IF DEPLOYMENT BREAKS AGAIN:
1. Check GitHub Actions logs for nested folder creation
2. Verify server-dir is exactly: /
3. Verify local-dir is: ./deploy/
4. Verify dangerous-clean-slate: true is set
5. Files should appear directly in api/ directory, not nested

## 🔒 THIS CONFIGURATION IS LOCKED - DO NOT MODIFY! 🔒
