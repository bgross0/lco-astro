import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import Logo from '@/components/shadcn-studio/logo'

const Footer = () => {
  return (
    <footer>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 md:py-24'>
        <div className='mb-10 grid items-center gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <h6 className='text-2xl font-semibold'>Subscribe to newsletter</h6>
            <p className='text-muted-foreground'>
              We&apos;ll send you a friendly note once a week—no spam, just good vibes!
            </p>
          </div>
          <div className='flex gap-3'>
            <Input type='email' placeholder='Your Email' className='h-10' />
            <Button className='rounded-lg text-base' type='submit' size='lg'>
              Subscribe
            </Button>
          </div>
        </div>

        <div className='grid grid-flow-row grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5'>
          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium'>Product</div>
            <ul className='text-muted-foreground space-y-3'>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Overview
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Features
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Solutions
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Tutorials
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Pricing
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Releases
                </a>
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium'>Company</div>
            <ul className='text-muted-foreground space-y-3'>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  About Us
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Careers
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Press
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  News
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Media Kit
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium'>Resources</div>
            <ul className='text-muted-foreground space-y-3'>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Blog
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Newsletter
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Events
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Help Centre
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Tutorials
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium'>Social</div>
            <ul className='text-muted-foreground space-y-3'>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Twitter
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Facebook
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  GitHub
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  AngelList
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Dribbble
                </a>
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium'>Legal</div>
            <ul className='text-muted-foreground space-y-3'>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Terms
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Privacy
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Cookies
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Licenses
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Settings
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-foreground transition-colors duration-300'>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-6 sm:px-6'>
        <a href='#'>
          <Logo className='gap-3' />
        </a>
        <p className='font-medium'>
          {`©${new Date().getFullYear()}`}{' '}
          <a href='#' className='link-animated'>
            shadcn/studio
          </a>
          , Made with ❤️ for better web.
        </p>
      </div>
    </footer>
  )
}

export default Footer
