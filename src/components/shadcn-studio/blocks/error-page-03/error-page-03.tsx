import { Button } from '@/components/ui/button'

const Error = () => {
  return (
    <div className='bg-[url(https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-2.png)] bg-cover bg-center bg-no-repeat'>
      <div className='flex min-h-screen flex-col items-center justify-center px-8 py-8 sm:py-16 lg:justify-between lg:py-24'>
        <p className='bg-gradient-to-b from-white from-30% to-transparent bg-clip-text text-[clamp(10rem,16vw,16.625rem)] leading-none font-bold text-transparent'>
          404
        </p>

        <div className='text-center max-lg:mt-36'>
          <h3 className='mb-3 text-5xl font-semibold text-white'>Whoops!</h3>
          <h4 className='mb-1.5 text-3xl font-semibold text-white'>Something went wrong</h4>
          <p className='mb-3 max-w-md text-white/70'>
            The page you&apos;re looking for isn&apos;t found, we suggest you back to home.
          </p>
          <Button size='lg' className='rounded-lg text-base' asChild>
            <a href='#'>Back to home page</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Error
