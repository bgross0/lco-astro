#!/usr/bin/env node

/**
 * Test Script for Equipment Booking Flow
 * Tests the complete booking process from availability check to booking creation
 */

const https = require('https');

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'https://lco.axsys.app';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Test data
const TEST_BOOKING = {
  vehicle_id: 1, // Will be updated with actual vehicle ID
  customer_name: 'Test Customer',
  customer_email: 'test@lakecountyoutdoors.com',
  customer_phone: '(612) 555-0100',
  date_from: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  date_to: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
  booking_type: 'reservation',
  pickup_location: 'Main Office',
  return_location: 'Main Office',
  message: 'This is a test booking - please ignore'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper function to make API requests
async function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(url);
    const options = {
      hostname: urlParts.hostname,
      port: urlParts.port || 443,
      path: urlParts.pathname + urlParts.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: response });
          } else {
            reject({ status: res.statusCode, data: response });
          }
        } catch (e) {
          reject({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testOdooConnection() {
  console.log(`${colors.cyan}Testing Odoo API connection...${colors.reset}`);

  try {
    const response = await makeRequest(`${API_BASE_URL}/api/fleet/vehicles`);
    console.log(`${colors.green}✓ Odoo API is accessible${colors.reset}`);
    console.log(`  Status: ${response.status}`);
    console.log(`  Vehicles found: ${response.data.data?.length || 0}`);

    if (!response.data.data || response.data.data.length === 0) {
      console.log(`${colors.yellow}⚠ No vehicles found in Odoo. Please import equipment data first.${colors.reset}`);
      return null;
    }

    return response.data.data[0]; // Return first vehicle for testing
  } catch (error) {
    console.log(`${colors.red}✗ Failed to connect to Odoo API${colors.reset}`);
    console.error(`  Error: ${error.message || JSON.stringify(error)}`);
    return null;
  }
}

async function testAvailabilityCheck(vehicleId) {
  console.log(`\n${colors.cyan}Testing availability check...${colors.reset}`);

  const availabilityRequest = {
    vehicle_id: vehicleId,
    date_from: TEST_BOOKING.date_from,
    date_to: TEST_BOOKING.date_to
  };

  try {
    const response = await makeRequest(
      `${API_BASE_URL}/api/fleet/availability`,
      'POST',
      availabilityRequest
    );

    console.log(`${colors.green}✓ Availability check successful${colors.reset}`);
    console.log(`  Vehicle ID: ${vehicleId}`);
    console.log(`  Available: ${response.data.available ? 'Yes' : 'No'}`);
    console.log(`  Days: ${response.data.days || 0}`);
    console.log(`  Estimated price: $${response.data.estimated_price || 0}`);

    return response.data.available;
  } catch (error) {
    console.log(`${colors.red}✗ Availability check failed${colors.reset}`);
    console.error(`  Error: ${JSON.stringify(error.data || error)}`);
    return false;
  }
}

async function testBookingCreation(vehicleId) {
  console.log(`\n${colors.cyan}Testing booking creation...${colors.reset}`);

  const bookingRequest = {
    ...TEST_BOOKING,
    vehicle_id: vehicleId
  };

  try {
    // Use local API endpoint (which proxies to Odoo)
    const response = await makeRequest(
      `${SITE_URL}/api/booking`,
      'POST',
      bookingRequest
    );

    console.log(`${colors.green}✓ Booking created successfully${colors.reset}`);
    console.log(`  Booking ref: ${response.data.booking_ref || 'N/A'}`);
    console.log(`  Booking ID: ${response.data.booking_id || 'N/A'}`);
    console.log(`  Total price: $${response.data.estimated_price || 0}`);
    console.log(`  Status: ${response.data.status || 'created'}`);

    return response.data;
  } catch (error) {
    console.log(`${colors.red}✗ Booking creation failed${colors.reset}`);
    console.error(`  Error: ${JSON.stringify(error.data || error)}`);
    return null;
  }
}

async function testWebhookEndpoint() {
  console.log(`\n${colors.cyan}Testing webhook endpoints...${colors.reset}`);

  const webhookPayload = {
    event_type: 'test',
    message: 'Test webhook from test script',
    timestamp: new Date().toISOString()
  };

  // Test booking webhook
  try {
    const response = await makeRequest(
      `${SITE_URL}/api/webhook/booking`,
      'POST',
      webhookPayload
    );
    console.log(`${colors.green}✓ Booking webhook endpoint is responsive${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠ Booking webhook endpoint returned error (may require signature)${colors.reset}`);
  }

  // Test inventory webhook
  try {
    const response = await makeRequest(
      `${SITE_URL}/api/webhook/inventory`,
      'POST',
      webhookPayload
    );
    console.log(`${colors.green}✓ Inventory webhook endpoint is responsive${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠ Inventory webhook endpoint returned error (may require signature)${colors.reset}`);
  }
}

async function testSSEConnection() {
  console.log(`\n${colors.cyan}Testing SSE connection...${colors.reset}`);
  console.log(`  To test SSE, run this in your browser console:`);
  console.log(`${colors.blue}
  const eventSource = new EventSource('${SITE_URL}/api/events');
  eventSource.onmessage = (e) => console.log('Event:', JSON.parse(e.data));
  ${colors.reset}`);
}

// Main test runner
async function runTests() {
  console.log(`${colors.blue}====================================`);
  console.log(`Equipment Rental Booking Flow Tests`);
  console.log(`====================================\n${colors.reset}`);

  console.log(`Configuration:`);
  console.log(`  Odoo API: ${API_BASE_URL}`);
  console.log(`  Site URL: ${SITE_URL}`);
  console.log(`  Test dates: ${TEST_BOOKING.date_from} to ${TEST_BOOKING.date_to}\n`);

  // Test 1: Check Odoo connection and get a vehicle
  const vehicle = await testOdooConnection();

  if (vehicle) {
    const vehicleId = vehicle.id;
    console.log(`\n${colors.blue}Using vehicle for tests: ${vehicle.name} (ID: ${vehicleId})${colors.reset}`);

    // Test 2: Check availability
    const isAvailable = await testAvailabilityCheck(vehicleId);

    // Test 3: Create booking (only if localhost - don't create real bookings in production)
    if (SITE_URL.includes('localhost') && isAvailable) {
      const booking = await testBookingCreation(vehicleId);

      if (booking) {
        console.log(`\n${colors.green}✓ Booking flow is working correctly!${colors.reset}`);
      }
    } else if (!isAvailable) {
      console.log(`\n${colors.yellow}⚠ Skipping booking creation - vehicle not available${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}⚠ Skipping booking creation - not on localhost${colors.reset}`);
    }
  } else {
    console.log(`\n${colors.yellow}⚠ No vehicles found. Please import equipment data to Odoo first.${colors.reset}`);
    console.log(`  Run: node scripts/migrate-equipment-to-odoo.js`);
    console.log(`  Then import the generated data to Odoo`);
  }

  // Test 4: Check webhook endpoints
  await testWebhookEndpoint();

  // Test 5: Provide SSE test instructions
  await testSSEConnection();

  // Summary
  console.log(`\n${colors.blue}====================================`);
  console.log(`Test Summary`);
  console.log(`====================================\n${colors.reset}`);

  if (vehicle) {
    console.log(`${colors.green}✓ Core API integration is functional${colors.reset}`);
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`1. Import equipment data to Odoo (if not done)`);
    console.log(`2. Configure webhooks in Odoo admin`);
    console.log(`3. Set production environment variables`);
    console.log(`4. Deploy to production`);
  } else {
    console.log(`${colors.yellow}⚠ Integration needs configuration${colors.reset}`);
    console.log(`\n${colors.cyan}Required actions:${colors.reset}`);
    console.log(`1. Import equipment data to Odoo`);
    console.log(`2. Verify API endpoints are configured`);
    console.log(`3. Configure webhooks`);
    console.log(`4. Test again after data import`);
  }
}

// Run tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };