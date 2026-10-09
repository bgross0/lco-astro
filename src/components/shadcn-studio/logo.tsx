// Util Imports
import { cn } from '@/lib/utils'

// Lake County Outdoors badge and wordmark. The badge is decorative: the
// wordmark names the link it sits in.
const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img
        src='/images/brand/lco-logo-128w.webp'
        alt=''
        width={128}
        height={128}
        decoding='async'
        className='size-11 shrink-0 sm:size-12'
      />
      <span className='font-heading text-base leading-tight font-bold whitespace-nowrap sm:text-lg'>
        Lake County
        <br />
        Outdoors
      </span>
    </div>
  )
}

export default Logo
