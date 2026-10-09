import { ArrowRightIcon, ChevronRightIcon, PauseIcon, PhoneIcon, PlayIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Marquee } from '@/components/ui/marquee'
import { MotionPreset } from '@/components/ui/motion-preset'
import { Rating } from '@/components/ui/rating'

import { cn } from '@/lib/utils'

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
  /** The pill above the heading: a badge and a line of text, optionally linked. */
  pill?: { badge: string; text: string; href?: string }
  heading: string
  text?: string
  actions?: HeroAction[]
  /** Google rating summary with reviewer initials. */
  rating?: { value: number; count: number; href: string; initials: string[] }
  /** Two scrolling columns of photos (home page). */
  columns?: HeroImage[][]
  /** A single photo (inner pages). */
  image?: HeroImage
}

const ActionIcon = ({ icon }: { icon?: HeroAction['icon'] }) =>
  icon === 'phone' ? <PhoneIcon /> : icon === 'arrow' ? <ArrowRightIcon /> : null

const HeroSection = ({ breadcrumbs, pill, heading, text, actions = [], rating, columns, image }: HeroProps) => {
  const isHome = Boolean(columns)

  return (
    <section
      className={cn(
        'from-primary/20 to-background flex flex-1 flex-col bg-linear-to-bl to-50%',
        isHome && 'lg:min-h-[50rem]'
      )}
    >
      <div
        className={cn(
          'mx-auto grid w-full max-w-7xl flex-1 gap-x-19 gap-y-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8',
          !isHome && 'pb-12 lg:pb-16'
        )}
      >
        {/* Left Content */}
        <div className={cn('flex max-w-2xl flex-col justify-center gap-10', isHome ? 'pt-16 pb-12 lg:pt-20' : 'pt-10 lg:pt-16')}>
          <div className='flex flex-col items-start gap-8'>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label='Breadcrumb' className='-mb-2'>
                <ol className='text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm'>
                  {breadcrumbs.map((crumb, index) => {
                    const last = index === breadcrumbs.length - 1
                    return (
                      <li key={crumb.href} className='flex items-center gap-1.5'>
                        {last ? (
                          <span aria-current='page' className='text-foreground font-medium'>
                            {crumb.label}
                          </span>
                        ) : (
                          <>
                            <a href={crumb.href} className='hover:text-primary transition-colors'>
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
              <MotionPreset className='bg-muted flex max-w-full items-center gap-2.5 rounded-full border px-2 py-1 text-sm'>
                <Badge className='shrink-0'>{pill.badge}</Badge>
                {pill.href ? (
                  <a href={pill.href} className='text-muted-foreground hover:text-primary flex items-center gap-1 pr-1 transition-colors'>
                    {pill.text}
                    <ArrowRightIcon className='size-3.5 shrink-0' aria-hidden='true' />
                  </a>
                ) : (
                  <span className='text-muted-foreground pr-1'>{pill.text}</span>
                )}
              </MotionPreset>
            )}

            <MotionPreset
              component='h1'
              className='text-3xl leading-[1.29167] font-bold text-balance sm:text-4xl lg:text-5xl'
            >
              {heading}
            </MotionPreset>

            {text && (
              <MotionPreset component='p' className='text-muted-foreground text-lg'>
                {text}
              </MotionPreset>
            )}

            {actions.length > 0 && (
              <MotionPreset className='flex flex-wrap items-center gap-4'>
                {actions.map((action, index) => (
                  <Button
                    key={action.href}
                    size='lg'
                    asChild
                    className={cn('text-base', index > 0 && 'bg-primary/10 hover:bg-primary/20 text-primary')}
                  >
                    <a href={action.href}>
                      <ActionIcon icon={action.icon} />
                      {action.label}
                      {action.srLabel && <span className='sr-only'> {action.srLabel}</span>}
                    </a>
                  </Button>
                ))}
              </MotionPreset>
            )}
          </div>

          {rating && (
            <>
              <hr className='border-dashed' />

              <MotionPreset className='flex items-center gap-3'>
                {/* Reviewer initials */}
                <AvatarGroup aria-hidden='true' className='**:data-[slot=avatar]:ring-background **:data-[slot=avatar]:ring-2'>
                  {rating.initials.map((initials, index) => (
                    <Avatar key={index} className='size-12'>
                      <AvatarFallback className='bg-secondary text-secondary-foreground text-xs font-semibold'>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {rating.count > rating.initials.length && (
                    <Avatar className='size-12'>
                      <AvatarFallback className='text-xs'>+{rating.count - rating.initials.length}</AvatarFallback>
                    </Avatar>
                  )}
                </AvatarGroup>

                <div className='space-y-1'>
                  {/* Ratings */}
                  <div className='flex gap-0.5'>
                    <Rating readOnly variant='yellow' size={24} value={rating.value} precision={0.5} />
                  </div>

                  <a href={rating.href} target='_blank' rel='noopener' className='hover:text-primary text-sm underline-offset-4 hover:underline'>
                    {rating.value.toFixed(1)} from {rating.count} Google reviews
                  </a>
                </div>
              </MotionPreset>
            </>
          )}
        </div>

        {/* Right Content */}
        {columns && (
          <MotionPreset className='relative grid grid-cols-2 max-lg:hidden' >
            <div data-marquee-root className='contents'>
              {columns.map((column, columnIndex) => (
                <Marquee
                  key={columnIndex}
                  vertical
                  pauseOnHover
                  duration={columnIndex === 0 ? 40 : 44}
                  gap={1.5}
                  repeat={2}
                  reverse={columnIndex === 1}
                  className='h-[50rem] overflow-hidden'
                >
                  {column.map(photo => (
                    <img
                      key={photo.src}
                      src={photo.src}
                      srcSet={photo.srcset}
                      sizes='(min-width: 1280px) 290px, 22vw'
                      width={photo.width}
                      height={photo.height}
                      alt={photo.alt}
                      loading='lazy'
                      decoding='async'
                      className='w-full rounded-2xl object-cover shadow-sm'
                    />
                  ))}
                </Marquee>
              ))}
              <Button
                type='button'
                variant='outline'
                size='icon-sm'
                data-marquee-toggle
                aria-pressed='false'
                className='bg-background/90 absolute right-3 bottom-4 z-1 rounded-full'
              >
                <PauseIcon className='in-data-paused:hidden' aria-hidden='true' />
                <PlayIcon className='hidden in-data-paused:block' aria-hidden='true' />
                <span className='sr-only'>Pause the photo animation</span>
              </Button>
            </div>
          </MotionPreset>
        )}

        {image && (
          <div className='flex items-center lg:pt-16'>
            <img
              src={image.src}
              srcSet={image.srcset}
              sizes='(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 100vw'
              width={image.width}
              height={image.height}
              alt={image.alt}
              fetchPriority='high'
              decoding='async'
              className='aspect-[4/3] w-full rounded-3xl border object-cover shadow-sm'
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSection
