import { cn } from '@/lib/utils'
import { MotionPreset } from '@/components/ui/motion-preset'

export type GalleryImage = {
  src: string
  srcset?: string
  width?: number
  height?: number
  alt: string
  /** Grid span classes; by default derived from the photo's shape. */
  className?: string
  /** Link target (defaults to the full-size photo). */
  href?: string
  caption?: string
}

type GalleryProps = {
  title?: string
  /** The gallery page uses the block's header as the page heading. */
  titleAs?: 'h1' | 'h2'
  text?: string
  galleryImage: GalleryImage[]
}

// Masonry-style spans on a 6-column grid of 10rem rows: landscape photos
// take 2x2 cells, portrait photos 2x3, panoramas 4x2.
const spanFor = (image: GalleryImage) => {
  if (image.className) return image.className
  const ratio = image.width && image.height ? image.width / image.height : 4 / 3
  if (ratio < 0.95) return 'col-span-2 row-span-3'
  if (ratio > 1.9) return 'col-span-2 row-span-2 sm:col-span-4'
  return 'col-span-2 row-span-2'
}

const Gallery = ({ title, titleAs = 'h2', text, galleryImage }: GalleryProps) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        {title && (
          <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-20'>
            <MotionPreset
              component={titleAs}
              className={cn(
                'font-semibold',
                titleAs === 'h1' ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl lg:text-4xl'
              )}
            >
              {title}
            </MotionPreset>

            {text && (
              <MotionPreset component='p' className='text-muted-foreground text-xl'>
                {text}
              </MotionPreset>
            )}
          </div>
        )}

        {/* Gallery Grid */}
        <ul className='grid auto-rows-[10rem] grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 md:grid-cols-6'>
          {galleryImage.map((image, index) => (
            <MotionPreset key={index} component='li' className={cn('group relative overflow-hidden rounded-lg', spanFor(image))}>
              <a href={image.href ?? image.src} className='block size-full focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none'>
                <img
                  src={image.src}
                  srcSet={image.srcset}
                  sizes='(min-width: 1280px) 420px, (min-width: 640px) 50vw, 100vw'
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  decoding='async'
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
                {image.caption && (
                  <span className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-4 pt-10 font-medium text-white'>
                    {image.caption}
                  </span>
                )}
              </a>
            </MotionPreset>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Gallery
