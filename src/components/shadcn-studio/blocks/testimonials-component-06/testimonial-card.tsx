import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Rating } from '@/components/ui/rating'

import { cn } from '@/lib/utils'

type Testimonial = {
  name: string
  role: string
  content: string
  rating: number
}

const TestimonialCard = ({ testimonial, clamp = true }: { testimonial: Testimonial; clamp?: boolean }) => {
  return (
    <Card className={cn('bg-muted shadow-none', clamp ? 'w-[min(24rem,80vw)]' : 'h-full')}>
      <CardContent className='flex h-full flex-col justify-between gap-8'>
        <figure>
          <p className='text-primary font-heading text-6xl leading-none' aria-hidden='true'>
            &ldquo;
          </p>
          <blockquote className={cn('text-muted-foreground -mt-2 font-medium', clamp && 'line-clamp-3')}>
            {testimonial.content}
          </blockquote>
        </figure>
        <div className='flex items-center gap-2'>
          <Avatar size='lg' aria-hidden='true'>
            <AvatarFallback className='bg-secondary text-secondary-foreground font-semibold'>
              {testimonial.name
                .replace(/\./g, '')
                .split(' ', 2)
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='font-heading font-medium'>{testimonial.name}</p>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <Rating readOnly variant='yellow' size={14} value={testimonial.rating} />
              <span>{testimonial.role}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TestimonialCard
