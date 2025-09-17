import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/lco-2025.png"
                alt="Lake County Outdoors Logo"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <div className="font-bold">Lake County Outdoors, LLC</div>
                <div className="text-sm text-accent">Equipment Rentals</div>
              </div>
            </div>
            <p className="text-neutral-light text-sm">
              Professional equipment rentals for landscaping and snow removal. Serving Edina, Minneapolis, and the entire Twin Cities metro area.
            </p>
            <div className="text-sm text-accent font-semibold">
              Headquarters: Edina, MN
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">Equipment</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/equipment/snow-removal" className="text-neutral-light hover:text-primary transition-colors">
                  Snow Removal
                </Link>
              </li>
              <li>
                <Link href="/equipment/lawn-care" className="text-neutral-light hover:text-primary transition-colors">
                  Lawn Care
                </Link>
              </li>
              <li>
                <Link href="/equipment/landscaping" className="text-neutral-light hover:text-primary transition-colors">
                  Landscaping
                </Link>
              </li>
              <li>
                <Link href="/equipment/heavy-equipment" className="text-neutral-light hover:text-primary transition-colors">
                  Heavy Equipment
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="text-neutral-light hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-light hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-light hover:text-primary transition-colors">
                  Rental Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-neutral-light">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Edina, MN 55435<br />Serving Twin Cities Metro</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:6126550648" className="hover:text-primary transition-colors">
                  612-655-0648
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:rentals@lakecountyoutdoors.com" className="hover:text-primary transition-colors">
                  rentals@lakecountyoutdoors.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-medium">
          <div className="text-center text-neutral-light">
            <p>&copy; {currentYear} Lake County Outdoors, LLC. All rights reserved.</p>
            <p className="text-xs mt-2">Professional Equipment Rentals • Licensed & Insured • Family Owned</p>
          </div>
          <div className="mt-4 text-center space-x-4">
            <Link href="/privacy" className="text-neutral-light hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-neutral-light hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="https://lakecountyoutdoors.com" className="text-neutral-light hover:text-primary transition-colors font-semibold">
              Visit Main LCO Site →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}