import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MotionPreset } from '@/components/ui/motion-preset'

export type PortfolioItem = {
  id: number
  title: string
  description: string
  link: string
  imageUrl: string
  imageAlt: string
  backgroundColor?: string
  btnColor?: string
}

type PortfolioProps = {
  title: string
  text: string
  portfolioItems: PortfolioItem[]
}

const Portfolio = ({ title, text, portfolioItems }: PortfolioProps) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-12 px-4 sm:space-y-16 sm:px-6 lg:space-y-20 lg:px-8'>
        {/* Header */}
        <div className='space-y-4'>
          <MotionPreset
            component='h2'
            className='text-2xl font-semibold sm:text-3xl lg:text-4xl'
            fade
            blur
            slide={{ direction: 'left', offset: 50 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </MotionPreset>

          <MotionPreset
            component='p'
            className='text-muted-foreground text-xl leading-relaxed'
            fade
            blur
            slide={{ direction: 'left', offset: 50 }}
            delay={0.3}
            transition={{ duration: 0.6 }}
          >
            {text}
          </MotionPreset>
        </div>

        {/* Portfolio Grid */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {portfolioItems.map((project, index) => (
            <MotionPreset
              key={project.id}
              fade
              blur
              zoom={{ initialScale: 0.9 }}
              delay={0.6 + index * 0.2}
              transition={{ duration: 0.6 }}
            >
              <a href={project.link} className='block h-full'>
                <Card
                  className={`group relative h-full justify-between overflow-hidden border-none pb-0 shadow-none transition-all duration-300 ${project.backgroundColor}`}
                >
                  <CardContent className='space-y-1.5'>
                    <h4 className='text-xl font-semibold lg:text-2xl'>{project.title}</h4>
                    <p className='text-muted-foreground leading-relaxed'>{project.description}</p>
                  </CardContent>
                  <div>
                    <img
                      src={project.imageUrl}
                      alt={project.imageAlt}
                      loading='lazy'
                      className='aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                  </div>
                  <Button
                    size='icon'
                    asChild
                    className={`group absolute right-5 bottom-5 rounded-full text-white ${project.btnColor}`}
                  >
                    <span aria-hidden='true'>
                    <ArrowRightIcon className='transition-transform duration-200 group-hover:translate-x-0.5' />
                    </span>
                  </Button>
                </Card>
              </a>
            </MotionPreset>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
