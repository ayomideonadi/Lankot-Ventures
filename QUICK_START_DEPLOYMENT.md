# Quick Start: Deploy Lankot B2B to Production

## 🚀 5-Minute Setup

### Step 1: Prepare Environment Variables
```bash
cp .env.production.example .env.production
```

Edit `.env.production`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-key-here
NEXT_PUBLIC_ADMIN_EMAIL=admin@company.com
```

### Step 2: Build for Production
```bash
npm install --production
npm run build
```

### Step 3: Test Locally
```bash
npm run start
```
Visit: http://localhost:3000

### Step 4: Deploy

#### Option A: Vercel (Easiest)
```bash
npm install -g vercel
vercel deploy
# Add environment variables in Vercel dashboard
# Done! Your app is live
```

#### Option B: Self-Hosted (VPS/Dedicated)
```bash
# SSH to server
ssh user@your-server.com

# Clone repo
git clone your-repo-url
cd lankot-b2b-platform

# Install dependencies
npm install --production

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start "npm run start" --name "lankot-b2b"
pm2 save
pm2 startup
```

#### Option C: Docker
```bash
docker build -t lankot-b2b .
docker run -d \
  -e NEXT_PUBLIC_SUPABASE_URL=https://... \
  -e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=... \
  -e NEXT_PUBLIC_ADMIN_EMAIL=... \
  -p 3000:3000 \
  lankot-b2b
```

## ✅ Post-Deployment Checklist

- [ ] Test login with buyer account
- [ ] Test login with admin account  
- [ ] Create an RFQ from buyer side
- [ ] Receive notification on admin side
- [ ] Create quote from admin
- [ ] Check order placement flow
- [ ] Monitor server logs
- [ ] Set up error tracking (optional: Sentry)

## 🔒 Security Reminders

1. **NEVER** commit `.env.production` to Git
2. **ALWAYS** use HTTPS in production
3. **Keep** Node.js and npm updated
4. **Rotate** Supabase keys regularly
5. **Monitor** error logs for security issues

## 📊 Production Checklist Reference

See **PRODUCTION_FINALIZATION.md** for comprehensive checklist

## 🆘 Troubleshooting

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**App won't start:**
- Check environment variables are set
- Ensure Node.js version is 18+
- Check port 3000 isn't already in use

**Supabase connection failing:**
- Verify NEXT_PUBLIC_SUPABASE_URL format
- Check NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is correct
- Ensure Supabase project is active

## 📱 Monitor Health

```bash
# Check running process
pm2 status

# View logs
pm2 logs lankot-b2b

# Monitor CPU/Memory
pm2 monit
```

---

**Status**: Ready for production deployment
