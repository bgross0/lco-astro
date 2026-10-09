import { cn } from '@/lib/utils'
import { MotionPreset } from '@/components/ui/motion-preset'

type GalleryImage = {
  src: string
  alt: string
  className?: string
}[]

const Gallery = ({ galleryImage }: { galleryImage: GalleryImage }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <MotionPreset
            component='p'
            className='text-primary text-sm font-medium uppercase'
            fade
            zoom={{ initialScale: 0.95 }}
            blur
            transition={{ duration: 0.5 }}
          >
            Gallery
          </MotionPreset>

          <MotionPreset
            component='h2'
            className='text-2xl font-semibold md:text-3xl lg:text-4xl'
            fade
            zoom={{ initialScale: 0.95 }}
            blur
            transition={{ duration: 0.5 }}
            delay={0.3}
          >
            A Visual Journey Through Our Work
          </MotionPreset>

          <MotionPreset
            component='p'
            className='text-muted-foreground text-xl'
            fade
            blur
            zoom={{ initialScale: 0.95 }}
            delay={0.6}
            transition={{ duration: 0.5 }}
          >
            Experience our creativity and impact through a curated collection of images.
          </MotionPreset>
        </div>

        {/* Gallery Grid */}
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-6'>
          {galleryImage.map((image, index) => (
            <MotionPreset
              key={index}
              className={cn('overflow-hidden rounded-lg', image.className)}
              fade
              blur
              zoom={{ initialScale: 0.9 }}
              transition={{ duration: 0.9 }}
              delay={0.9}
            >
              <img
                src={image.src}
                alt={image.alt}
                className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
              />
            </MotionPreset>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
