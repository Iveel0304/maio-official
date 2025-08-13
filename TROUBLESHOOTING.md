# 🔧 MAIO Platform - Troubleshooting Guide

## Common Issues and Solutions

### 🚨 **Port Already in Use Error**

**Problem:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solutions:**
```bash
# Option 1: Use the built-in cleanup script
npm run cleanup

# Option 2: Manual port cleanup
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Option 3: Use the full development script (includes cleanup)
npm run dev:full
```

**Prevention:**
- Always use `npm run dev:full` instead of running servers separately
- The system will automatically find alternative ports if needed

---

### 🔌 **MongoDB Connection Issues**

**Problem:** `MongoDB connection error` or `MongoNetworkError`

**Solutions:**
1. **Check MongoDB URI:**
   ```bash
   # Verify .env file contains correct URI
   cat .env | grep MONGODB_URI
   ```

2. **Network Issues:**
   - Ensure you have internet connection
   - Check if your IP is whitelisted in MongoDB Atlas
   - Try connecting from MongoDB Compass with the same URI

3. **Authentication Issues:**
   - Verify username/password in the connection string
   - Check that the database user has read/write permissions

---

### 📡 **API Connection Issues**

**Problem:** Frontend can't connect to backend API

**Solutions:**
1. **Check API URL:**
   ```bash
   # Verify .env has correct API URL
   cat .env | grep VITE_API_URL
   ```

2. **Test Backend Directly:**
   ```bash
   curl http://localhost:3001/api/health
   ```

3. **Port Mismatch:**
   - If backend runs on a different port, update `VITE_API_URL` in `.env`
   - Restart the frontend after changing environment variables

---

### 🔄 **Development Server Issues**

**Problem:** Vite or backend server won't start

**Solutions:**
1. **Clear Node Modules:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node Version:**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

3. **Clear Caches:**
   ```bash
   npm run cleanup
   rm -rf .vite dist
   ```

---

### 📂 **File Upload Issues**

**Problem:** Image uploads fail or don't appear

**Solutions:**
1. **Check Uploads Directory:**
   ```bash
   ls -la uploads/  # Should exist and be writable
   mkdir -p uploads  # Create if missing
   ```

2. **File Permissions:**
   ```bash
   chmod 755 uploads/
   ```

3. **File Size Limits:**
   - Check if files are too large (default limit varies)
   - Verify file types are supported (jpg, png, gif, webp)

---

### 🎨 **Admin Panel Issues**

**Problem:** Admin panel doesn't load or shows errors

**Solutions:**
1. **Check Route Access:**
   ```bash
   # Navigate to: http://localhost:5173/admin/articles
   ```

2. **Database Connection:**
   - Ensure backend is running and connected to MongoDB
   - Check browser console for API errors

3. **Component Dependencies:**
   ```bash
   npm install  # Ensure all dependencies are installed
   ```

---

### 🌐 **Frontend Build Issues**

**Problem:** Build fails or has TypeScript errors

**Solutions:**
1. **TypeScript Errors:**
   ```bash
   npx tsc --noEmit  # Check for type errors
   ```

2. **Dependency Conflicts:**
   ```bash
   npm ls  # Check for dependency conflicts
   npm audit fix  # Fix security vulnerabilities
   ```

3. **Environment Variables:**
   - Ensure all `VITE_*` variables are properly set
   - Restart dev server after changing `.env`

---

## 🐛 **Debug Commands**

### Backend Debugging
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Test news API
curl http://localhost:3001/api/news

# Check database connection
node -e "console.log('MongoDB URI:', process.env.MONGODB_URI)" 
```

### Frontend Debugging
```bash
# Check environment variables
npm run dev -- --mode development --debug

# Check build output
npm run build -- --mode production

# Analyze bundle
npm run preview
```

### Process Management
```bash
# List processes using ports
lsof -i :3001
lsof -i :5173

# Kill specific processes
kill -9 <PID>

# Check running Node processes
ps aux | grep node
```

---

## 🚑 **Emergency Reset**

If everything seems broken, try this complete reset:

```bash
# 1. Kill all processes
npm run cleanup
pkill -f "node.*server"
pkill -f "vite"

# 2. Clean everything
rm -rf node_modules package-lock.json .vite dist

# 3. Reinstall
npm install

# 4. Start fresh
npm run dev:full
```

---

## 🔍 **Getting Help**

### Check Logs
1. **Backend logs:** Look at the terminal running `npm run dev:backend`
2. **Frontend logs:** Check browser console (F12)
3. **Network requests:** Use browser DevTools Network tab

### Report Issues
When reporting issues, please include:
- Operating system and version
- Node.js version (`node --version`)
- Complete error message
- Steps to reproduce
- Browser and version (for frontend issues)

### Useful Commands for Issue Reports
```bash
# System info
node --version
npm --version
cat .env | grep -v "PASSWORD\|KEY\|SECRET"  # Safe env vars

# Process status
lsof -i :3001
lsof -i :5173
ps aux | grep node | head -5
```

---

**Still having issues?** Create an issue in the project repository with the above information included!
