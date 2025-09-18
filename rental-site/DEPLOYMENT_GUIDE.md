# LCO Equipment Rental - Complete Deployment Guide

This guide provides step-by-step instructions for deploying the LCO Equipment Rental site with full Odoo integration.

## Prerequisites

- [ ] Access to Odoo admin panel (https://lco.axsys.app)
- [ ] Domain configured for the rental site
- [ ] Node.js 18+ installed locally
- [ ] Git repository access

## Phase 1: Data Setup in Odoo

### Step 1: Import Equipment Data

1. **Generate the data files:**
```bash
cd rental-site
node scripts/migrate-equipment-to-odoo.js
```

This creates:
- `data/odoo-equipment-data.json` - JSON format for API import
- `data/odoo-equipment-data.csv` - CSV for manual import
- `data/import_equipment.py` - Python script for direct import

2. **Import to Odoo (choose one method):**

**Option A: Via Odoo Admin Interface**
- Login to Odoo admin
- Navigate to Fleet → Vehicles
- Click Import → Upload `odoo-equipment-data.csv`
- Map fields and import

**Option B: Via Python Script (on Odoo server)**
```bash
# SSH to Odoo server
python3 data/import_equipment.py
```

**Option C: Via API (if enabled)**
```bash
curl -X POST https://lco.axsys.app/api/fleet/import \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d @data/odoo-equipment-data.json
```

3. **Verify import:**
```bash
# Test that vehicles are loaded
curl https://lco.axsys.app/api/fleet/vehicles
```

You should see 15+ equipment items in the response.

## Phase 2: Environment Configuration

### Step 1: Generate Secrets

```bash
# Generate webhook secret
openssl rand -hex 32
# Example output: a7b3c9d5e7f1234567890abcdef1234567890abcdef1234567890abcdef123456
```

### Step 2: Configure Production Environment

1. **Copy production environment template:**
```bash
cp .env.production .env.local
```

2. **Update with your values:**
```env
# REQUIRED - Update these
NEXT_PUBLIC_SITE_URL=https://rentals.lakecountyoutdoors.com
ODOO_WEBHOOK_SECRET=a7b3c9d5e7f1234567890abcdef1234567890abcdef1234567890abcdef123456

# OPTIONAL - Configure as needed
SENDGRID_API_KEY=your-sendgrid-key
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Phase 3: Configure Webhooks in Odoo

Follow the [Webhook Setup Guide](WEBHOOK_SETUP_GUIDE.md) to configure:

1. **Booking webhook:** `https://your-domain.com/api/webhook/booking`
2. **Inventory webhook:** `https://your-domain.com/api/webhook/inventory`

Use the same webhook secret from Phase 2.

## Phase 4: Local Testing

### Step 1: Run Development Server

```bash
npm install
npm run dev
```

### Step 2: Test Integration

```bash
# Run the test suite
node scripts/test-booking-flow.js
```

Expected output:
- ✓ Odoo API is accessible
- ✓ Vehicles found: 15
- ✓ Availability check successful
- ✓ Webhook endpoints are responsive

### Step 3: Test Real-time Updates

Open browser console and run:
```javascript
const eventSource = new EventSource('http://localhost:3000/api/events');
eventSource.onmessage = (e) => console.log('Event:', JSON.parse(e.data));
```

You should see "Connected to LCO real-time updates" message.

## Phase 5: Production Deployment

### Option A: Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Configure and deploy:**
```bash
vercel

# Follow prompts:
# - Link to existing project or create new
# - Select Next.js framework
# - Use default build settings
```

3. **Set environment variables:**
```bash
# Add each variable
vercel env add NEXT_PUBLIC_ODOO_URL production
vercel env add ODOO_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_SITE_URL production
# ... add all required variables
```

4. **Deploy to production:**
```bash
vercel --prod
```

### Option B: Deploy to Cloudflare Pages

1. **Build the project:**
```bash
npm run build
```

2. **Create Cloudflare Pages project:**
- Go to Cloudflare dashboard
- Pages → Create project → Connect to Git
- Select repository: `lco-astro`
- Build settings:
  - Framework preset: Next.js
  - Build command: `npm run build`
  - Build directory: `.next`
  - Root directory: `rental-site`

3. **Add environment variables:**
- Settings → Environment variables
- Add all variables from `.env.production`

4. **Deploy:**
- Push to main branch triggers auto-deploy

### Option C: Deploy to Custom VPS

1. **Setup server:**
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-org/lco-astro.git
cd lco-astro/rental-site
```

2. **Configure environment:**
```bash
cp .env.production .env.local
# Edit .env.local with production values
nano .env.local
```

3. **Build and start:**
```bash
npm install
npm run build
pm2 start npm --name "lco-rental" -- start
pm2 save
pm2 startup
```

4. **Setup Nginx reverse proxy:**
```nginx
server {
    listen 80;
    server_name rentals.lakecountyoutdoors.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable SSL with Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d rentals.lakecountyoutdoors.com
```

## Phase 6: Post-Deployment Verification

### Step 1: Verify API Connection

```bash
# Check vehicles are loading
curl https://rentals.lakecountyoutdoors.com/api/fleet/vehicles

# Should return equipment data
```

### Step 2: Test Booking Flow

1. Navigate to https://rentals.lakecountyoutdoors.com/equipment
2. Select an equipment item
3. Check availability for dates
4. Submit a test booking

### Step 3: Verify Webhooks

1. Create a booking in Odoo admin
2. Check application logs for webhook receipt:
```bash
# Vercel
vercel logs --prod

# PM2
pm2 logs lco-rental

# Docker
docker logs rental-site
```

### Step 4: Monitor Real-time Updates

Open browser console on the site:
```javascript
// Should show "Connected to LCO real-time updates"
const eventSource = new EventSource('/api/events');
eventSource.onmessage = (e) => console.log('Event:', e.data);
```

## Phase 7: Monitoring & Maintenance

### Setup Monitoring

1. **Application monitoring (optional):**
```bash
# Sentry for error tracking
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

2. **Uptime monitoring:**
- Add site to UptimeRobot or Pingdom
- Monitor `/api/fleet/vehicles` endpoint

3. **Log aggregation:**
- Use Logtail, Datadog, or CloudWatch
- Monitor webhook events and errors

### Regular Maintenance

**Daily:**
- Check error logs for issues
- Verify webhook delivery

**Weekly:**
- Review booking success rate
- Check API response times

**Monthly:**
- Update dependencies: `npm update`
- Review and rotate secrets
- Backup environment configuration

## Troubleshooting

### Common Issues

**No equipment showing:**
- Verify Odoo has equipment data
- Check API endpoint: `curl https://lco.axsys.app/api/fleet/vehicles`
- Review browser console for errors

**Bookings not working:**
- Check rate limiting isn't triggered
- Verify all required fields are sent
- Check API logs for validation errors

**Webhooks not received:**
- Verify webhook URLs in Odoo
- Check webhook secret matches
- Review firewall/security group rules

**Real-time updates not working:**
- Check SSE connection in browser
- Verify `/api/events` endpoint is accessible
- Check for CORS issues

### Debug Commands

```bash
# Check API health
curl https://rentals.lakecountyoutdoors.com/api/fleet/vehicles

# Test booking endpoint
curl -X POST https://rentals.lakecountyoutdoors.com/api/booking \
  -H "Content-Type: application/json" \
  -d '{"vehicle_id": 1, ...}'

# View real-time logs
# Vercel
vercel logs --prod --follow

# PM2
pm2 logs --lines 100

# System
tail -f /var/log/nginx/access.log
```

## Security Checklist

- [ ] Webhook secret is configured and strong
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Environment variables are secure
- [ ] SSL certificate is valid
- [ ] API keys are not exposed in code
- [ ] Error messages don't leak sensitive info

## Support Resources

- **Odoo Module:** atlas_equipment_rental documentation
- **Next.js:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs
- **Cloudflare Pages:** https://developers.cloudflare.com/pages

## Rollback Procedure

If issues occur after deployment:

**Vercel:**
```bash
vercel rollback
```

**Cloudflare Pages:**
- Dashboard → Deployments → Rollback to previous

**PM2:**
```bash
pm2 restart lco-rental --update-env
```

## Success Criteria

Your deployment is successful when:
- ✅ Equipment list loads from Odoo
- ✅ Availability checks work
- ✅ Bookings can be created
- ✅ Webhooks are received
- ✅ Real-time updates function
- ✅ No console errors on frontend
- ✅ Response times < 2 seconds

---

**Congratulations!** Your LCO Equipment Rental site is now fully integrated with Odoo and ready for customers.