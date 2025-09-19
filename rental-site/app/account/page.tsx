import Link from 'next/link'

export default function AccountPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4 text-white">My Rentals</h1>
          <p className="text-xl text-blue-50">Manage your equipment rentals and rental history</p>
        </div>
      </section>

      {/* Account Content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Coming Soon Notice */}
          <div className="card p-8 text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Account Portal Coming Soon</h2>
            <p className="text-lg text-neutral-medium mb-6">
              We're working on building a comprehensive account portal where you'll be able to:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-left">
                <h3 className="font-semibold mb-3 text-neutral-dark">Track Rentals</h3>
                <ul className="space-y-2 text-neutral-medium">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    View current rentals
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Check rental history
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Download receipts
                  </li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-3 text-neutral-dark">Manage Bookings</h3>
                <ul className="space-y-2 text-neutral-medium">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Modify rental dates
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Cancel reservations
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Update contact info
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Need to Book Equipment?</h3>
              <p className="text-neutral-medium mb-4">
                Browse our equipment catalog and contact us to schedule your rental.
              </p>
              <Link href="/equipment" className="btn btn-primary">
                Browse Equipment
              </Link>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Questions About a Rental?</h3>
              <p className="text-neutral-medium mb-4">
                Contact us directly for assistance with existing or upcoming rentals.
              </p>
              <Link href="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4 text-primary">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-neutral-dark mb-2">Phone</p>
                <a href="tel:6126550648" className="text-primary hover:underline">
                  612-655-0648
                </a>
              </div>
              <div>
                <p className="font-semibold text-neutral-dark mb-2">Email</p>
                <a href="mailto:rentals@lakecountyoutdoors.com" className="text-primary hover:underline">
                  rentals@lakecountyoutdoors.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}