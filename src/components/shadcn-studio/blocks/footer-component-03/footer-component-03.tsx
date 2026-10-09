import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { FacebookIcon, InstagramIcon } from '@/components/shadcn-studio/brand-icons'
import Logo from '@/components/shadcn-studio/logo'

type FooterLink = { title: string; href: string }

export type FooterData = {
  name: string
  description: string
  columns: { title: string; links: FooterLink[] }[]
  phones: { label: string; display: string; href: string }[]
  email: string
  address: { lines: string[]; mapsUrl: string }
  hours: { label: string; text: string }[]
  social: { instagram?: string; facebook?: string }
  credit: { label: string; href: string }
}

const linkClass = 'hover:text-foreground transition-colors duration-300'

const Footer = ({ data }: { data: FooterData }) => {
  return (
    <footer className='bg-muted/50 border-t'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 md:py-24'>
        {/* Contact row (the block's newsletter row) */}
        <div className='mb-12 grid items-start gap-8 lg:grid-cols-2'>
          <div className='space-y-3'>
            <h2 className='text-2xl font-semibold'>{data.name}</h2>
            <p className='text-muted-foreground max-w-xl'>{data.description}</p>
            <address className='text-muted-foreground space-y-2 not-italic'>
              <a
                href={data.address.mapsUrl}
                target='_blank'
                rel='noopener'
                className='hover:text-foreground flex items-start gap-2 transition-colors duration-300'
              >
                <MapPinIcon className='text-primary mt-0.5 size-4 shrink-0' aria-hidden='true' />
                <span>{data.address.lines.join(', ')}</span>
              </a>
              <a href={`mailto:${data.email}`} className='hover:text-foreground flex items-center gap-2 transition-colors duration-300'>
                <MailIcon className='text-primary size-4 shrink-0' aria-hidden='true' />
                <span className='break-all'>{data.email}</span>
              </a>
            </address>
          </div>
          <div className='space-y-4 lg:justify-self-end'>
            <div className='flex flex-wrap gap-3'>
              {data.phones.map((phone, index) => (
                <Button
                  key={phone.href}
                  className='rounded-lg text-base'
                  size='lg'
                  variant={index === 0 ? 'default' : 'outline'}
                  asChild
                >
                  <a href={phone.href}>
                    <PhoneIcon />
                    {phone.label} {phone.display}
                  </a>
                </Button>
              ))}
            </div>
            <dl className='text-muted-foreground grid gap-1 text-sm'>
              {data.hours.map(row => (
                <div key={row.label} className='flex gap-2'>
                  <ClockIcon className='text-primary mt-0.5 size-4 shrink-0' aria-hidden='true' />
                  <dt className='text-foreground min-w-32 font-medium'>{row.label}</dt>
                  <dd>{row.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className='grid grid-flow-row grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5'>
          {data.columns.map(column => (
            <nav key={column.title} className='flex flex-col gap-5' aria-label={`Footer: ${column.title}`}>
              <h2 className='text-lg font-medium'>{column.title}</h2>
              <ul className='text-muted-foreground space-y-3'>
                {column.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className={linkClass}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-6 sm:px-6'>
        <a href='/' className='rounded-md'>
          <Logo className='gap-3' />
        </a>
        <div className='flex items-center gap-4'>
          {data.social.instagram && (
            <a
              href={data.social.instagram}
              target='_blank'
              rel='noopener'
              className='text-muted-foreground hover:text-foreground transition-colors duration-300'
            >
              <InstagramIcon className='size-5' />
              <span className='sr-only'>{data.name} on Instagram</span>
            </a>
          )}
          {data.social.facebook && (
            <a
              href={data.social.facebook}
              target='_blank'
              rel='noopener'
              className='text-muted-foreground hover:text-foreground transition-colors duration-300'
            >
              <FacebookIcon className='size-5' />
              <span className='sr-only'>{data.name} on Facebook</span>
            </a>
          )}
        </div>
        <p className='font-medium'>
          {`©${new Date().getFullYear()}`} {data.name}. All rights reserved. Website by{' '}
          <a href={data.credit.href} target='_blank' rel='noopener' className='link-animated'>
            {data.credit.label}
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
