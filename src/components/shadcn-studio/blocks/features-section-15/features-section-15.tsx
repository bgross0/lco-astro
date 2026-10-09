import { useEffect, useState } from 'react'

import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { MotionPreset } from '@/components/ui/motion-preset'

import { cn } from '@/lib/utils'

export type FeatureCard = {
  title: string
  summary: string
  href: string
  image: { src: string; srcset?: string; width?: number; height?: number; alt: string }
}

/** A tab holds either cards (services) or a block of HTML copy. */
export type FeatureTab = {
  name: string
  value: string
  cards?: FeatureCard[]
  html?: string
}

type FeaturesProps = {
  id?: string
  eyebrow: string
  title: string
  text?: string
  button?: { label: string; href: string }
  tabs: FeatureTab[]
  /** Classes for the copy inside html tabs (see src/lib/prose.ts). */
  proseClassName?: string
}

const Features = ({ id, eyebrow, title, text, button, tabs, proseClassName }: FeaturesProps) => {
  const [active, setActive] = useState(tabs[0]?.value)

  // /services#tree-services opens that category's tab.
  useEffect(() => {
    const open = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      if (tabs.some(tab => tab.value === hash)) setActive(hash)
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [tabs])

  return (
    <section id={id} className='scroll-mt-24 py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-20'>
          <MotionPreset>
            <div className='text-primary text-sm font-medium uppercase'>{eyebrow}</div>
          </MotionPreset>
          <MotionPreset component='h2' className='mx-auto max-w-2xl text-2xl font-semibold md:text-3xl lg:text-4xl'>
            {title}
          </MotionPreset>
          {text && <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>{text}</p>}
          {button && (
            <MotionPreset>
              <Button size='lg' className='rounded-lg text-base' asChild>
                <a href={button.href}>{button.label}</a>
              </Button>
            </MotionPreset>
          )}
        </div>

        <div className='relative w-full'>
          {/* Anchors for /services#<category> links */}
          {tabs
            .filter(tab => tab.cards)
            .map(tab => (
              <span key={tab.value} id={tab.value} className='absolute -top-28 left-0' aria-hidden='true' />
            ))}
          <Tabs value={active} onValueChange={setActive} className='w-full gap-8'>
            <MotionPreset className={cn('w-full overflow-x-auto overflow-y-clip', tabs.length < 2 && 'hidden')}>
              <TabsList variant='line' className='w-full justify-start gap-0 border-b-2 p-0'>
                {tabs.map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='text-base group-data-[orientation=horizontal]/tabs:after:-bottom-0.75'
                  >
                    {tab.name}
                    {tab.cards && (
                      <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs'>{tab.cards.length}</span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </MotionPreset>
            <MotionPreset>
              {tabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value} forceMount className='scroll-mt-28 data-[state=inactive]:hidden'>
                  <div className='rounded-3xl border p-4 sm:p-6 lg:p-8'>
                    {tab.cards && (
                      <ul className='grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
                        {tab.cards.map(card => (
                          <li key={card.href}>
                            <a
                              href={card.href}
                              className='group/card bg-card hover:border-primary/40 focus-visible:ring-ring/50 flex h-full overflow-hidden rounded-2xl border transition-colors focus-visible:ring-[3px] focus-visible:outline-none sm:flex-col'
                            >
                              <img
                                src={card.image.src}
                                srcSet={card.image.srcset}
                                sizes='(min-width: 1024px) 380px, (min-width: 640px) 45vw, 112px'
                                width={card.image.width}
                                height={card.image.height}
                                alt=''
                                loading='lazy'
                                decoding='async'
                                className='aspect-square w-28 shrink-0 object-cover transition-transform duration-300 group-hover/card:scale-[1.02] sm:aspect-[16/10] sm:w-full'
                              />
                              <div className='flex min-w-0 flex-1 flex-col justify-center gap-1 p-4 sm:justify-start sm:gap-2 sm:p-5'>
                                <h3 className='font-semibold sm:text-lg'>{card.title}</h3>
                                {/* Phones get compact rows: a thumbnail beside a two-line summary. */}
                                <p className='text-muted-foreground line-clamp-2 text-sm sm:line-clamp-none sm:flex-1 sm:text-base'>{card.summary}</p>
                                <span className='text-primary hidden items-center gap-1.5 text-sm font-medium sm:inline-flex'>
                                  Learn more
                                  <ArrowRightIcon className='size-4 transition-transform group-hover/card:translate-x-0.5' aria-hidden='true' />
                                </span>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {tab.html && <div className={proseClassName} dangerouslySetInnerHTML={{ __html: tab.html }} />}
                  </div>
                </TabsContent>
              ))}
            </MotionPreset>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default Features
