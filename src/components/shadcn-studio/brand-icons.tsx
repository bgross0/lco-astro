import type { SVGAttributes } from 'react'

// Brand marks lucide does not ship (it dropped brand icons). Paths are the
// regular weight of Phosphor Icons (MIT), drawn to match lucide's 24px grid.

type IconProps = SVGAttributes<SVGSVGElement>

const BrandIcon = ({ path, ...props }: IconProps & { path: string }) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' width={24} height={24} fill='currentColor' aria-hidden='true' {...props}>
    <path d={path} />
  </svg>
)

export const InstagramIcon = (props: IconProps) => (
  <BrandIcon
    path='M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z'
    {...props}
  />
)

export const FacebookIcon = (props: IconProps) => (
  <BrandIcon
    path='M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z'
    {...props}
  />
)

export const GoogleIcon = (props: IconProps) => (
  <BrandIcon
    path='M224,128a96,96,0,1,1-21.95-61.09,8,8,0,1,1-12.33,10.18A80,80,0,1,0,207.6,136H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128Z'
    {...props}
  />
)
