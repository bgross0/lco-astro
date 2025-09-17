# LCO Equipment Rental API Documentation

## Overview

The LCO Equipment Rental API provides RESTful endpoints for managing equipment rentals, including vehicle listings, availability checking, and booking creation. This API is designed for headless frontend integration with frameworks like Astro, Next.js, or Cloudflare Workers.

### Base URL
```
Production: https://lco.axsys.app
Staging: https://lco-staging.axsys.app
```

### Authentication
- **Type**: Public (no authentication required)
- **CSRF**: Disabled for API endpoints
- **Rate Limiting**: None currently implemented

### CORS Configuration
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
Access-Control-Max-Age: 3600
```

### Response Format
All responses are JSON with the following structure:

**Success Response:**
```json
{
  "success": true,
  "data": {...} | [...],
  "pagination": {...}  // Optional, for list endpoints
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"  // Optional
}
```

---

## Endpoints

### 1. List Vehicles
Get a filtered list of available vehicles/equipment.

**Endpoint:** `GET /api/fleet/vehicles`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| listing_type | string | No | Filter by: `sale`, `rental`, `both` |
| brand_id | integer | No | Filter by brand ID |
| fuel_type | string | No | Filter by fuel type |
| min_price | float | No | Minimum price filter |
| max_price | float | No | Maximum price filter |
| available_from | date | No | Start date (YYYY-MM-DD) |
| available_to | date | No | End date (YYYY-MM-DD) |
| featured | boolean | No | Show only featured vehicles |
| limit | integer | No | Results per page (default: 20) |
| offset | integer | No | Pagination offset (default: 0) |

**Example Request:**
```bash
curl "https://lco.axsys.app/api/fleet/vehicles?listing_type=rental&featured=true&limit=10"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "2024 Snow Blower Pro",
      "slug": "honda-2024-snow-blower-pro",
      "brand": "Honda",
      "model": "SB-2024",
      "year": "2024",
      "listing_type": "rental",
      "sale_price": 0,
      "rental_price_daily": 75.00,
      "currency": "USD",
      "fuel_type": "gasoline",
      "seats": 0,
      "doors": 0,
      "availability_status": "available",
      "featured": true,
      "short_description": "Heavy-duty snow blower for commercial use",
      "primary_image": "/web/image/fleet.vehicle.image/1/image",
      "view_count": 42
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

---

### 2. Get Vehicle Details
Get detailed information about a specific vehicle.

