import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="gradient-bg text-white py-12">
          <div className="container-custom">
            <h1 className="text-4xl font-bold mb-4 text-white">Contact Us</h1>
            <p className="text-xl text-blue-50">
              Get in touch for equipment rentals or questions
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Request a Rental Quote</h2>
                <p className="text-neutral-medium mb-8">
                  Fill out the form below and we'll get back to you within 24 hours with availability and pricing.
                </p>

                <form action="https://formsubmit.co/cadenf@lakecountyoutdoor.com" method="POST" className="space-y-6">
                  {/* FormSubmit Configuration */}
                  <input type="hidden" name="_subject" value="[RENTAL] New Equipment Inquiry" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  {/* Form Source Identifier */}
                  <input type="hidden" name="form_source" value="rental-site" />
                  <input type="hidden" name="form_type" value="equipment-rental-inquiry" />
                  <input type="hidden" name="website" value="rental.lakecountyoutdoor.com" />
                  {/* Redirect to thank you page after submission */}
                  <input type="hidden" name="_next" value="https://rental.lakecountyoutdoor.com/thank-you" />
                  {/* Webhook URL for Odoo CRM integration */}
                  <input type="hidden" name="_webhook" value="https://lco.axsyslabs.com/submitform/webhook/6fVTQR-DHvK0K9IrKe10faFLYiu_mco5z5ibXrlMeac" />
                  {/* Honeypot spam protection */}
                  <input type="text" name="_honey" style={{ display: 'none' }} />
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="equipment" className="block text-sm font-semibold mb-2">
                      Equipment Needed
                    </label>
                    <select
                      id="equipment"
                      name="equipment"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select equipment category</option>
                      <option value="snow-removal">Snow Removal Equipment</option>
                      <option value="lawn-care">Lawn Care Equipment</option>
                      <option value="landscaping">Landscaping Equipment</option>
                      <option value="heavy-equipment">Heavy Equipment</option>
                      <option value="power-tools">Power Tools</option>
                      <option value="multiple">Multiple Categories</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rentalDates" className="block text-sm font-semibold mb-2">
                      Rental Dates
                    </label>
                    <input
                      type="text"
                      id="rentalDates"
                      name="rentalDates"
                      placeholder="e.g., March 15-17 or Next Week"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2">
                      Additional Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us more about your project or specific equipment needs..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full md:w-auto px-8 py-4"
                  >
                    Submit Rental Request
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="lg:pl-12">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>

                <div className="space-y-8">
                  {/* Phone */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Call Us</h3>
                    <p className="text-lg">
                      <a href="tel:763-291-4105" className="text-neutral-medium hover:text-primary">
                        (763) 291-4105
                      </a>
                    </p>
                    <p className="text-sm text-neutral-medium mt-1">
                      Mon-Fri: 7:00 AM - 6:00 PM<br />
                      Saturday: 8:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Email</h3>
                    <p className="text-lg">
                      <a href="mailto:rentals@lakecountyoutdoors.com" className="text-neutral-medium hover:text-primary">
                        rentals@lakecountyoutdoors.com
                      </a>
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Visit Our Yard</h3>
                    <p className="text-neutral-medium">
                      Lake County Outdoors<br />
                      7777 Washington Ave S, Suite 4<br />
                      Edina, MN 55439<br />
                      <span className="text-sm">(Equipment pickup by appointment)</span>
                    </p>
                  </div>

                  {/* Quick Info */}
                  <div className="card p-6 bg-neutral-extra-light">
                    <h3 className="text-lg font-semibold mb-4">Rental Information</h3>
                    <ul className="space-y-3 text-neutral-medium">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Hourly, daily, and weekly rates available</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Valid driver's license required</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Delivery available for select equipment</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Insurance requirements may apply</span>
                      </li>
                    </ul>
                  </div>

                  {/* Emergency */}
                  <div className="border-t pt-8">
                    <p className="text-sm text-neutral-medium">
                      <strong>24/7 Emergency Support:</strong> For equipment emergencies during your rental,
                      call <a href="tel:952-555-0911" className="text-primary hover:underline">(952) 555-0911</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Service Area</h2>
              <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
                Proudly serving Hennepin County and surrounding counties throughout the Minneapolis-St. Paul metro area
              </p>
            </div>

            <div className="rounded-xl overflow-hidden shadow-xl bg-neutral-extra-light">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d723621.8990398735!2d-93.6319107!3d45.0059978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b2d4e3f3f3f3f3%3A0x3f3f3f3f3f3f3f3f!2sHennepin%20County%2C%20MN!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="500"
                style={{ border: 0, filter: 'grayscale(20%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lake County Outdoors Equipment Rental Service Area - Hennepin County and Surrounding Areas"
                className="transition-all duration-300 hover:grayscale-0"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}