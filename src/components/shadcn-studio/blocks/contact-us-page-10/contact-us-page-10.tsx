import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'

import ContactForm, { type ContactFormProps } from '@/components/shadcn-studio/blocks/contact-us-page-10/contact-form'

import { Card, CardContent, CardTitle } from '@/components/ui/card'

import { BorderBeam } from '@/components/ui/border-beam'
import { MotionPreset } from '@/components/ui/motion-preset'

const icons = { address: MapPinIcon, phone: PhoneIcon, email: MailIcon, hours: ClockIcon }

type ContactDetail = { text: string; href?: string; external?: boolean }

export type ContactInfo = {
  icon: keyof typeof icons
  title: string
  details: ContactDetail[]
}[]

type ContactUsProps = {
  /** The page's H1. */
  heading: string
  text?: string
  contactInfo: ContactInfo
  formTitle: string
  formSubtitle?: string
  form: ContactFormProps
}

const ContactUs = ({ heading, text, contactInfo, formTitle, formSubtitle, form }: ContactUsProps) => {
  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24'>
          {/* Contact Info */}
          <div>
            <div className='space-y-4'>
              <MotionPreset component='h1' className='mt-4 text-3xl font-semibold md:text-4xl lg:text-5xl'>
                {heading}
              </MotionPreset>
              {text && <p className='text-muted-foreground text-lg'>{text}</p>}
            </div>

            <div className='space-y-8 py-6 sm:p-6'>
              {contactInfo.map((info, index) => {
                const IconComponent = icons[info.icon]

                return (
                  <MotionPreset key={index} className='flex items-center gap-8'>
                    <div className='relative [&>svg]:size-10' aria-hidden='true'>
                      <span className='bg-primary/10 text-primary absolute -top-2 left-2.5 size-10 rounded-full'></span>
                      <IconComponent />
                    </div>
                    <div className='flex-1 space-y-1'>
                      <h2 className='font-sans text-lg font-medium'>{info.title}</h2>
                      {info.details.map((detail, detailIndex) =>
                        detail.href ? (
                          <p key={detailIndex} className='text-muted-foreground text-sm'>
                            <a
                              href={detail.href}
                              {...(detail.external ? { target: '_blank', rel: 'noopener' } : {})}
                              className='hover:text-primary underline-offset-4 transition-colors hover:underline'
                            >
                              {detail.text}
                            </a>
                          </p>
                        ) : (
                          <p key={detailIndex} className='text-muted-foreground text-sm'>
                            {detail.text}
                          </p>
                        )
                      )}
                    </div>
                  </MotionPreset>
                )
              })}
            </div>
          </div>

          {/* Form Card */}
          <MotionPreset>
            <Card className='relative overflow-hidden border-none shadow-none'>
              <CardContent>
                <CardTitle className='mb-2 text-2xl font-semibold'>
                  <h2>{formTitle}</h2>
                </CardTitle>
                {formSubtitle && <p className='text-muted-foreground mb-4'>{formSubtitle}</p>}
                <div className='mt-6'>
                  <ContactForm {...form} />
                </div>
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
                className='via-chart-2 from-transparent to-transparent'
              />
            </Card>
          </MotionPreset>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
