import { ArrowRightIcon } from 'lucide-react'

import { MotionPreset } from '@/components/ui/motion-preset'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Rating } from '@/components/ui/rating'

import { Marquee } from '@/components/ui/marquee'

type Destinations = {
  title: string
  img: string
  description: string
  href?: string
  rating?: number
}

type UserAvatar = {
  src: string
  fallback: string
  name: string
}

type HeroProps = {
  heading: string
  text: string
  button: { label: string; href: string }
  image: { src: string; alt: string; width?: number; height?: number }
  stat: { value: string; label: string; href?: string }
  cardsTitle: string
  destinations: Destinations[]
  avatars: UserAvatar[]
}

const HeroSection = ({ heading, text, button, image, stat, cardsTitle, destinations, avatars }: HeroProps) => {
  return (
    <section className='overflow-hidden py-8'>
      <div className='mx-auto flex h-full max-w-7xl flex-col gap-12 px-4 sm:gap-16 sm:px-6 lg:gap-24 lg:px-8'>
        <div className='relative flex w-full flex-col gap-2'>
          <div className='flex flex-col justify-center gap-8 xl:max-w-146'>
            <MotionPreset fade slide={{ offset: 50 }} blur transition={{ duration: 0.5 }} delay={0.3}>
              <h1 className='max-w-3xl text-3xl leading-[1.29167] font-bold sm:text-4xl lg:text-6xl'>
                {heading}
              </h1>
            </MotionPreset>
            <MotionPreset fade slide={{ offset: 50 }} blur transition={{ duration: 0.5 }} delay={0.5}>
              <p className='text-muted-foreground w-full xl:max-w-110.5'>
                {text}
              </p>
            </MotionPreset>
            <MotionPreset fade slide={{ offset: 50 }} blur transition={{ duration: 0.5 }} delay={0.7}>
              <Button
                asChild
                size='lg'
                className='group relative w-fit overflow-hidden rounded-full text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-size-[250%_250%,100%_100%] before:bg-position-[200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-position-[-100%_0,0_0] has-[>svg]:px-6 dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]'
              >
                <a href={button.href}>
                  {button.label}{' '}
                  <ArrowRightIcon className='shrink-0 transition-transform duration-200 group-hover:translate-x-0.5' />
                </a>
              </Button>
            </MotionPreset>
          </div>
          <div className='flex items-center justify-center xl:absolute xl:inset-y-0 xl:right-0'>
            <MotionPreset
              component='div'
              fade
              slide={{ direction: 'right', offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.5}
              className='relative w-fit'
            >
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                fetchPriority='high'
                className='w-full max-w-183 object-contain xl:max-w-150'
              />
              <div className='absolute right-[10%] bottom-0 flex h-14 w-fit items-center gap-4 max-[450px]:hidden sm:right-[6%] sm:h-17 md:right-0 md:h-22'>
                <TooltipProvider>
                <AvatarGroup className='**:data-[slot=avatar]:ring-ring **:data-[slot=avatar]:ring-2'>
                  {avatars.map((avatar, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <span>
                          <Avatar
                            size='default'
                            className='size-10 transition-all duration-300 ease-in-out hover:z-1 hover:-translate-y-1 hover:shadow-md sm:size-12'
                          >
                            <AvatarImage src={avatar.src} alt={avatar.name} />
                            <AvatarFallback className='text-xs'>{avatar.fallback}</AvatarFallback>
                          </Avatar>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{avatar.name}</TooltipContent>
                    </Tooltip>
                  ))}
                </AvatarGroup>
                </TooltipProvider>

                <div className='max-md:hidden'>
                  <p className='text-lg font-medium'>{stat.value}</p>
                  <a href={stat.href} className='text-muted-foreground hover:text-foreground'>
                    {stat.label}
                  </a>
                </div>
              </div>
            </MotionPreset>
          </div>
        </div>
        <div className='space-y-8'>
          <MotionPreset
            component='div'
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={0.8}
            blur
            transition={{ duration: 1 }}
          >
            <h2 className='text-2xl font-semibold'>{cardsTitle}</h2>
          </MotionPreset>
          <MotionPreset fade slide={{ direction: 'down', offset: 50 }} delay={1} blur transition={{ duration: 0.5 }}>
            <div className='from-background pointer-events-none absolute inset-y-0 left-0 z-1 w-30 bg-linear-to-r to-transparent max-sm:w-15' />
            <div className='from-background pointer-events-none absolute inset-y-0 right-0 z-1 w-30 bg-linear-to-l to-transparent max-sm:w-15' />

            <Marquee gap={2} pauseOnHover duration={Math.max(20, destinations.length * 6)}>
              <div className='flex w-fit gap-8'>
                {destinations.map((item, index) => (
                  <a
                    key={`${item.title}-${index}`}
                    href={item.href}
                    className='bg-muted hover:border-primary/40 grid w-96 grid-cols-2 gap-3.5 rounded-xl border px-3.5 py-3 transition-colors'
                  >
                    <img src={item.img} alt='' loading='lazy' className='h-29 w-full rounded-md object-cover' />
                    <div>
                      <h3 className='mb-1.5 text-lg font-semibold'>{item.title}</h3>
                      <p className='text-muted-foreground mb-3.5 line-clamp-3 text-sm'>{item.description}</p>
                      {item.rating !== undefined && <Rating readOnly size={16} value={item.rating} precision={0.5} />}
                    </div>
                  </a>
                ))}
              </div>
            </Marquee>
          </MotionPreset>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
