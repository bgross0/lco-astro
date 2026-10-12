import { ArrowRightIcon, MountainIcon, SproutIcon, WavesIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { BorderBeam } from '@/components/ui/border-beam'
import { MotionPreset } from '@/components/ui/motion-preset'

import { cn } from '@/lib/utils'

export type Stat = {
  label: string
  value: string
  /** A sentence under the label: turns the stats into numbered process steps. */
  text?: string
  /** Show an icon instead of the value. */
  icon?: keyof typeof icons
}

const icons = { waves: WavesIcon, sprout: SproutIcon, mountain: MountainIcon }

type SocialProofProps = {
  title: string
  text?: string
  stats: Stat[]
  button?: { label: string; href: string }
}

const SocialProof = ({ title, text, stats, button }: SocialProofProps) => {
  const columns = stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'

  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-20'>
          <MotionPreset component='h2' className='mx-auto max-w-3xl text-2xl font-semibold md:text-3xl lg:text-4xl'>
            {title}
          </MotionPreset>
          {text && <p className='text-muted-foreground mx-auto max-w-3xl text-lg'>{text}</p>}
        </div>

        <MotionPreset>
          <Card className='relative overflow-hidden border-none py-10 shadow-none'>
            <CardContent className='px-4 sm:px-6 lg:px-8'>
              {stats.some(stat => stat.text) ? (
                <ol className={cn('grid gap-10 sm:grid-cols-2', columns)}>
                  {stats.map((stat, index) => {
                    const Icon = stat.icon ? icons[stat.icon] : null
                    return (
                    <MotionPreset key={index} component='li' className='flex flex-col gap-3'>
                      {Icon ? (
                        <span className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl' aria-hidden='true'>
                          <Icon className='size-6' />
                        </span>
                      ) : (
                        <span className='text-primary font-heading text-2xl font-semibold md:text-3xl lg:text-4xl' aria-hidden='true'>
                          {stat.value}
                        </span>
                      )}
                      <h3 className='text-lg font-semibold'>{stat.label}</h3>
                      <p className='text-muted-foreground'>{stat.text}</p>
                    </MotionPreset>
                    )
                  })}
                </ol>
              ) : (
                <dl className={cn('grid grid-cols-2 gap-x-4 gap-y-8', columns)}>
                  {stats.map((stat, index) => (
                    <MotionPreset key={index} className='flex flex-col-reverse items-center gap-3 text-center'>
                      <dt className='text-muted-foreground text-sm font-medium uppercase sm:text-xl'>{stat.label}</dt>
                      <dd className='text-primary font-heading text-2xl font-semibold md:text-3xl lg:text-4xl'>{stat.value}</dd>
                    </MotionPreset>
                  ))}
                </dl>
              )}
            </CardContent>

            <BorderBeam
              borderWidth={2}
              duration={7}
              size={200}
              className='via-primary from-transparent to-transparent'
            />
            <BorderBeam
              duration={7}
              delay={3.5}
              size={200}
              borderWidth={2}
              className='via-chart-2 from-transparent to-transparent'
            />
          </Card>
        </MotionPreset>

        {button && (
          <div className='mt-10 flex justify-center'>
            <Button size='lg' className='rounded-lg text-base has-[>svg]:px-6' asChild>
              <a href={button.href}>
                {button.label}
                <ArrowRightIcon />
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default SocialProof
