import { PauseIcon, PlayIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Marquee } from '@/components/ui/marquee'

import { GoogleIcon } from '@/components/shadcn-studio/brand-icons'
import TestimonialCard from '@/components/shadcn-studio/blocks/testimonials-component-06/testimonial-card'

import { cn } from '@/lib/utils'

export type TestimonialItem = {
  name: string
  role: string
  content: string
  rating: number
}

type TestimonialsComponentProps = {
  eyebrow?: string
  title: string
  text?: string
  testimonials: TestimonialItem[]
  /** 'marquee' scrolls two rows (sections); 'grid' lists every review in full (the reviews page). */
  layout?: 'marquee' | 'grid'
  links?: { allReviews?: string; google?: string; writeReview?: string }
  muted?: boolean
}

const TestimonialsComponent = ({
  eyebrow = 'Google reviews',
  title,
  text,
  testimonials,
  layout = 'marquee',
  links = {},
  muted = false
}: TestimonialsComponentProps) => {
  const half = Math.ceil(testimonials.length / 2)

  return (
    <section
      className={cn('space-y-12 py-8 sm:space-y-16 sm:py-16 lg:space-y-20 lg:py-24', muted && 'bg-muted/50')}
      data-marquee-root={layout === 'marquee' ? '' : undefined}
    >
      {/* Section Header */}
      <div className='mx-auto max-w-7xl space-y-4 px-4 text-center sm:px-6 lg:px-8'>
        <p className='text-primary text-sm font-medium uppercase'>{eyebrow}</p>
        <h2 className='mx-auto max-w-2xl text-2xl font-semibold sm:text-3xl lg:text-4xl'>{title}</h2>
        {text && <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>{text}</p>}
        {(links.allReviews || links.writeReview || links.google) && (
          <div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
            {links.allReviews && (
              <Button size='lg' className='rounded-lg text-base' asChild>
                <a href={links.allReviews}>See all reviews</a>
              </Button>
            )}
            {links.writeReview && (
              <Button size='lg' variant='outline' className='rounded-lg text-base' asChild>
                <a href={links.writeReview} target='_blank' rel='noopener'>
                  <GoogleIcon />
                  Leave us a review
                </a>
              </Button>
            )}
            {links.google && (
              <Button size='lg' variant='outline' className='rounded-lg text-base' asChild>
                <a href={links.google} target='_blank' rel='noopener'>
                  <GoogleIcon />
                  Read them on Google
                </a>
              </Button>
            )}
          </div>
        )}
      </div>

      {layout === 'grid' ? (
        <ul className='mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8'>
          {testimonials.map((testimonial, index) => (
            <li key={index}>
              <TestimonialCard testimonial={testimonial} clamp={false} />
            </li>
          ))}
        </ul>
      ) : (
        <div className='relative'>
          {/* Testimonials Marquee */}
          <div className='from-background pointer-events-none absolute inset-y-0 left-0 z-1 w-35 bg-linear-to-r to-transparent max-sm:hidden' />
          <div className='from-background pointer-events-none absolute inset-y-0 right-0 z-1 w-35 bg-linear-to-l to-transparent max-sm:hidden' />

          <div className='w-full overflow-hidden'>
            <Marquee pauseOnHover duration={90} gap={1.5} repeat={2}>
              {testimonials.slice(0, half).map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </Marquee>
          </div>

          <div className='w-full overflow-hidden'>
            <Marquee pauseOnHover duration={90} gap={1.5} repeat={2} reverse>
              {testimonials.slice(half).map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </Marquee>
          </div>

          <div className='mt-4 flex justify-center'>
            <Button type='button' variant='outline' size='sm' data-marquee-toggle aria-pressed='false' className='rounded-full'>
              <PauseIcon className='in-data-paused:hidden' aria-hidden='true' />
              <PlayIcon className='hidden in-data-paused:block' aria-hidden='true' />
              Pause reviews
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

export default TestimonialsComponent
