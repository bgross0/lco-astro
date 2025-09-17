# LCO Equipment Rental Site

Equipment rental website for Lake County Outdoors, built with Next.js 15 and integrated with Odoo 18 backend.

## 🚀 Features

### Current Implementation
- **Modern Next.js Architecture**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **LCO Brand Consistency**: Matches the design language of the main Lake County Outdoors site
  - Primary Blue (#4A90E2) and Forest Green (#2d5016) color scheme
  - Consistent typography and spacing
  - Responsive mobile-first design
- **Equipment Catalog**: Browse equipment by categories (Snow Removal, Lawn Care, Landscaping, etc.)
- **Search & Filtering**: Filter by category, price range, and availability
- **Pricing Tiers**: Hourly, daily, and weekly rental rates
- **Responsive Design**: Optimized for all devices

### Ready for Implementation
- **Odoo Integration**: API structure ready to connect with `atlas_equipment_rental` module in lco-crm
- **Booking System**: Framework for equipment reservations
- **Payment Processing**: Prepared for Stripe integration

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend Ready**: Odoo 18 with custom `atlas_equipment_rental` module
- **Deployment**: Ready for Vercel/Cloudflare deployment

## 📁 Project Structure

```
rental-site/
├── app/                  # Next.js app directory
│   ├── equipment/       # Equipment browsing pages
│   ├── globals.css      # Global styles with LCO design system
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Homepage
├── components/          # Reusable React components
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section
│   ├── EquipmentCategories.tsx
│   ├── FeaturedEquipment.tsx
│   ├── HowItWorks.tsx
│   ├── CTABanner.tsx
│   └── Footer.tsx
├── lib/                 # Utilities and API client
│   └── api.ts          # Equipment API client
└── public/             # Static assets
```

## 🚦 Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://lco-crm.axsys.app
STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🔗 Integration with Odoo

The site is designed to connect with the `atlas_equipment_rental` module in your lco-crm instance.

### API Endpoints (to be implemented in Odoo)

- `GET /api/equipment` - List all equipment
- `GET /api/equipment/{id}` - Get equipment details
- `POST /api/equipment/availability` - Check availability
- `POST /api/equipment/booking` - Create booking
- `GET /api/equipment/categories` - Get categories

## 🎨 Design System

### Colors
- **Primary**: #4A90E2 (Trust Blue)
- **Primary Dark**: #3570B8
- **Accent**: #2d5016 (Forest Green)
- **Accent Dark**: #1F3A0F

### Components
- `.btn` - Standard button styling
- `.btn-primary` - Primary action button
- `.btn-accent` - Accent colored button
- `.card` - Card container with shadow
- `.gradient-bg` - Primary gradient background

## 📝 Next Steps

1. **Complete Odoo Integration**
   - Update API endpoints in `atlas_equipment_rental` module
   - Test API connectivity

2. **Implement Booking Flow**
   - Create booking form components
   - Add calendar availability view
   - Implement rental agreement generation

3. **Add Payment Processing**
   - Integrate Stripe for payments
   - Add deposit handling
   - Implement refund logic

4. **Deploy**
   - Deploy to Vercel or Cloudflare
   - Configure domain: rentals.lakecountyoutdoors.com
   - Set up SSL and security headers

## 🔧 Maintenance

- Equipment data is currently mocked in components
- Replace with actual API calls when Odoo backend is ready
- Update environment variables for production

## 📞 Support

For questions about this rental site, contact the Lake County Outdoors development team.