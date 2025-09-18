#!/usr/bin/env node

/**
 * Equipment Data Migration Script for Odoo
 * Converts mock equipment data to Odoo fleet.vehicle format
 */

const fs = require('fs');
const path = require('path');

// Mock equipment data
const EQUIPMENT_DATA = [
  {
    name: 'Professional Snow Blower',
    brand: 'Honda',
    model: 'HS1336i',
    year: '2024',
    listing_type: 'rental',
    category: 'Snow Removal',
    description: 'Heavy-duty two-stage snow blower for commercial properties. Features heated grips, LED lights, and electric start.',
    rental_price_daily: 150,
    rental_price_weekly: 600,
    rental_price_monthly: 1800,
    fuel_type: 'gasoline',
    specifications: {
      engine: '389cc Honda GX390',
      clearing_width: '36 inches',
      clearing_height: '21 inches',
      throwing_distance: '50 feet',
      weight: '265 lbs'
    },
    features: ['Electric Start', 'Heated Grips', 'LED Headlight', 'Track Drive', 'Hydrostatic Transmission']
  },
  {
    name: 'CAT 299D3 Skid Steer',
    brand: 'Caterpillar',
    model: '299D3',
    year: '2023',
    listing_type: 'rental',
    category: 'Snow Removal',
    description: 'Compact track loader with snow attachments. Ideal for snow removal, landscaping, and construction.',
    rental_price_daily: 450,
    rental_price_weekly: 1800,
    rental_price_monthly: 5400,
    fuel_type: 'diesel',
    specifications: {
      engine: 'CAT C3.8 Diesel',
      operating_capacity: '3,200 lbs',
      horsepower: '110 HP',
      track_width: '18 inches',
      weight: '11,120 lbs'
    },
    features: ['Enclosed Cab', 'Heat & AC', 'High Flow Hydraulics', 'Backup Camera', 'LED Work Lights']
  },
  {
    name: 'Commercial Zero-Turn Mower',
    brand: 'Exmark',
    model: 'Lazer Z X-Series',
    year: '2024',
    listing_type: 'rental',
    category: 'Lawn Care',
    description: '60" deck commercial-grade zero-turn mower. Professional landscaping equipment.',
    rental_price_daily: 120,
    rental_price_weekly: 450,
    rental_price_monthly: 1350,
    fuel_type: 'gasoline',
    specifications: {
      engine: 'Kohler ECV980 38HP',
      cutting_width: '60 inches',
      fuel_capacity: '12 gallons',
      ground_speed: '13 mph',
      weight: '1,430 lbs'
    },
    features: ['Suspension Seat', 'RED Technology', 'UltraCut Deck', 'Hour Meter', 'Cup Holder']
  },
  {
    name: 'Professional String Trimmer',
    brand: 'Stihl',
    model: 'FS 131 R',
    year: '2024',
    listing_type: 'rental',
    category: 'Lawn Care',
    description: 'Professional-grade gas string trimmer for heavy-duty use.',
    rental_price_daily: 45,
    rental_price_weekly: 180,
    rental_price_monthly: 540,
    fuel_type: 'gasoline',
    specifications: {
      engine: '36.3cc 2-stroke',
      weight: '11.9 lbs',
      fuel_capacity: '23.7 oz',
      cutting_width: '16.5 inches',
      shaft_type: 'Straight'
    },
    features: ['Anti-vibration System', 'Easy2Start', 'Bike Handle', 'Shoulder Strap']
  },
  {
    name: 'Commercial Leaf Blower',
    brand: 'Stihl',
    model: 'BR 800 X MAGNUM',
    year: '2024',
    listing_type: 'rental',
    category: 'Landscaping',
    description: 'Professional-grade backpack leaf blower. Most powerful in its class.',
    rental_price_daily: 80,
    rental_price_weekly: 300,
    rental_price_monthly: 900,
    fuel_type: 'gasoline',
    specifications: {
      engine: '79.9cc 4-MIX',
      air_velocity: '239 mph',
      air_volume: '912 cfm',
      weight: '26 lbs',
      fuel_capacity: '87.9 oz'
    },
    features: ['4-MIX Engine', 'Side-Start', 'Adjustable Tube', 'Hip Belt', 'Anti-vibration System']
  },
  {
    name: 'Bobcat E35 Mini Excavator',
    brand: 'Bobcat',
    model: 'E35',
    year: '2023',
    listing_type: 'rental',
    category: 'Heavy Equipment',
    description: '33.5 HP compact excavator for landscaping and utility work.',
    rental_price_daily: 500,
    rental_price_weekly: 2000,
    rental_price_monthly: 6000,
    fuel_type: 'diesel',
    specifications: {
      engine: 'Kubota D1703 33.5HP',
      operating_weight: '7,659 lbs',
      dig_depth: '10 ft',
      reach: '17.3 ft',
      bucket_capacity: '0.12 cubic yards'
    },
    features: ['Zero Tail Swing', 'Enclosed Cab', 'Hydraulic Thumb', 'Blade', 'LED Lights']
  },
  {
    name: 'Professional Chainsaw',
    brand: 'Stihl',
    model: 'MS 462 C-M',
    year: '2024',
    listing_type: 'rental',
    category: 'Power Tools',
    description: '20" professional chainsaw for tree work and firewood cutting.',
    rental_price_daily: 90,
    rental_price_weekly: 350,
    rental_price_monthly: 1050,
    fuel_type: 'gasoline',
    specifications: {
      engine: '72.2cc 2-stroke',
      power: '6.0 HP',
      weight: '13.2 lbs',
      bar_length: '20 inches',
      chain_speed: '78.7 ft/s'
    },
    features: ['M-Tronic', 'ElastoStart', 'Anti-vibration', 'Side Chain Tensioner', 'HD2 Filter']
  },
  {
    name: 'Core Aerator',
    brand: 'Ryan',
    model: 'Lawnaire V Plus',
    year: '2024',
    listing_type: 'rental',
    category: 'Lawn Care',
    description: 'Walk-behind core aerator for lawn restoration and maintenance.',
    rental_price_daily: 130,
    rental_price_weekly: 500,
    rental_price_monthly: 1500,
    fuel_type: 'gasoline',
    specifications: {
      engine: 'Briggs & Stratton 205cc',
      aerating_width: '28 inches',
      tine_depth: '3 inches',
      productivity: '29,000 sq ft/hr',
      weight: '285 lbs'
    },
    features: ['Self-propelled', 'Removable Weights', 'Flip-up Hood', 'Hour Meter']
  },
  {
    name: 'Plate Compactor',
    brand: 'Wacker Neuson',
    model: 'BPU 3050',
    year: '2024',
    listing_type: 'rental',
    category: 'Heavy Equipment',
    description: 'Reversible plate compactor for soil and asphalt compaction.',
    rental_price_daily: 110,
    rental_price_weekly: 420,
    rental_price_monthly: 1260,
    fuel_type: 'gasoline',
    specifications: {
      engine: 'Honda GX160',
      operating_weight: '207 lbs',
      plate_width: '19.7 inches',
      compaction_force: '11,240 lbs',
      travel_speed: '82 ft/min'
    },
    features: ['Reversible', 'Low Vibration Handle', 'Transport Wheels', 'Hour Meter']
  },
  {
    name: 'Wood Chipper',
    brand: 'Bandit',
    model: 'SG-40',
    year: '2023',
    listing_type: 'rental',
    category: 'Landscaping',
    description: 'Stump grinder for tree removal and land clearing.',
    rental_price_daily: 350,
    rental_price_weekly: 1400,
    rental_price_monthly: 4200,
    fuel_type: 'diesel',
    specifications: {
      engine: 'Kohler 38HP Diesel',
      cutting_capacity: '4 inches',
      rotor_diameter: '19 inches',
      weight: '1,100 lbs',
      chip_discharge: '360 degrees'
    },
    features: ['Auto-feed', 'Hydraulic Feed', 'Reversible Rotor', 'Tow Hitch']
  },
  {
    name: 'Dethatcher',
    brand: 'Bluebird',
    model: 'PR22',
    year: '2024',
    listing_type: 'rental',
    category: 'Lawn Care',
    description: 'Power rake dethatcher for lawn renovation.',
    rental_price_daily: 85,
    rental_price_weekly: 320,
    rental_price_monthly: 960,
    fuel_type: 'gasoline',
    specifications: {
      engine: 'Briggs & Stratton 163cc',
      working_width: '22 inches',
      tine_spacing: '1.5 inches',
      weight: '142 lbs'
    },
    features: ['Adjustable Depth', 'Folding Handle', 'Replaceable Tines']
  },
  {
    name: 'Concrete Mixer',
    brand: 'Kushlan',
    model: '350DD',
    year: '2024',
    listing_type: 'rental',
    category: 'Heavy Equipment',
    description: 'Portable concrete mixer for small to medium projects.',
    rental_price_daily: 75,
    rental_price_weekly: 280,
    rental_price_monthly: 840,
    fuel_type: 'gasoline',
    specifications: {
      engine: 'Kohler 6HP',
      drum_capacity: '3.5 cubic feet',
      batch_capacity: '2.5 cubic feet',
      weight: '235 lbs'
    },
    features: ['Direct Drive', 'Polyethylene Drum', 'Wheelbarrow Design', 'Easy Dump']
  },
  {
    name: 'Pressure Washer',
    brand: 'Simpson',
    model: 'PowerShot 4200',
    year: '2024',
    listing_type: 'rental',
    category: 'Power Tools',
    description: 'Commercial-grade pressure washer for heavy cleaning.',
    rental_price_daily: 95,
    rental_price_weekly: 360,
    rental_price_monthly: 1080,
    fuel_type: 'gasoline',
    specifications: {
      engine: 'Honda GX390',
      pressure: '4200 PSI',
      flow_rate: '4.0 GPM',
      weight: '149 lbs'
    },
    features: ['AAA Triplex Pump', '50ft Hose', 'Quick Connect Tips', 'Pneumatic Tires']
  },
  {
    name: 'Sod Cutter',
    brand: 'Ryan',
    model: 'Pro Sod Cutter',
    year: '2024',
    listing_type: 'rental',
    category: 'Landscaping',
    description: '18" sod cutter for lawn removal and landscaping.',
    rental_price_daily: 140,
    rental_price_weekly: 540,
    rental_price_monthly: 1620,
    fuel_type: 'gasoline',
    specifications: {
      engine: 'Honda GX160',
      cutting_width: '18 inches',
      cutting_depth: '2.5 inches',
      productivity: '9,000 sq ft/hr',
      weight: '340 lbs'
    },
    features: ['Self-propelled', 'Adjustable Depth', 'Pneumatic Tires', 'Blade Guard']
  },
  {
    name: 'Stump Grinder',
    brand: 'Vermeer',
    model: 'SC252',
    year: '2023',
    listing_type: 'rental',
    category: 'Landscaping',
    description: 'Self-propelled stump grinder for tree stump removal.',
    rental_price_daily: 425,
    rental_price_weekly: 1700,
    rental_price_monthly: 5100,
    fuel_type: 'gasoline',
    specifications: {
      engine: 'Kohler 27HP',
      cutting_wheel: '16 teeth',
      cutting_depth: '13 inches',
      cutting_height: '25 inches',
      weight: '1,250 lbs'
    },
    features: ['Auto-sweep', 'Hydraulic Drive', 'SmartSweep', 'Yellow Jacket Cutter System']
  }
];

