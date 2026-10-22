# Deployment Guide - AI Collection Engine

## Quick Deploy (Free Tier)

### Frontend - Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key
   ```
6. Click "Deploy"

### Backend - Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your-super-secret-key
   DATABASE_PATH=./database.sqlite
   ANTHROPIC_API_KEY=your-key
   STRIPE_SECRET_KEY=sk_test_your-key
   RESEND_API_KEY=re_your-key
   FROM_EMAIL=noreply@yourdomain.com
   HIGH_VALUE_THRESHOLD=10000
   ```
6. Railway will automatically deploy

### Alternative: Render

**Backend:**
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables (same as Railway)

**Frontend:**
1. New → Static Site
2. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

## Database Options

### SQLite (Default - Included)
- Perfect for small to medium deployments
- No additional setup required
- Data persists in `database.sqlite` file

### PostgreSQL (Production Recommended)

1. Get free PostgreSQL from:
   - Railway (included with backend)
   - Supabase (free tier)
   - ElephantSQL (free tier)

2. Update backend code to use PostgreSQL:
   ```bash
   npm install pg
   ```

3. Replace SQLite with PostgreSQL connection in `backend/src/config/database.ts`

## API Keys Setup

### Anthropic Claude API (AI Messages)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account and get API key
3. Free tier: $5 credit (sufficient for testing)
4. Add to `ANTHROPIC_API_KEY` in backend .env

### Stripe (Payments)
1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Get test mode keys from Dashboard
4. Add `STRIPE_SECRET_KEY` (backend) and `STRIPE_PUBLIC_KEY` (frontend)

### Resend (Email)
1. Go to [resend.com](https://resend.com)
2. Create account (free tier: 100 emails/day)
3. Get API key
4. Add to `RESEND_API_KEY` in backend .env

## Environment Variables Checklist

### Backend (.env)
- [x] PORT
- [x] JWT_SECRET (generate random string)
- [x] DATABASE_PATH
- [x] ANTHROPIC_API_KEY
- [x] STRIPE_SECRET_KEY
- [x] RESEND_API_KEY
- [x] FROM_EMAIL

### Frontend (.env)
- [x] REACT_APP_API_URL
- [x] REACT_APP_STRIPE_PUBLIC_KEY

## Post-Deployment

1. Test the application:
   - Login with admin@example.com / admin123
   - Create test invoice
   - Generate AI reminder
   - Check analytics

2. Configure scheduled jobs:
   - Railway/Render automatically run cron jobs
   - Verify jobs are running in logs

3. Set up monitoring:
   - Railway/Render provide built-in monitoring
   - Check logs for errors

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Railway/Render
1. Go to Settings → Custom Domain
2. Add domain and update DNS

## Troubleshooting

### Database not persisting
- Ensure DATABASE_PATH is set correctly
- For Railway/Render, use volume mounts for SQLite

### CORS errors
- Verify REACT_APP_API_URL matches backend URL
- Check backend CORS configuration

### API keys not working
- Verify keys are correctly copied (no extra spaces)
- Check API key permissions and quotas

## Cost Estimate (Free Tier)

- Vercel: Free (hobby plan)
- Railway: $5/month credit (free to start)
- Render: Free tier available
- Anthropic: $5 free credit
- Stripe: Free in test mode
- Resend: Free (100 emails/day)

**Total: $0-5/month for small deployments**

## Scaling

When you outgrow free tier:
1. Upgrade Railway/Render plan
2. Switch to PostgreSQL
3. Add Redis for caching
4. Use CDN for frontend assets
5. Implement rate limiting
