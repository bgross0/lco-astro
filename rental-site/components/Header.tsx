'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/lco-2025.png"
              alt="Lake County Outdoors Logo"
              width={80}
              height={80}
              className="transition-transform group-hover:scale-105"
            />
            <div>
              <div className="text-xl font-bold text-primary">Lake County Outdoors</div>
              <div className="text-sm text-accent font-semibold">Equipment Rentals</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/equipment" className="text-neutral-dark hover:text-primary transition-colors">
              Browse Equipment
            </Link>
            <Link href="/about" className="text-neutral-dark hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-neutral-dark hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/equipment" className="text-neutral-dark hover:text-primary transition-colors py-2">
                Browse Equipment
              </Link>
              <Link href="/about" className="text-neutral-dark hover:text-primary transition-colors py-2">
                About
              </Link>
              <Link href="/contact" className="text-neutral-dark hover:text-primary transition-colors py-2">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}