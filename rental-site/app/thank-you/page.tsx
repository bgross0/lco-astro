import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main>
        {/* Thank You Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Thank You Message */}
              <h1 className="text-4xl font-bold mb-4 text-neutral-dark">
                Thank You for Your Inquiry!
              </h1>

              <p className="text-xl text-neutral-medium mb-8">
                We've received your rental equipment request and will get back to you within 24 hours.
              </p>

              {/* What's Next */}
              <div className="card p-8 mb-8 text-left">
                <h2 className="text-2xl font-bold mb-4 text-primary">What happens next?</h2>
                <div className="space-y-4 text-neutral-medium">
                  <div className="flex items-start">
                    <span className="text-primary font-bold mr-3">1.</span>
                    <p>Our equipment rental team will review your request and check availability.</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary font-bold mr-3">2.</span>
                    <p>We'll contact you via email or phone with a detailed quote and availability confirmation.</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary font-bold mr-3">3.</span>
                    <p>Once confirmed, we'll arrange pickup or delivery based on your preference.</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-neutral-extra-light rounded-xl p-6 mb-8">
                <p className="text-neutral-dark mb-4">
                  <strong>Need immediate assistance?</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="tel:763-291-4105"
                    className="flex items-center text-primary hover:text-primary-dark font-semibold"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    (763) 291-4105
                  </a>
                  <span className="text-neutral-medium hidden sm:block">|</span>
                  <a
                    href="mailto:rentals@lakecountyoutdoors.com"
                    className="flex items-center text-primary hover:text-primary-dark font-semibold"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    rentals@lakecountyoutdoors.com
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/equipment" className="btn btn-primary">
                  Browse More Equipment
                </Link>
                <Link href="/" className="btn btn-outline">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}