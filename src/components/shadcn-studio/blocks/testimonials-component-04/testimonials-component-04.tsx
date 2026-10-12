import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Rating } from '@/components/ui/rating'

export type TestimonialItem = {
  name: string
  role: string
  avatar?: string
  rating: number
  content: string
}

type TestimonialsComponentProps = {
  title: string
  text: string
  testimonials: TestimonialItem[]
}

const TestimonialsComponent = ({ title, text, testimonials }: TestimonialsComponentProps) => {
  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-12 px-4 sm:space-y-16 sm:px-6 lg:space-y-24 lg:px-8'>
        {/* Header Content */}
        <div className='space-y-4 text-center'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>{title}</h2>
          <p className='text-muted-foreground text-xl'>{text}</p>
        </div>

        {/* Testimonials Carousel */}
        <Carousel
          className='relative w-full space-y-12 sm:space-y-16 lg:space-y-24'
          opts={{
            align: 'start',
            slidesToScroll: 1
          }}
        >
          <CarouselContent className='-ml-6'>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className='pl-6 md:basis-1/2 lg:basis-1/3'>
                <Card className='h-full shadow-none'>
                  <CardContent className='space-y-6'>
                    <Rating readOnly variant='yellow' size={24} value={testimonial.rating} precision={0.5} />

                    <p className='text-muted-foreground line-clamp-6'>{testimonial.content}</p>
                    <div className='flex items-center gap-2'>
                      <Avatar size='lg'>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(' ', 2)
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className='space-y-0.5'>
                        <h3 className='font-medium'>{testimonial.name}</h3>
                        <p className='text-muted-foreground text-xs'>{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Next/Previous Controls */}
          <div className='flex items-center justify-center gap-4'>
            <CarouselPrevious
              variant='default'
              className='disabled:bg-primary/10 disabled:text-primary static size-9 translate-y-0 disabled:opacity-100'
            />
            <CarouselNext
              variant='default'
              className='disabled:bg-primary/10 disabled:text-primary static size-9 translate-y-0 disabled:opacity-100'
            />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

export default TestimonialsComponent
