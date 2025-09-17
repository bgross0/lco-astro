import Hero from '@/components/Hero'
import EquipmentCategories from '@/components/EquipmentCategories'
import HowItWorks from '@/components/HowItWorks'
import FeaturedEquipment from '@/components/FeaturedEquipment'
import CTABanner from '@/components/CTABanner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <EquipmentCategories />
        <FeaturedEquipment />
        <HowItWorks />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}