'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="gradient-bg text-white py-12">
          <div className="container-custom">
            <h1 className="text-4xl font-bold mb-4 text-white">About LCO Equipment Rentals</h1>
            <p className="text-xl text-blue-50">
              Your trusted partner for professional equipment rentals in the Twin Cities
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Extending Our Service to Equipment Rentals</h2>
                <p className="text-lg text-neutral-medium mb-4">
                  Lake County Outdoors has been serving the Twin Cities metro area with professional
                  landscaping and snow removal services for years. Now, we're excited to offer our
                  high-quality equipment for rent to contractors, businesses, and homeowners who
                  prefer to handle their own projects.
                </p>
                <p className="text-lg text-neutral-medium">
                  We understand that not every project requires hiring a full service crew. That's why
                  we've made our professional-grade equipment available for hourly, daily, and weekly
                  rentals at competitive rates.
                </p>
              </div>

              {/* Why Choose Us */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Why Choose LCO Equipment Rentals?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold mb-3 text-primary">Well-Maintained Fleet</h3>
                    <p className="text-neutral-medium">
                      As a professional service company, we maintain our equipment to the highest
                      standards. Every piece is serviced regularly and thoroughly inspected before
                      each rental.
                    </p>
                  </div>
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold mb-3 text-primary">Expert Guidance</h3>
                    <p className="text-neutral-medium">
                      Our team uses this equipment daily. We can provide tips, best practices, and
                      guidance to help you get the most out of your rental.
                    </p>
                  </div>
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold mb-3 text-primary">Flexible Terms</h3>
                    <p className="text-neutral-medium">
                      From hourly rentals for quick jobs to weekly rates for larger projects, we
                      offer flexible rental periods to match your needs.
                    </p>
                  </div>
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold mb-3 text-primary">Local & Accessible</h3>
                    <p className="text-neutral-medium">
                      Conveniently located in Edina, we're easily accessible from anywhere in the
                      Twin Cities metro area. Quick pickup and return process.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Area */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Service Area</h2>
                <div className="card p-8">
                  <p className="text-lg text-neutral-medium mb-4">
                    We proudly serve the entire Twin Cities metro area, with our headquarters in Edina.
                    Our primary service areas include:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Edina
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Minneapolis
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        St. Paul
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Bloomington
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Minnetonka
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Eden Prairie
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        St. Louis Park
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Hopkins
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        And more!
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Rent?</h2>
                <p className="text-lg text-neutral-medium mb-8">
                  Browse our equipment catalog to find the right tools for your project.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/equipment" className="btn btn-primary">
                    Browse Equipment
                  </Link>
                  <Link href="/contact" className="btn btn-outline">
                    Contact Us
                  </Link>
                </div>
                <p className="mt-8 text-neutral-medium">
                  Learn more about our full range of services at{' '}
                  <a href="https://lakecountyoutdoors.com" className="text-primary hover:underline">
                    lakecountyoutdoors.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}