import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

type FAQs = {
  question: string
  answer: string
}[]

const FAQ = ({ faqItems }: { faqItems: FAQs }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2'>
          <div className='h-70 overflow-hidden sm:h-143 md:h-114.5'>
            <img
              src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/faq/image-1.png'
              alt='Faq-Image-1'
              className='h-full w-full rounded-md object-cover grayscale'
            />
          </div>

          <div>
            <Badge className='bg-primary/10 text-primary mb-2 px-3 py-1'>FAQ</Badge>
            <h2 className='mb-8 text-2xl font-semibold md:text-3xl lg:text-4xl'>Looking for answers?</h2>

            <Accordion type='single' collapsible className='w-full' defaultValue='item-1'>
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className='text-base'>{item.question}</AccordionTrigger>
                  <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