// Map categories to Odoo fuel types (temporary until proper category field)
function mapCategoryToFuelType(category) {
  const mapping = {
    'Snow Removal': 'diesel',
    'Lawn Care': 'gasoline',
    'Landscaping': 'gasoline',
    'Heavy Equipment': 'diesel',
    'Power Tools': 'gasoline'
  };
  return mapping[category] || 'gasoline';
}

// Convert equipment data to Odoo format
function convertToOdooFormat(equipment, index) {
  const slug = `${equipment.brand.toLowerCase()}-${equipment.model.toLowerCase().replace(/\s+/g, '-')}-${equipment.year}`;

  return {
    id: index + 1,
    name: equipment.name,
    slug: slug,
    brand: equipment.brand,
    model: equipment.model,
    year: equipment.year,
    listing_type: equipment.listing_type,
    sale_price: 0,
    rental_price_daily: equipment.rental_price_daily,
    rental_price_weekly: equipment.rental_price_weekly,
    rental_price_monthly: equipment.rental_price_monthly,
    currency: 'USD',
    fuel_type: equipment.fuel_type,
    seats: 0,
    doors: 0,
    availability_status: 'available',
    featured: index < 6, // First 6 items are featured
    short_description: equipment.description.substring(0, 100),
    full_description: equipment.description,
    specifications: equipment.specifications,
    features: equipment.features.map((feature, idx) => ({
      id: idx + 1,
      name: feature,
      category: 'Standard',
      icon: 'check'
    })),
    primary_image: `/images/equipment/equipment-${index + 1}.jpg`,
    images: [
      {
        id: 1,
        name: `${equipment.name} - Main`,
        url: `/images/equipment/equipment-${index + 1}.jpg`,
        is_primary: true
      }
    ],
    rental_terms: 'Minimum 1 day rental. Valid driver\'s license required. Security deposit required.',
    minimum_rental_days: 1,
    maximum_rental_days: 30,
    view_count: Math.floor(Math.random() * 100) + 10,
    inquiry_count: Math.floor(Math.random() * 20),
    booking_count: Math.floor(Math.random() * 15)
  };
}

