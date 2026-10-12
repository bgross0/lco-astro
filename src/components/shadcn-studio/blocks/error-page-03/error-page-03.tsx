import { HouseIcon, MailIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ErrorProps = {
  image: { src: string; srcset?: string; width?: number; height?: number; alt: string }
  title: string
  text: string
  links: { label: string; href: string }[]
}

// Error 03 with a real fleet photo behind it. The photo is an <img> (with a
// dark overlay for contrast) instead of a CSS background so it gets srcset.
const Error = ({ image, title, text, links }: ErrorProps) => {
  return (
    <div className='relative isolate overflow-hidden bg-black'>
      <img
        src={image.src}
        srcSet={image.srcset}
        sizes='100vw'
        width={image.width}
        height={image.height}
        alt={image.alt}
        fetchPriority='high'
        decoding='async'
        className='absolute inset-0 -z-10 size-full object-cover opacity-55'
      />
      <div className='flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-8 py-8 sm:py-16 lg:justify-between lg:py-24'>
        <h1 className='bg-gradient-to-b from-white from-30% to-transparent bg-clip-text text-[clamp(8rem,16vw,16.625rem)] leading-none font-bold text-transparent'>
          404
        </h1>

        <div className='text-center max-lg:mt-24'>
          <h2 className='mb-3 text-4xl font-semibold text-white sm:text-5xl'>{title}</h2>
          <p className='mx-auto mb-6 max-w-md text-white/85'>{text}</p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Button size='lg' className='rounded-lg text-base' asChild>
              <a href='/'>
                <HouseIcon />
                Return Home
              </a>
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='rounded-lg border-white/40 bg-transparent text-base text-white hover:bg-white/10 hover:text-white'
              asChild
            >
              <a href='/contact-us'>
                <MailIcon />
                Contact Us
              </a>
            </Button>
          </div>
          <nav aria-label='Popular pages' className='mt-8'>
            <ul className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/85'>
              {links.map(link => (
                <li key={link.href}>
                  <a href={link.href} className='underline-offset-4 hover:text-white hover:underline'>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Error
