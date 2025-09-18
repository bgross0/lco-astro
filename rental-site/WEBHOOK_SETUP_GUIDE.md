# Webhook Configuration Guide for Odoo Integration

This guide explains how to configure webhooks between Odoo and your rental site for real-time data synchronization.

## Overview

Webhooks enable real-time communication between Odoo and your rental site. When events occur in Odoo (like new bookings or inventory changes), webhooks automatically notify your site.

## Webhook Endpoints

Your site provides the following webhook endpoints:

| Endpoint | Purpose | Events Handled |
|----------|---------|----------------|
| `/api/webhook/booking` | Booking events | booking.created, booking.confirmed, booking.cancelled, booking.modified |
| `/api/webhook/inventory` | Inventory updates | vehicle.availability_changed, vehicle.added, vehicle.updated, vehicle.removed, vehicle.maintenance, price.updated |

## Step 1: Generate Webhook Secret

First, generate a secure webhook secret for signature verification:

```bash
# Generate a secure 32-byte hex string
openssl rand -hex 32
```

Example output: `a7b3c9d5e7f1234567890abcdef1234567890abcdef1234567890abcdef123456`

Add this to your environment variables:

```env
ODOO_WEBHOOK_SECRET=a7b3c9d5e7f1234567890abcdef1234567890abcdef1234567890abcdef123456
```

## Step 2: Configure Webhooks in Odoo

### Method A: Via Odoo Admin Interface

1. **Login to Odoo Admin**
   - Navigate to https://lco.axsys.app
   - Login with admin credentials

2. **Access Webhook Configuration**
   - Go to Settings → Technical → Webhooks
   - Or navigate to Atlas Equipment Rental → Configuration → Webhooks

3. **Create Booking Webhook**
   - Click "Create"
   - Name: "Rental Site - Booking Events"
   - URL: `https://your-domain.com/api/webhook/booking`
   - Secret: [Your webhook secret from Step 1]
   - Events: Select all booking-related events
   - Active: ✓
   - Save

4. **Create Inventory Webhook**
   - Click "Create"
   - Name: "Rental Site - Inventory Updates"
   - URL: `https://your-domain.com/api/webhook/inventory`
   - Secret: [Your webhook secret from Step 1]
   - Events: Select all vehicle/inventory events
   - Active: ✓
   - Save

### Method B: Via Odoo XML-RPC API

```python
import xmlrpc.client

# Odoo connection
url = 'https://lco.axsys.app'
db = 'lco'
username = 'admin@lakecountyoutdoors.com'
password = 'your_password'

# Connect to Odoo
common = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/common')
uid = common.authenticate(db, username, password, {})
models = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/object')

# Create booking webhook
booking_webhook_id = models.execute_kw(db, uid, password,
    'webhook.config', 'create', [{
        'name': 'Rental Site - Booking Events',
        'url': 'https://your-domain.com/api/webhook/booking',
        'secret': 'your_webhook_secret_here',
        'events': ['booking.created', 'booking.confirmed', 'booking.cancelled', 'booking.modified'],
        'active': True
    }])

# Create inventory webhook
inventory_webhook_id = models.execute_kw(db, uid, password,
    'webhook.config', 'create', [{
        'name': 'Rental Site - Inventory Updates',
        'url': 'https://your-domain.com/api/webhook/inventory',
        'secret': 'your_webhook_secret_here',
        'events': ['vehicle.availability_changed', 'vehicle.added', 'vehicle.updated', 'vehicle.removed', 'vehicle.maintenance', 'price.updated'],
        'active': True
    }])

print(f"Webhooks created: Booking #{booking_webhook_id}, Inventory #{inventory_webhook_id}")
```

## Step 3: Test Webhook Configuration

### Test Connection

1. **Verify endpoints are accessible:**
```bash
# Test booking webhook endpoint
curl -X POST https://your-domain.com/api/webhook/booking \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: test" \
  -d '{"event_type": "test", "message": "Test webhook"}'

# Test inventory webhook endpoint
curl -X POST https://your-domain.com/api/webhook/inventory \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: test" \
  -d '{"event_type": "test", "message": "Test webhook"}'
```

