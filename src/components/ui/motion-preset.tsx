import * as React from 'react'

// The shadcn/studio blocks wrap their content in MotionPreset for entrance
// animations driven by `motion`. This site renders the blocks to static HTML,
// where those animations would leave content stuck in its hidden initial state
// (opacity 0, blurred) until JavaScript ran. This drop-in keeps the same props
// so the blocks stay unchanged, and renders the element in its final state.

type AnimationOptions = Record<string, unknown> | boolean

interface MotionPresetProps {
  children?: React.ReactNode
  className?: string
  component?: keyof React.JSX.IntrinsicElements
  transition?: Record<string, unknown>
  delay?: number
  inView?: boolean
  inViewMargin?: string
  inViewOnce?: boolean
  blur?: string | boolean
  slide?: { direction?: 'up' | 'down' | 'left' | 'right'; offset?: number } | boolean
  fade?: AnimationOptions
  zoom?: AnimationOptions
  motionProps?: Record<string, unknown>
  ref?: React.Ref<HTMLElement>
}

function MotionPreset({ ref, children, className, component = 'div' }: MotionPresetProps) {
  const Component = component as React.ElementType

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  )
}

export { MotionPreset, type MotionPresetProps }
