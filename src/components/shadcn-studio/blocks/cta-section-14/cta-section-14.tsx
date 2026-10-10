import { ArrowRightIcon } from 'lucide-react'

// Component Imports
import { MatterButton } from '@/components/ui/matter-button'
import { Card, CardContent } from '@/components/ui/card'
import { MotionPreset } from '@/components/ui/motion-preset'

type CTAProps = {
  title: string
  text: string
  button: { label: string; href: string }
  background: string
  image: { src: string; alt: string }
}

const CTA = ({ title, text, button, background, image }: CTAProps) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <MotionPreset fade blur slide={{ direction: 'down', offset: 50 }} transition={{ duration: 0.7 }}>
          <Card className='group relative z-1 overflow-hidden rounded-2xl border-0 py-0 shadow-none'>
            <div className='absolute inset-0 -z-1'>
              <img src={background} alt='' loading='lazy' className='h-full w-full object-cover' />
            </div>
            <CardContent className='lg:px-14'>
              <div className='grid grid-cols-1 items-end gap-5 lg:grid-cols-2 lg:gap-10'>
                {/* Left Column - Content */}
                <div className='flex h-full flex-col justify-center space-y-8 py-6 text-white'>
                  <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
                    {title}
                  </h2>

                  <p className='text-base leading-relaxed opacity-80 md:text-xl'>
                    {text}
                  </p>

                  <div>
                    <MatterButton size='lg' asChild>
                      <a href={button.href}>
                        {button.label}
                        <ArrowRightIcon className='h-4 w-4 -rotate-45' />
                      </a>
                    </MatterButton>
                  </div>
                </div>

                {/* Right Column - Image */}
                <div className='relative pt-6'>
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading='lazy'
                    className='w-full rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105 max-lg:mx-auto max-lg:max-w-100'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionPreset>
      </div>
    </section>
  )
}

export default CTA