2. **Check logs for received webhooks:**
   - View your application logs
   - Look for "Received booking webhook" or "Received inventory webhook" messages

### Test Real Events

1. **Create a test booking in Odoo:**
   - This should trigger a `booking.created` webhook
   - Check your site logs to confirm receipt

2. **Update vehicle availability in Odoo:**
   - Change a vehicle's status
   - This should trigger a `vehicle.availability_changed` webhook

## Step 4: Monitor Webhook Health

### Server-Sent Events (SSE) Dashboard

Your site includes real-time monitoring via SSE. To test:

```javascript
// Open browser console and run:
const eventSource = new EventSource('/api/events');

eventSource.onmessage = (event) => {
  console.log('SSE Event:', JSON.parse(event.data));
};

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
};
```

### Webhook Log Monitoring

Monitor webhook activity in your logs:

```bash
# If using PM2
pm2 logs rental-site --lines 100

# If using Docker
docker logs rental-site-container -f

# If using Vercel
vercel logs --prod
```

## Step 5: Production Security

### Enable Signature Verification

1. **Ensure webhook secret is configured:**
   - Set `ODOO_WEBHOOK_SECRET` in production environment
   - Use the same secret in Odoo webhook configuration

2. **Verify signatures are checked:**
   - The webhook endpoints verify the `X-Webhook-Signature` header
   - Requests with invalid signatures are rejected with 401 status

### Rate Limiting

Consider implementing rate limiting for webhook endpoints:

```javascript
// Example using express-rate-limit
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per minute
});

app.use('/api/webhook', webhookLimiter);
```

### IP Whitelisting (Optional)

For extra security, whitelist Odoo server IPs:

```javascript
const ALLOWED_IPS = ['odoo.server.ip.1', 'odoo.server.ip.2'];

function validateWebhookSource(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;

  if (ALLOWED_IPS.includes(clientIP)) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
}
```

## Webhook Payload Examples

### Booking Created
```json
{
  "event_type": "booking.created",
  "booking_ref": "BK-2024-0001",
  "vehicle_id": 1,
  "customer_email": "customer@example.com",
  "date_from": "2024-02-01",
  "date_to": "2024-02-05",
  "total_amount": 600.00,
  "currency": "USD"
}
```

### Vehicle Availability Changed
```json
{
  "event_type": "vehicle.availability_changed",
  "vehicle_id": 1,
  "availability_status": "reserved",
  "available_from": null,
  "available_to": null,
  "booking_ref": "BK-2024-0001"
}
```

### Price Updated
```json
{
  "event_type": "price.updated",
  "vehicle_id": 1,
  "rental_price_daily": 85.00,
  "rental_price_weekly": 500.00,
  "rental_price_monthly": 1600.00,
  "currency": "USD"
}
```

## Troubleshooting

### Webhooks Not Received

1. **Check network connectivity:**
   - Ensure Odoo can reach your site's domain
   - Verify no firewall blocking

2. **Verify webhook configuration:**
   - Check URL is correct (https, not http)
   - Ensure webhook is active in Odoo

3. **Check signature verification:**
   - Ensure same secret in both systems
   - Verify signature header is sent

### Events Not Updating UI

1. **Check SSE connection:**
   - Open browser console
   - Look for SSE connection errors

2. **Verify cache invalidation:**
   - Check if SWR cache is updating
   - Try manual refresh

3. **Check event broadcasting:**
   - Verify events are added to event store
   - Check SSE endpoint is sending events

## Support

For webhook configuration issues:
- Check Odoo module documentation: `atlas_equipment_rental`
- Review webhook endpoint code: `/api/webhook/*`
- Monitor application logs for errors

## Next Steps

After configuring webhooks:

1. **Test all event types** to ensure proper handling
2. **Monitor webhook delivery** for the first 24-48 hours
3. **Set up alerting** for webhook failures
4. **Document any custom event handling** in your codebase