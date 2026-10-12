import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { FacebookIcon, InstagramIcon } from '@/components/shadcn-studio/brand-icons'

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

const linkClass = 'hover:text-white transition-colors duration-300'

const Footer = ({ data }: { data: FooterData }) => {
  return (
    <footer className='from-primary to-brand-deep bg-linear-to-b text-white'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 md:py-24'>
        {/* Contact row (the block's newsletter row) */}
        <div className='mb-12 grid items-start gap-8 lg:grid-cols-2'>
          <div className='space-y-3'>
            <h2 className='text-2xl font-semibold'>{data.name}</h2>
            <p className='max-w-xl text-white/75'>{data.description}</p>
            <address className='space-y-2 text-white/75 not-italic'>
              <a
                href={data.address.mapsUrl}
                target='_blank'
                rel='noopener'
                className='flex items-start gap-2 transition-colors duration-300 hover:text-white'
              >
                <MapPinIcon className='mt-0.5 size-4 shrink-0 text-white/80' aria-hidden='true' />
                <span>{data.address.lines.join(', ')}</span>
              </a>
              <a href={`mailto:${data.email}`} className='flex items-center gap-2 transition-colors duration-300 hover:text-white'>
                <MailIcon className='size-4 shrink-0 text-white/80' aria-hidden='true' />
                <span className='break-all'>{data.email}</span>
              </a>
            </address>
          </div>
          <div className='space-y-4 lg:justify-self-end'>
            <div className='flex flex-wrap gap-3'>
              {data.phones.map((phone, index) => (
                <Button
                  key={phone.href}
                  className={
                    index === 0
                      ? 'text-primary rounded-lg bg-white text-base hover:bg-white/90'
                      : 'rounded-lg border-white/60 bg-transparent text-base text-white hover:bg-white/10 hover:text-white'
                  }
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
            <dl className='grid gap-1 text-sm text-white/75'>
              {data.hours.map(row => (
                <div key={row.label} className='flex gap-2'>
                  <ClockIcon className='mt-0.5 size-4 shrink-0 text-white/80' aria-hidden='true' />
                  <dt className='min-w-32 font-medium text-white'>{row.label}</dt>
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
              <ul className='space-y-3 text-white/75'>
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

      <Separator className='bg-white/20' />

      <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-6 sm:px-6'>
        <a href='/' className='rounded-md'>
          <span className='flex items-center gap-3'>
            <img src='/images/brand/lco-logo-night.webp' alt='' width={128} height={128} className='size-12' />
            <span className='text-lg font-bold'>{data.name}</span>
          </span>
        </a>
        <div className='flex items-center gap-4'>
          {data.social.instagram && (
            <a
              href={data.social.instagram}
              target='_blank'
              rel='noopener'
              className='text-white/75 transition-colors duration-300 hover:text-white'
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
              className='text-white/75 transition-colors duration-300 hover:text-white'
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
