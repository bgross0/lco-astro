import { useState } from 'react'

import { ArrowRightIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { cn } from '@/lib/utils'

export type AboutMedia = {
  type?: 'image' | 'video'
  src: string
  srcset?: string
  width?: number
  height?: number
  alt: string
  /** Poster image for a video. */
  poster?: string
}

export type AboutTab = {
  name: string
  value: string
  paragraphs: string[]
  stats?: { value: string; label: string }[]
  tags?: string[]
  media?: AboutMedia
}

type AboutUsProps = {
  title: string
  text?: string
  button?: { label: string; href: string }
  contentTitle?: string
  contentDescription?: string
  /** Rendered Markdown for the left column (service and city pages). */
  contentHtml?: string
  proseClassName?: string
  tabs?: AboutTab[]
  media: AboutMedia
  /** The small card overlapping the photo: the LCO badge or the Google rating. */
  badge?: { logo: true } | { rating: number; count: number; href: string }
  muted?: boolean
}

const Media = ({ media, className, hidden }: { media: AboutMedia; className: string; hidden?: boolean }) =>
  media.type === 'video' ? (
    <video
      controls
      preload='none'
      playsInline
      poster={media.poster}
      aria-label={media.alt}
      hidden={hidden}
      className={className}
    >
      <source src={media.src} type='video/mp4' />
    </video>
  ) : (
    <img
      src={media.src}
      srcSet={media.srcset}
      sizes='(min-width: 1024px) 424px, (min-width: 480px) 424px, 90vw'
      width={media.width}
      height={media.height}
      alt={media.alt}
      loading='lazy'
      decoding='async'
      hidden={hidden}
      className={className}
    />
  )

const AboutUs = ({
  title,
  text,
  button,
  contentTitle,
  contentDescription,
  contentHtml,
  proseClassName,
  tabs,
  media,
  badge = { logo: true },
  muted = false
}: AboutUsProps) => {
  const [active, setActive] = useState(tabs?.[0]?.value ?? '')
  const mediaClass = 'aspect-[4/5] w-full rounded-tl-[48px] rounded-tr-lg rounded-b-md bg-muted object-cover'

  const left = (
    <div className='min-w-0 space-y-6'>
      {contentTitle && <h3 className='text-xl font-semibold'>{contentTitle}</h3>}
      {contentDescription && <p className='text-muted-foreground'>{contentDescription}</p>}
      {contentHtml && <div className={proseClassName} dangerouslySetInnerHTML={{ __html: contentHtml }} />}

      {tabs && tabs.length > 0 && (
        <>
          {(contentTitle || contentDescription || contentHtml) && <Separator />}

          <div className='overflow-x-auto pb-1'>
            <TabsList>
              {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} forceMount className='space-y-4 data-[state=inactive]:hidden'>
              {tab.paragraphs.map((paragraph, index) => (
                <p key={index} className='text-muted-foreground'>
                  {paragraph}
                </p>
              ))}
              {tab.stats && (
                <dl className='grid grid-cols-2 gap-4 pt-2'>
                  {tab.stats.map(stat => (
                    <div key={stat.label} className='bg-muted flex flex-col-reverse rounded-xl p-4 text-center'>
                      <dt className='text-muted-foreground text-sm font-medium uppercase'>{stat.label}</dt>
                      <dd className='text-primary font-heading text-3xl font-semibold'>{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {tab.tags && (
                <ul className='flex flex-wrap gap-2 pt-2'>
                  {tab.tags.map(tag => (
                    <li key={tag}>
                      <Badge variant='secondary' className='px-3 py-1 text-sm'>
                        {tag}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          ))}
        </>
      )}
    </div>
  )

  const tabMedia = tabs?.filter(tab => tab.media) ?? []

  const right = (
    <div className='flex justify-center pb-8 lg:justify-end'>
      <div className='bg-primary/10 relative flex w-full max-w-md items-end rounded-tl-[60px] rounded-tr-xl p-3'>
        {tabMedia.length > 0 ? (
          tabMedia.map(tab => (
            <Media key={tab.value} media={tab.media!} className={mediaClass} hidden={tab.value !== active} />
          ))
        ) : (
          <Media media={media} className={mediaClass} />
        )}
        <div className='absolute -bottom-8 left-0 sm:-left-15'>
          {'logo' in badge ? (
            <div className='bg-background ring-border flex size-32 items-center justify-center rounded-full p-2 shadow-lg ring-1 sm:size-36'>
              <img src='/images/brand/lco-logo-128w.webp' alt='' width={128} height={128} loading='lazy' className='size-full' />
            </div>
          ) : (
            <a
              href={badge.href}
              target='_blank'
              rel='noopener'
              className='bg-background flex max-w-44 flex-col items-start gap-1 rounded-xl border p-4 shadow-lg'
            >
              <span className='font-heading text-3xl font-semibold'>{badge.rating.toFixed(1)}</span>
              <Rating readOnly variant='yellow' size={16} value={badge.rating} precision={0.5} />
              <span className='text-muted-foreground text-sm'>{badge.count} Google reviews</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className={cn('py-8 sm:py-16 lg:py-24', muted && 'bg-muted')}>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center md:mb-16 lg:mb-20'>
          <h2 className='mx-auto max-w-3xl text-2xl font-semibold md:text-3xl lg:text-4xl'>{title}</h2>
          {text && <p className='text-muted-foreground mx-auto max-w-3xl text-xl'>{text}</p>}
          {button && (
            <Button size='lg' asChild className='rounded-lg text-base has-[>svg]:px-6'>
              <a href={button.href}>
                {button.label}
                <ArrowRightIcon />
              </a>
            </Button>
          )}
        </div>

        {tabs && tabs.length > 0 ? (
          <Tabs value={active} onValueChange={setActive} className='grid items-center gap-16 lg:grid-cols-2'>
            {left}
            {right}
          </Tabs>
        ) : (
          <div className='grid items-start gap-16 lg:grid-cols-2'>
            {left}
            <div className='lg:sticky lg:top-28'>{right}</div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AboutUs