**Endpoint:** `GET /api/fleet/vehicle/{vehicle_id}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| vehicle_id | integer | Yes | Vehicle ID |

**Example Request:**
```bash
curl "https://lco.axsys.app/api/fleet/vehicle/1"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "2024 Snow Blower Pro",
    "slug": "honda-2024-snow-blower-pro",
    "brand": "Honda",
    "model": "SB-2024",
    "year": "2024",
    "listing_type": "rental",
    "sale_price": 0,
    "rental_price_daily": 75.00,
    "rental_price_weekly": 450.00,
    "rental_price_monthly": 1500.00,
    "currency": "USD",
    "fuel_type": "gasoline",
    "availability_status": "available",
    "featured": true,
    "short_description": "Heavy-duty snow blower for commercial use",
    "full_description": "<p>Professional grade snow blower with...</p>",
    "specifications": {
      "engine": "420cc",
      "clearing_width": "32 inches",
      "throwing_distance": "45 feet",
      "weight": "285 lbs"
    },
    "features": [
      {
        "id": 1,
        "name": "Electric Start",
        "category": "convenience",
        "icon": "fa-bolt"
      },
      {
        "id": 2,
        "name": "LED Headlights",
        "category": "safety",
        "icon": "fa-lightbulb"
      }
    ],
    "images": [
      {
        "id": 1,
        "name": "Front View",
        "url": "/web/image/fleet.vehicle.image/1/image",
        "is_primary": true
      },
      {
        "id": 2,
        "name": "Side View",
        "url": "/web/image/fleet.vehicle.image/2/image",
        "is_primary": false
      }
    ],
    "video_url": "https://youtube.com/watch?v=...",
    "virtual_tour_url": null,
    "rental_terms": "<p>Terms and conditions...</p>",
    "minimum_rental_days": 1,
    "maximum_rental_days": 30,
    "inquiry_count": 5,
    "booking_count": 12,
    "view_count": 43
  }
}
```

---

### 3. Check Availability
Check if a vehicle is available for specific dates.

**Endpoint:** `POST /api/fleet/availability`

**Request Body:**
```json
{
  "vehicle_id": 1,
  "date_from": "2024-01-15",
  "date_to": "2024-01-20"
}
```

**Example Request:**
```bash
curl -X POST "https://lco.axsys.app/api/fleet/availability" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "date_from": "2024-01-15",
    "date_to": "2024-01-20"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "available": true,
  "vehicle_id": 1,
  "days": 5,
  "estimated_price": 375.00,
  "daily_rate": 75.00,
  "currency": "USD"
}
```

**Unavailable Response:**
```json
{
  "success": true,
  "available": false,
  "vehicle_id": 1,
  "days": 5,
  "estimated_price": 0,
  "daily_rate": 75.00,
  "currency": "USD"
}
```

---

### 4. Create Booking
Create a new rental booking/reservation.

**Endpoint:** `POST /api/fleet/booking`

**Request Body:**
```json
{
  "vehicle_id": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "date_from": "2024-01-15",
  "date_to": "2024-01-20",
  "booking_type": "reservation",
  "pickup_location": "Main Office",
  "return_location": "Main Office",
  "message": "Need delivery service if available"
}
```

**Required Fields:**
- vehicle_id
- customer_name
- customer_email
- customer_phone
- date_from
- date_to

**Optional Fields:**
- booking_type: `inquiry`, `reservation`, `test_drive` (default: `reservation`)
- pickup_location
- return_location
- message

**Example Request:**
```bash
curl -X POST "https://lco.axsys.app/api/fleet/booking" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "date_from": "2024-01-15",
    "date_to": "2024-01-20",
    "booking_type": "reservation",
    "pickup_location": "Main Office"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "booking_ref": "BK-20240115-A1B2C3D4",
  "booking_id": 1,
  "message": "Booking created successfully!",
  "estimated_price": 375.00,
  "currency": "USD"
}
```

**Conflict Response (Vehicle Not Available):**
```json
{
  "success": false,
  "error": "Vehicle is not available for the selected dates",
  "message": "This vehicle has been booked by another customer. Please select different dates."
}
```

---

### 5. Get Filter Options
Get available filter options based on published vehicles.

**Endpoint:** `GET /api/fleet/filters`

**Example Request:**
```bash
curl "https://lco.axsys.app/api/fleet/filters"
```

**Example Response:**
```json
{
  "success": true,
  "filters": {
    "brands": [
      {"id": 1, "name": "Honda"},
      {"id": 2, "name": "Toro"},
      {"id": 3, "name": "John Deere"}
    ],
    "fuel_types": [
      {"value": "gasoline", "label": "Gasoline"},
      {"value": "electric", "label": "Electric"},
      {"value": "diesel", "label": "Diesel"}
    ],
    "listing_types": [
      {"value": "sale", "label": "For Sale"},
      {"value": "rental", "label": "For Rental"},
      {"value": "both", "label": "Both"}
    ],
    "price_range": {
      "min": 0,
      "max": 5000
    }
  }
}
```

---

## HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request (booking created) |
| 400 | Bad Request | Missing required fields or invalid data |
| 404 | Not Found | Vehicle not found or not published |
| 409 | Conflict | Vehicle not available (booking conflict) |
| 500 | Internal Server Error | Server error, check logs |

---

## Testing Commands

### Test Vehicle List (Empty)
```bash
curl "https://lco.axsys.app/api/fleet/vehicles"
```

### Test Vehicle List with Filters
```bash
curl "https://lco.axsys.app/api/fleet/vehicles?listing_type=rental&limit=5"
```

### Test Specific Vehicle (will return 404 if no vehicles exist)
```bash
curl "https://lco.axsys.app/api/fleet/vehicle/1"
```

### Test Availability Check
```bash
curl -X POST "https://lco.axsys.app/api/fleet/availability" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "date_from": "2024-12-01",
    "date_to": "2024-12-05"
  }'
```

### Test Booking Creation
```bash
curl -X POST "https://lco.axsys.app/api/fleet/booking" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": 1,
    "customer_name": "Test Customer",
    "customer_email": "test@example.com",
    "customer_phone": "+1234567890",
    "date_from": "2024-12-01",
    "date_to": "2024-12-05",
    "booking_type": "reservation",
    "pickup_location": "Test Location",
    "message": "Test booking via API"
  }'
```

### Test Filter Options
```bash
curl "https://lco.axsys.app/api/fleet/filters"
```

### Test CORS Preflight
```bash
curl -X OPTIONS "https://lco.axsys.app/api/fleet/vehicles" \
  -H "Origin: https://your-frontend.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"
```

---

## Frontend Integration Examples

### JavaScript/Fetch
```javascript
// Get vehicles
async function getVehicles() {
  const response = await fetch('https://lco.axsys.app/api/fleet/vehicles?listing_type=rental');
  const data = await response.json();
  return data;
}

// Check availability
async function checkAvailability(vehicleId, dateFrom, dateTo) {
  const response = await fetch('https://lco.axsys.app/api/fleet/availability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vehicle_id: vehicleId,
      date_from: dateFrom,
      date_to: dateTo
    })
  });
  const data = await response.json();
  return data;
}

// Create booking
async function createBooking(bookingData) {
  const response = await fetch('https://lco.axsys.app/api/fleet/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData)
  });

  if (response.status === 409) {
    // Handle conflict - vehicle not available
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
}
```

### Axios
```javascript
import axios from 'axios';

const API_BASE = 'https://lco.axsys.app/api/fleet';

// Get vehicles
const getVehicles = async (filters = {}) => {
  const response = await axios.get(`${API_BASE}/vehicles`, { params: filters });
  return response.data;
};

// Check availability
const checkAvailability = async (vehicleId, dateFrom, dateTo) => {
  const response = await axios.post(`${API_BASE}/availability`, {
    vehicle_id: vehicleId,
    date_from: dateFrom,
    date_to: dateTo
  });
  return response.data;
};

// Create booking
const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE}/booking`, bookingData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      // Vehicle not available
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
```

---

## Common Issues & Troubleshooting

### 1. Empty Vehicle List
**Issue:** API returns empty array for vehicles
**Solution:** Ensure vehicles are marked as "Published on Website" in Odoo

### 2. 404 on Vehicle Details
**Issue:** Vehicle not found error
**Solution:** Check if vehicle exists and is_published = true

### 3. Booking Conflicts
**Issue:** 409 error when creating booking
**Solution:** Vehicle is already booked for those dates. Use availability endpoint first to check.

### 4. CORS Errors
**Issue:** Browser blocks API requests
**Solution:** API has CORS enabled for all origins. Check browser console for specific error.

### 5. Date Format Errors
**Issue:** 500 error with date parsing
**Solution:** Use YYYY-MM-DD format for all dates

---

## Data Models

### Vehicle Object
```typescript
interface Vehicle {
  id: number;
  name: string;
  slug: string;
  brand: string;
  model: string;
  year: string;
  listing_type: 'sale' | 'rental' | 'both';
  sale_price: number;
  rental_price_daily: number;
  rental_price_weekly?: number;
  rental_price_monthly?: number;
  currency: string;
  fuel_type: string;
  seats: number;
  doors: number;
  availability_status: 'available' | 'reserved' | 'rented' | 'maintenance' | 'sold';
  featured: boolean;
  short_description: string;
  full_description?: string;
  specifications?: Record<string, any>;
  features?: Feature[];
  images?: VehicleImage[];
  video_url?: string;
  virtual_tour_url?: string;
  rental_terms?: string;
  minimum_rental_days?: number;
  maximum_rental_days?: number;
  view_count: number;
  inquiry_count?: number;
  booking_count?: number;
}

interface Feature {
  id: number;
  name: string;
  category: string;
  icon: string;
}

interface VehicleImage {
  id: number;
  name: string;
  url: string;
  is_primary: boolean;
}
```

### Booking Object
```typescript
interface Booking {
  vehicle_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
  booking_type?: 'inquiry' | 'reservation' | 'test_drive';
  pickup_location?: string;
  return_location?: string;
  message?: string;
}

interface BookingResponse {
  success: boolean;
  booking_ref: string;
  booking_id: number;
  message: string;
  estimated_price: number;
  currency: string;
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing:
- IP-based rate limiting
- API key authentication
- Request throttling

---

## Webhook Support

The module supports webhook notifications for:
- New bookings
- Booking confirmations
- Booking cancellations

Contact system admin to configure webhook endpoints.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-17 | Initial API release |
| 18.0.1.0.0 | 2024-01-17 | Odoo 18 compatibility |

---

## Contact & Support

For API issues or questions:
- Module: atlas_equipment_rental
- Author: Lake County Outdoors
- Website: https://lakecountyoutdoors.com

---

*Generated: 2024-01-17*
*Last Updated: 2024-01-17*