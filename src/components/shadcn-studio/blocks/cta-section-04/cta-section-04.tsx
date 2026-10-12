import { PhoneIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

// Closing call to action in the style of the current site: a full-width
// brand-blue band with a curved top, the heading, a line of text and two
// actions centred.

type CTAProps = {
  title: string
  text?: string
  button: { label: string; href: string }
  phone?: { label: string; display: string; href: string }
  /** Accepted for compatibility; the band has no photo. */
  image?: { src: string; srcset?: string; width?: number; height?: number; alt: string }
}

const CTASection = ({ title, text, button, phone }: CTAProps) => {
  return (
    <section className='bg-background pt-8 sm:pt-12'>
      <div className='from-primary to-brand-deep rounded-t-[50%_4rem] bg-linear-to-b text-white sm:rounded-t-[50%_6rem]'>
        <div className='mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28'>
          <h2 className='text-4xl font-extrabold text-balance lg:text-5xl'>{title}</h2>
          {text && <p className='mt-6 text-lg text-white/85'>{text}</p>}
          <div className='mt-10 flex flex-col justify-center gap-3 sm:flex-row'>
            <Button asChild size='lg' className='text-primary rounded-lg bg-white text-base hover:bg-white/90'>
              <a href={button.href}>{button.label}</a>
            </Button>
            {phone && (
              <Button
                asChild
                size='lg'
                variant='outline'
                className='rounded-lg border-white bg-transparent text-base text-white hover:bg-white/10 hover:text-white'
              >
                <a href={phone.href}>
                  <PhoneIcon />
                  Call us
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
