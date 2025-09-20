import Link from 'next/link'

export default function FeaturedEquipment() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Equipment</h2>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Browse our full catalog of professional equipment for your next project.
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-neutral-medium mb-6">
            Check out our complete equipment catalog
          </p>
          <Link href="/equipment" className="btn btn-primary">
            View All Equipment
          </Link>
        </div>
      </div>
    </section>
  )
}