# Deployment Guide

This guide covers deploying the Odds Scraper application to free hosting platforms.

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `frontend`
   - Add environment variable:
     - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app/api`)
   - Click "Deploy"

3. **Update Backend CORS**
   - Update the backend CORS configuration to allow your Vercel domain
   - In `backend/src/server.ts`, update the CORS origin

## Backend Deployment (Railway)

### Prerequisites
- Railway account (free tier available)
- GitHub account

### Steps

1. **Push code to GitHub** (if not already done)

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set the root directory to `backend`
   - Railway will automatically detect Node.js

3. **Configure Environment Variables**
   - In Railway project settings, add:
     - `PORT`: (auto-set by Railway)
     - `ODDS_API_KEY`: Your Odds API key (optional)
     - `NODE_ENV`: `production`

4. **Get Backend URL**
   - Railway will provide a URL like `https://your-app.railway.app`
   - Update frontend `VITE_API_URL` to point to this URL

## Backend Deployment (Render - Alternative)

### Steps

1. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `odds-scraper-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add the same variables as Railway

## Database (Optional)

For production, consider migrating from JSON file storage to:

- **Supabase** (free tier): PostgreSQL database
- **Railway PostgreSQL**: Add PostgreSQL service in Railway
- **SQLite**: Can be used with better-sqlite3 (requires native compilation)

## Environment Variables Summary

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
PORT=3001
ODDS_API_KEY=your_api_key_here
NODE_ENV=production
```

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] API health check works: `GET /api/health`
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test fetching odds
- [ ] Test building accumulators

## Troubleshooting

### CORS Errors
- Ensure backend CORS allows your frontend domain
- Check that `VITE_API_URL` is correctly set

### API Not Responding
- Check Railway/Render logs
- Verify environment variables are set
- Ensure port is correctly configured

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

