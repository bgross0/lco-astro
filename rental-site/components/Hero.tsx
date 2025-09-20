import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative text-white" style={{
      backgroundImage: 'url(/images/equipment/main-equipment-pic.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80"></div>
      <div className="container-custom py-24 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline - Benefit Focused */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
            Get Professional Equipment.
            <span className="block">Skip the Storage Hassle.</span>
          </h1>

          {/* Single Strong CTA */}
          <Link
            href="/equipment"
            className="btn bg-white text-primary hover:bg-gray-100 px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all inline-block"
          >
            See Available Equipment →
          </Link>

          {/* Supporting Details - After CTA */}
          <p className="text-base text-white/70 mt-6">
            Snow blowers, mowers, excavators • Hourly rentals from $35
          </p>

          {/* Trust Elements */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>500+ Local Contractors Trust Us</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Edina, MN • Serving Twin Cities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}