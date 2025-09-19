export interface Equipment {
  id: number
  name: string
  category: string
  description?: string
  hourly_rate: number
  daily_rate: number
  weekly_rate: number
  available: boolean
  image_url?: string
}

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 1,
    name: 'Professional Snow Blower',
    category: 'Snow Removal',
    description: 'Heavy-duty two-stage snow blower for commercial properties',
    hourly_rate: 45,
    daily_rate: 150,
    weekly_rate: 600,
    image_url: '/images/snow-removal/snow-removal-hero-600x300.jpg',
    available: true,
  },
  {
    id: 2,
    name: 'CAT 299D3 Skid Steer',
    category: 'Snow Removal',
    description: 'Compact track loader with snow attachments',
    hourly_rate: 125,
    daily_rate: 450,
    weekly_rate: 1800,
    image_url: '/images/snow-removal/cat-299d3-snow.jpg',
    available: true,
  },
  {
    id: 3,
    name: 'Commercial Zero-Turn Mower',
    category: 'Lawn Care',
    description: '60" deck commercial-grade zero-turn mower',
    hourly_rate: 35,
    daily_rate: 120,
    weekly_rate: 450,
    image_url: '/images/equipment/equipment-2-600x616.jpg',
    available: true,
  },
  {
    id: 4,
    name: 'String Trimmer',
    category: 'Lawn Care',
    description: 'Professional gas trimmer',
    hourly_rate: 15,
    daily_rate: 45,
    weekly_rate: 180,
    image_url: '/equipment/trimmer.jpg',
    available: false,
  },
  {
    id: 5,
    name: 'Commercial Leaf Blower',
    category: 'Landscaping',
    description: 'Professional-grade backpack leaf blower',
    hourly_rate: 25,
    daily_rate: 80,
    weekly_rate: 300,
    image_url: '/images/equipment/equipment-3-600x409.jpg',
    available: true,
  },
  {
    id: 6,
    name: 'Bobcat E35 Mini Excavator',
    category: 'Heavy Equipment',
    description: '33.5 HP compact excavator for landscaping and utility work',
    hourly_rate: 125,
    daily_rate: 500,
    weekly_rate: 2000,
    image_url: '/images/bobcat-excavator.jpg',
    available: false,
  },
  {
    id: 7,
    name: 'Chainsaw',
    category: 'Power Tools',
    description: '20" professional chainsaw',
    hourly_rate: 30,
    daily_rate: 90,
    weekly_rate: 350,
    image_url: '/equipment/chainsaw.jpg',
    available: true,
  },
  {
    id: 8,
    name: 'Core Aerator',
    category: 'Lawn Care',
    description: 'Walk-behind core aerator for lawn restoration',
    hourly_rate: 40,
    daily_rate: 130,
    weekly_rate: 500,
    image_url: '/images/equipment/equipment-4-600x389.jpg',
    available: true,
  },
  {
    id: 9,
    name: 'Commercial Pressure Washer',
    category: 'Power Tools',
    description: '4000 PSI hot water pressure washer',
    hourly_rate: 35,
    daily_rate: 100,
    weekly_rate: 400,
    image_url: '/images/equipment/equipment-5-600x451.jpg',
    available: true,
  },
  {
    id: 10,
    name: 'Hedge Trimmer',
    category: 'Landscaping',
    description: 'Professional gas hedge trimmer',
    hourly_rate: 20,
    daily_rate: 60,
    weekly_rate: 240,
    image_url: '/equipment/hedge-trimmer.jpg',
    available: true,
  },
]

// Get featured equipment (first 4 available items)
export const FEATURED_EQUIPMENT = MOCK_EQUIPMENT.slice(0, 4)

// Equipment categories
export const EQUIPMENT_CATEGORIES = [
  'All',
  'Skid Steers',
  'Excavators',
  'Trailers',
  'Power Tools',
  'Loaders'
]