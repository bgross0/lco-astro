import { ArrowRightIcon, ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

export type ContactFormProps = {
  services: string[]
  submitLabel: string
  /** Messages shown for the error codes functions/api/contact.js returns. */
  messages: { invalid: string; verification: string; unavailable: string }
  turnstileSiteKey?: string
  noscriptMessage?: string
}

const optional = <span className='text-muted-foreground font-normal'>(optional)</span>

// Field names are the ones functions/api/contact.js reads: firstName,
// lastName, email, phone, company, service, message, the "website" honeypot
// and Turnstile's cf-turnstile-response. Without JavaScript the form posts
// and the server redirects; with it, the page script submits with fetch so
// a failure keeps what was typed (see src/pages/contact-us.astro).
const ContactForm = ({ services, submitLabel, messages, turnstileSiteKey, noscriptMessage }: ContactFormProps) => {
  return (
    <form
      id='quote-form'
      action='/api/contact'
      method='POST'
      className='scroll-mt-28 space-y-6'
      data-msg-invalid={messages.invalid}
      data-msg-verification={messages.verification}
      data-msg-unavailable={messages.unavailable}
    >
      <p
        role='alert'
        hidden
        data-form-status
        className='border-destructive bg-destructive/10 text-destructive rounded-md border-l-4 p-4 text-sm'
      />

      {/* Honeypot: hidden from people, filled in by bots */}
      <div aria-hidden='true' className='absolute -left-[10000px] size-px overflow-hidden'>
        <label htmlFor='website'>Website</label>
        <input type='text' id='website' name='website' tabIndex={-1} autoComplete='off' />
      </div>

      <div className='grid gap-6 sm:grid-cols-2'>
        <div className='w-full space-y-2'>
          <Label htmlFor='firstName'>First name</Label>
          <Input type='text' className='h-10' id='firstName' name='firstName' autoComplete='given-name' maxLength={100} required />
        </div>
        <div className='w-full space-y-2'>
          <Label htmlFor='lastName'>Last name</Label>
          <Input type='text' className='h-10' id='lastName' name='lastName' autoComplete='family-name' maxLength={100} required />
        </div>
      </div>

      <div className='grid gap-6 sm:grid-cols-2'>
        <div className='w-full space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input type='email' className='h-10' id='email' name='email' autoComplete='email' maxLength={254} required />
        </div>
        <div className='w-full space-y-2'>
          <Label htmlFor='phone'>Phone {optional}</Label>
          <Input type='tel' className='h-10' id='phone' name='phone' autoComplete='tel' maxLength={40} />
        </div>
      </div>

      <div className='w-full space-y-2'>
        <Label htmlFor='company'>Company or property {optional}</Label>
        <Input type='text' className='h-10' id='company' name='company' autoComplete='organization' maxLength={200} />
      </div>

      <div className='w-full space-y-2'>
        <Label htmlFor='service'>Service needed</Label>
        <div className='relative'>
          <select
            id='service'
            name='service'
            required
            defaultValue=''
            className={cn(
              'border-input h-10 w-full min-w-0 appearance-none rounded-md border bg-transparent py-1 pr-9 pl-3 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20'
            )}
          >
            <option value=''>Select a service</option>
            {services.map(title => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
            <option value='Other'>Other</option>
          </select>
          <ChevronDownIcon
            aria-hidden='true'
            className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2'
          />
        </div>
      </div>

      <div className='mb-4 space-y-2'>
        <Label htmlFor='message'>Project details</Label>
        <Textarea
          id='message'
          name='message'
          rows={5}
          maxLength={5000}
          required
          className='min-h-32'
          placeholder='Property location, size, and what you need done'
        />
      </div>

      {turnstileSiteKey && (
        <>
          <div className='cf-turnstile' data-sitekey={turnstileSiteKey}></div>
          {noscriptMessage && (
            <noscript>
              <p className='text-muted-foreground text-sm'>{noscriptMessage}</p>
            </noscript>
          )}
        </>
      )}

      <Button type='submit' size='lg' data-form-submit className='w-full rounded-lg text-base has-[>svg]:px-6'>
        <span data-form-submit-label>{submitLabel}</span>
        <ArrowRightIcon />
      </Button>
    </form>
  )
}

export default ContactForm
