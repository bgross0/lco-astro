import { Card, CardContent } from '@/components/ui/card'

import { BorderBeam } from '@/components/ui/border-beam'
import { MotionPreset } from '@/components/ui/motion-preset'

type Stat = {
  label: string
  value: string
}

const SocialProof = ({ stats }: { stats: Stat[] }) => {
  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <MotionPreset
            component='h2'
            className='text-2xl font-semibold md:text-3xl lg:text-4xl'
            fade
            blur
            slide={{ direction: 'down', offset: 50 }}
            transition={{ duration: 0.5 }}
          >
            The sole platform that crafts distinctive and exceptional UI kits using TailwindCSS.
          </MotionPreset>
        </div>

        <MotionPreset fade blur delay={0.3} zoom={{ initialScale: 0.7 }} transition={{ duration: 0.6 }}>
          <Card className='relative overflow-hidden border-none py-10 shadow-none'>
            <CardContent className='px-4 sm:px-6 lg:px-8'>
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                  <MotionPreset
                    key={index}
                    className='flex flex-col items-center gap-3'
                    fade
                    blur
                    zoom={{ initialScale: 0.8 }}
                    transition={{ duration: 0.7 }}
                    delay={0.9 + index * 0.15}
                  >
                    <p className='text-muted-foreground text-xl font-medium uppercase'>{stat.label}</p>
                    <p className='text-2xl font-semibold md:text-3xl lg:text-4xl'>{stat.value}</p>
                  </MotionPreset>
                ))}
              </div>
            </CardContent>

            <BorderBeam
              borderWidth={2}
              duration={7}
              size={200}
              className='via-primary from-transparent to-transparent'
            />
            <BorderBeam
              duration={7}
              delay={10.5}
              size={200}
              borderWidth={2}
              className='via-destructive from-transparent to-transparent'
            />
          </Card>
        </MotionPreset>
      </div>
    </section>
  )
}

export default SocialProof
