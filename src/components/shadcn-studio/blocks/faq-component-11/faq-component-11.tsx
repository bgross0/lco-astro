import { ChevronDownIcon } from 'lucide-react'


type FAQs = {
  question: string
  answer: string
}[]

type FAQProps = {
  title: string
  intro?: string
  faqItems: FAQs
  image: { src: string; srcset?: string; width?: number; height?: number; alt: string }
}

// The accordion is built on native <details name="faq"> elements styled like
// the shadcn Accordion: it needs no JavaScript, is keyboard operable, opens
// one answer at a time, and every answer stays in the HTML for search engines
// (Radix only renders the open item).
const FAQ = ({ title, intro, faqItems, image }: FAQProps) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2'>
          <div className='h-70 overflow-hidden sm:h-143 md:sticky md:top-28 md:h-114.5'>
            <img
              src={image.src}
              srcSet={image.srcset}
              sizes='(min-width: 1280px) 600px, (min-width: 768px) 46vw, 100vw'
              width={image.width}
              height={image.height}
              alt={image.alt}
              loading='lazy'
              decoding='async'
              className='h-full w-full rounded-md object-cover grayscale'
            />
          </div>

          <div>
            <h2 className='mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl'>{title}</h2>
            {intro && <p className='text-muted-foreground mb-8'>{intro}</p>}

            <div data-slot='accordion' className='w-full'>
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  name='faq'
                  open={index === 0}
                  data-slot='accordion-item'
                  className='group border-b last:border-b-0'
                >
                  <summary className='focus-visible:ring-ring/50 flex flex-1 cursor-pointer list-none items-start justify-between gap-4 rounded-md py-4 text-left text-base font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] [&::-webkit-details-marker]:hidden'>
                    <span>{item.question}</span>
                    <ChevronDownIcon
                      aria-hidden='true'
                      className='text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 group-open:rotate-180'
                    />
                  </summary>
                  <p className='text-muted-foreground pb-4 text-sm'>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
