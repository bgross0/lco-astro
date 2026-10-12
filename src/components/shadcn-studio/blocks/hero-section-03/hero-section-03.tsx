import { ArrowRightIcon, ChevronRightIcon, PhoneIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

// Inner-page hero in the style of the current site: the page photo full
// width under a brand-tinted overlay, with breadcrumbs, the headline, a line
// of text and the actions aligned left in white. Pages without a photo get
// the same layout on a solid brand band.

export type HeroImage = {
  src: string
  srcset?: string
  width?: number
  height?: number
  alt: string
}

export type HeroAction = { label: string; href: string; icon?: 'phone' | 'arrow'; srLabel?: string }

export type HeroProps = {
  breadcrumbs?: { label: string; href: string }[]
  /** A line above the heading (blog date and author, the DNR permit). */
  pill?: { badge: string; text: string; href?: string }
  heading: string
  text?: string
  actions?: HeroAction[]
  /** Accepted for compatibility; inner-page heroes do not show the rating. */
  rating?: { value: number; count: number; href: string; initials: string[] }
  image?: HeroImage
}

const ActionIcon = ({ icon }: { icon?: HeroAction['icon'] }) =>
  icon === 'phone' ? <PhoneIcon /> : icon === 'arrow' ? <ArrowRightIcon /> : null

const HeroSection = ({ breadcrumbs, pill, heading, text, actions = [], image }: HeroProps) => {
  return (
    <section className={cn('relative isolate flex min-h-[22rem] items-center overflow-hidden md:min-h-[26rem]', !image && 'bg-primary')}>
      {image && (
        <>
          <img
            src={image.src}
            srcSet={image.srcset}
            sizes='100vw'
            width={image.width}
            height={image.height}
            alt=''
            fetchPriority='high'
            className='absolute inset-0 -z-20 size-full object-cover'
          />
          <div className='bg-primary/60 from-brand-ink/40 to-brand-ink/20 absolute inset-0 -z-10 bg-linear-to-r' aria-hidden='true' />
        </>
      )}

      <div className='mx-auto w-full max-w-7xl px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20'>
        <div className='flex max-w-3xl flex-col items-start gap-5'>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label='Breadcrumb' className='max-w-full'>
              <ol className='flex flex-wrap items-center gap-1.5 text-sm text-white/80'>
                {breadcrumbs.map((crumb, index) => {
                  const last = index === breadcrumbs.length - 1
                  return (
                    <li key={crumb.href} className='flex items-center gap-1.5'>
                      {last ? (
                        <span aria-current='page' className='font-medium text-white'>
                          {crumb.label}
                        </span>
                      ) : (
                        <>
                          <a href={crumb.href} className='transition-colors hover:text-white'>
                            {crumb.label}
                          </a>
                          <ChevronRightIcon className='size-3.5' aria-hidden='true' />
                        </>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          )}

          {pill && (
            <p className='text-sm text-white/85'>
              {pill.badge} · {pill.text}
            </p>
          )}

          <h1 className='text-4xl leading-tight font-extrabold text-balance drop-shadow-sm sm:text-5xl lg:text-6xl'>{heading}</h1>

          {text && <p className='max-w-2xl text-lg text-white/90 lg:text-xl'>{text}</p>}

          {actions.length > 0 && (
            <div className='flex flex-wrap gap-3 pt-1'>
              {actions.map((action, index) => (
                <Button
                  key={action.href}
                  asChild
                  size='lg'
                  variant={index === 0 ? 'default' : 'outline'}
                  className={
                    index === 0
                      ? 'text-primary rounded-lg bg-white text-base hover:bg-white/90'
                      : 'rounded-lg border-white bg-transparent text-base text-white hover:bg-white/10 hover:text-white'
                  }
                >
                  <a href={action.href} aria-label={action.srLabel}>
                    {action.icon === 'phone' && <ActionIcon icon='phone' />}
                    {action.label}
                    {action.icon === 'arrow' && <ActionIcon icon='arrow' />}
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