// Generate the migration data
function generateMigrationData() {
  const odooData = EQUIPMENT_DATA.map((equipment, index) =>
    convertToOdooFormat(equipment, index)
  );

  // Create output directory
  const outputDir = path.join(__dirname, '../data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON file for import
  const jsonPath = path.join(outputDir, 'odoo-equipment-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(odooData, null, 2));
  console.log(`✅ Generated Odoo equipment data: ${jsonPath}`);

  // Write CSV file for alternate import method
  const csvPath = path.join(outputDir, 'odoo-equipment-data.csv');
  const csvHeader = 'name,brand,model,year,listing_type,rental_price_daily,rental_price_weekly,rental_price_monthly,fuel_type,availability_status,featured,short_description\n';
  const csvRows = odooData.map(item =>
    `"${item.name}","${item.brand}","${item.model}","${item.year}","${item.listing_type}",${item.rental_price_daily},${item.rental_price_weekly},${item.rental_price_monthly},"${item.fuel_type}","${item.availability_status}",${item.featured},"${item.short_description}"`
  ).join('\n');
  fs.writeFileSync(csvPath, csvHeader + csvRows);
  console.log(`✅ Generated CSV data: ${csvPath}`);

  // Generate Python import script for Odoo
  const pythonScript = generatePythonImportScript(odooData);
  const pythonPath = path.join(outputDir, 'import_equipment.py');
  fs.writeFileSync(pythonPath, pythonScript);
  console.log(`✅ Generated Python import script: ${pythonPath}`);

  console.log('\n📋 Summary:');
  console.log(`- Total equipment items: ${odooData.length}`);
  console.log(`- Featured items: ${odooData.filter(i => i.featured).length}`);
  console.log(`- Categories: ${[...new Set(EQUIPMENT_DATA.map(e => e.category))].join(', ')}`);

  return odooData;
}

// Generate Python script for direct Odoo import
function generatePythonImportScript(data) {
  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Equipment Import Script for Odoo 18
Run this script on the Odoo server to import equipment data
"""

import json
import logging
from odoo import api, SUPERUSER_ID

_logger = logging.getLogger(__name__)

EQUIPMENT_DATA = ${JSON.stringify(data, null, 4)}

def import_equipment(env):
    """Import equipment data into fleet.vehicle model"""
    Vehicle = env['fleet.vehicle']

    for item in EQUIPMENT_DATA:
        try:
            # Check if vehicle already exists
            existing = Vehicle.search([('slug', '=', item['slug'])])

            vehicle_data = {
                'name': item['name'],
                'slug': item['slug'],
                'brand': item['brand'],
                'model': item['model'],
                'year': item['year'],
                'listing_type': item['listing_type'],
                'rental_price_daily': item['rental_price_daily'],
                'rental_price_weekly': item['rental_price_weekly'],
                'rental_price_monthly': item['rental_price_monthly'],
                'fuel_type': item['fuel_type'],
                'availability_status': item['availability_status'],
                'featured': item['featured'],
                'short_description': item['short_description'],
                'full_description': item.get('full_description', ''),
                'specifications': json.dumps(item.get('specifications', {})),
                'rental_terms': item.get('rental_terms', ''),
                'minimum_rental_days': item.get('minimum_rental_days', 1),
                'maximum_rental_days': item.get('maximum_rental_days', 30),
            }

            if existing:
                existing.write(vehicle_data)
                _logger.info(f"Updated vehicle: {item['name']}")
            else:
                Vehicle.create(vehicle_data)
                _logger.info(f"Created vehicle: {item['name']}")

        except Exception as e:
            _logger.error(f"Error importing {item['name']}: {str(e)}")

    return True

# If running as a script in Odoo shell
if __name__ == '__main__':
    with api.Environment.manage():
        registry = odoo.registry(dbname)
        with registry.cursor() as cr:
            env = api.Environment(cr, SUPERUSER_ID, {})
            import_equipment(env)
            cr.commit()
`;
}

// Run the migration
if (require.main === module) {
  console.log('🚀 Starting equipment data migration...\n');
  generateMigrationData();
  console.log('\n✅ Migration data generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Upload odoo-equipment-data.json to Odoo via API');
  console.log('2. Or import odoo-equipment-data.csv via Odoo admin interface');
  console.log('3. Or run import_equipment.py directly on Odoo server');
}

module.exports = { generateMigrationData, EQUIPMENT_DATA };