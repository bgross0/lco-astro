import { ArrowRightIcon, PhoneIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { MotionPreset } from '@/components/ui/motion-preset'

type CTAProps = {
  title: string
  text?: string
  button: { label: string; href: string }
  phone?: { label: string; display: string; href: string }
  image: { src: string; srcset?: string; width?: number; height?: number; alt: string }
}

const CTASection = ({ title, text, button, phone, image }: CTAProps) => {
  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Card className='relative rounded-[24px] border-none bg-black py-12 shadow-none sm:py-16'>
          <CardContent className='flex items-center gap-16 px-6 sm:max-lg:flex-col md:px-12 lg:grid lg:grid-cols-2'>
            <MotionPreset className='relative w-full max-sm:hidden lg:self-stretch'>
              <img
                src={image.src}
                srcSet={image.srcset}
                sizes='(min-width: 1280px) 560px, (min-width: 1024px) 44vw, 90vw'
                width={image.width}
                height={image.height}
                alt={image.alt}
                loading='lazy'
                decoding='async'
                className='aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl max-lg:mx-auto max-lg:max-h-80 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:scale-105'
              />
            </MotionPreset>
            <div className='space-y-4 xl:justify-self-end'>
              <MotionPreset component='h2' className='text-2xl font-semibold text-white md:text-3xl lg:text-4xl'>
                {title}
              </MotionPreset>

              {text && (
                <MotionPreset component='p' className='text-xl text-white'>
                  {text}
                </MotionPreset>
              )}

              <MotionPreset className='flex flex-wrap gap-3 pt-2'>
                <Button asChild size='lg' variant='secondary' className='rounded-lg text-base has-[>svg]:px-6'>
                  <a href={button.href} className='inline-flex items-center gap-2'>
                    {button.label}
                    <ArrowRightIcon className='size-5' />
                  </a>
                </Button>
                {phone && (
                  <Button
                    asChild
                    size='lg'
                    variant='outline'
                    className='rounded-lg border-white/40 bg-transparent text-base text-white hover:bg-white/10 hover:text-white has-[>svg]:px-6'
                  >
                    <a href={phone.href}>
                      <PhoneIcon className='size-5' />
                      Call us {phone.display}
                    </a>
                  </Button>
                )}
              </MotionPreset>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CTASection
