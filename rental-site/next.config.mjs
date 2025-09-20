/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lakecountyoutdoors.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'lco.axsys.app',
        pathname: '/web/image/**',
      },
    ],
  },
  env: {
    ODOO_API_URL: process.env.ODOO_API_URL || 'https://lco-crm.axsys.app',
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || '',
  },
  async rewrites() {
    return [
      {
        source: '/api/odoo/:path*',
        destination: `${process.env.ODOO_API_URL || 'https://lco.axsys.app'}/api/:path*`,
      },
      {
        source: '/web/image/:path*',
        destination: `${process.env.ODOO_API_URL || 'https://lco.axsys.app'}/web/image/:path*`,
      },
    ]
  },
}

export default nextConfig