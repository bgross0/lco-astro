import { Fragment } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { MotionPreset } from '@/components/ui/motion-preset'

type tabsProps = {
  name: string
  value: string
  src: string
  darkSrc: string
}

const Features = ({ tabs }: { tabs: tabsProps[] }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      {tabs.map(tab => (
        <Fragment key={tab.name}>
          <img src={tab.src} alt={tab.name} className='hidden' fetchPriority='high' />
          <img src={tab.darkSrc} alt={tab.name} className='hidden' fetchPriority='high' />
        </Fragment>
      ))}

      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <MotionPreset fade blur slide={{ direction: 'up', offset: 50 }} transition={{ duration: 0.5 }}>
            <div className='text-primary text-sm font-medium uppercase'>Our Best Features</div>
          </MotionPreset>
          <MotionPreset
            component='h2'
            className='mx-auto max-w-2xl text-2xl font-semibold md:text-3xl lg:text-4xl'
            fade
            blur
            slide={{ direction: 'up', offset: 50 }}
            delay={0.3}
            transition={{ duration: 0.5 }}
          >
            With clarity comes momentum. With momentum, opportunity follows.
          </MotionPreset>
          <MotionPreset fade blur slide={{ direction: 'up', offset: 50 }} delay={0.5} transition={{ duration: 0.5 }}>
            <Button size='lg' className='rounded-lg text-base' asChild>
              <a href='#'>See all features</a>
            </Button>
          </MotionPreset>
        </div>

        <div className='w-full'>
          <Tabs defaultValue='monitoring' className='w-full gap-8'>
            <MotionPreset
              fade
              blur
              slide
              delay={0.6}
              transition={{ duration: 0.5 }}
              className='w-full overflow-x-auto overflow-y-clip'
            >
              <TabsList variant='line' className='w-full justify-start gap-0 border-b-2 p-0'>
                {tabs.map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='text-base group-data-[orientation=horizontal]/tabs:after:-bottom-0.75'
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </MotionPreset>
            <MotionPreset
              fade
              blur
              slide={{ direction: 'down', offset: 80 }}
              delay={0.8}
              transition={{ duration: 0.5 }}
            >
              {tabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value}>
                  <img
                    src={tab.src}
                    alt={tab.name}
                    className='size-full rounded-3xl border object-contain dark:hidden'
                  />
                  <img
                    src={tab.darkSrc}
                    alt={tab.name}
                    className='hidden size-full rounded-3xl border object-contain dark:block'
                  />
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
