import type * as React from 'react'

import { cn } from '@/lib/utils'

// CSS-only version of the shadcn/studio BorderBeam: the beam travels the
// card's border with the `animate-border-beam` keyframes from shadcn.css
// instead of a `motion` animation, so it works in static HTML without
// shipping JavaScript. It stops for visitors who prefer reduced motion.

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  className?: string
  style?: React.CSSProperties
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
}

function BorderBeam({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = 'var(--destructive)',
  colorTo = 'var(--primary)',
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1
}: BorderBeamProps) {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]'
      style={
        {
          '--border-beam-width': `${borderWidth}px`
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'animate-border-beam absolute aspect-square motion-reduce:hidden',
          'rounded-full bg-linear-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent',
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            offsetDistance: `${initialOffset}%`,
            animationDelay: `-${delay}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
            '--border-beam-duration': `${duration}s`,
            '--color-from': colorFrom,
            '--color-to': colorTo,
            ...style
          } as React.CSSProperties
        }
      />
    </div>
  )
}

export { BorderBeam, type BorderBeamProps }
