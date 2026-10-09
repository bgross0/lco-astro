import type { ComponentType } from 'react'

import ContactForm from '@/components/shadcn-studio/blocks/contact-us-page-10/contact-form'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

import { BorderBeam } from '@/components/ui/border-beam'
import { MotionPreset } from '@/components/ui/motion-preset'

type ContactInfo = {
  icon: ComponentType
  title: string
  details: string[]
}[]

const ContactUs = ({ contactInfo }: { contactInfo: ContactInfo }) => {
  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24'>
          {/* Contact Info */}
          <div>
            <div className='space-y-4'>
              <MotionPreset fade slide={{ direction: 'up', offset: 50 }} blur transition={{ duration: 0.5 }}>
                <Badge variant='outline' className='text-sm font-normal'>
                  Get in touch with us
                </Badge>
              </MotionPreset>

              <MotionPreset
                component='h2'
                className='mt-4 text-2xl font-semibold md:text-3xl lg:text-4xl'
                fade
                blur
                slide={{ direction: 'up', offset: 50 }}
                delay={0.3}
                transition={{ duration: 0.5 }}
              >
                Need a Help? Get in touch with us!
              </MotionPreset>
            </div>

            <div className='space-y-8 p-6'>
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon

                return (
                  <MotionPreset
                    key={index}
                    className='flex items-center gap-8'
                    fade
                    blur
                    slide={{ direction: 'up', offset: 50 }}
                    delay={0.6 + index * 0.15}
                    transition={{ duration: 0.5 }}
                  >
                    <div className='relative [&>svg]:size-10'>
                      <span className='bg-primary/10 text-primary absolute -top-2 left-2.5 size-10 rounded-full'></span>
                      <IconComponent />
                    </div>
                    <div className='flex-1 space-y-1'>
                      <h3 className='text-lg font-medium'>{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className='text-muted-foreground text-sm'>
                          {detail}
                        </p>
                      ))}
                    </div>
                  </MotionPreset>
                )
              })}
            </div>
          </div>

          {/* Form Card */}
          <MotionPreset fade blur zoom={{ initialScale: 0.9 }} delay={0.3} transition={{ duration: 0.8 }}>
            <Card className='relative overflow-hidden border-none shadow-none'>
              <CardContent>
                <CardTitle className='mb-4 text-2xl font-semibold'>Say hello!</CardTitle>

                <ContactForm />

                <p className='text-muted-foreground mt-4 text-lg'>
                  I understand that my data will be hold securely in accordance with the{' '}
                  <a href='#' className='text-card-foreground font-semibold underline underline-offset-4'>
                    privacy policy
                  </a>
                </p>
              </CardContent>

              <BorderBeam
                borderWidth={1.5}
                duration={7}
                size={400}
                className='via-primary from-transparent to-transparent'
              />
              <BorderBeam
                duration={7}
                delay={4}
                size={400}
                borderWidth={1.5}
                className='via-destructive from-transparent to-transparent'
              />
            </Card>
          </MotionPreset>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
