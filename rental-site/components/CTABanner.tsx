import Link from 'next/link'

export default function CTABanner() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Join hundreds of satisfied customers who trust Lake County Outdoors for their equipment rental needs.
            Professional tools, fair prices, excellent service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/equipment" className="btn bg-white text-primary hover:bg-gray-100 px-8 py-4">
              Browse Equipment
            </Link>
            <Link href="tel:763-291-4105" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-4">
              <svg className="w-5 h-5 inline-block mr-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (763) 291-4105
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-blue-100">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Flexible Rental Periods</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}