import { useEffect, useRef, useState } from 'react'

import Autoplay from 'embla-carousel-autoplay'

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'

import { cn } from '@/lib/utils'

type GalleryImage = { src: string; alt: string }

const Gallery = ({ title, text, gallery }: { title: string; text: string; gallery: GalleryImage[] }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })

    api.on('pointerUp', () => {
      plugin.current.play()
    })
  }, [api])

  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 space-y-4 sm:mb-16 lg:mb-24'>
          <h2 className='text-2xl font-semibold sm:text-3xl lg:text-4xl'>{title}</h2>
          <p className='text-muted-foreground text-xl'>{text}</p>
        </div>

        <div className='mx-auto'>
          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            opts={{
              align: 'center',
              loop: true
            }}
            className='relative flex items-center justify-center gap-6'
          >
            <CarouselContent className='h-89 items-center'>
              {gallery.map((image, index) => (
                <CarouselItem key={index} className='flex justify-center sm:basis-1/3 lg:basis-1/5'>
                  <div className='w-full overflow-hidden p-1'>
                    <img
                      className={cn('mx-auto h-87 w-auto rounded-lg object-cover transition-all duration-600 sm:h-71 sm:w-full', {
                        'sm:h-87': current === index,
                        'sm:h-78.5':
                          current === 0
                            ? index === gallery.length - 1 || current + 1 === index
                            : current === gallery.length - 1
                              ? current - 1 === index || index === 0
                              : current - 1 === index || current + 1 === index
                      })}
                      src={image.src}
                      alt={image.alt}
                      loading='lazy'
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default Gallery
