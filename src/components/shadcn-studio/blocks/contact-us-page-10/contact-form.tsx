import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const ContactForm = () => {
  return (
    <form className='space-y-6' onSubmit={e => e.preventDefault()}>
      <div className='w-full space-y-2'>
        <Label htmlFor='username'>Full Name</Label>
        <Input type='text' className='h-10' placeholder='Enter your name here...' id='username' />
      </div>

      <div className='w-full space-y-2'>
        <Label htmlFor='useremail'>Your Email</Label>
        <Input type='email' className='h-10' placeholder='Enter your email here...' id='useremail' />
      </div>

      <div className='mb-4 space-y-2'>
        <Label htmlFor='usermessage'>Message</Label>
        <Textarea placeholder='Enter your message' id='usermessage' />
      </div>

      <Button type='submit' size='lg' className='w-full rounded-lg text-base has-[>svg]:px-6'>
        Get Free Quote
      </Button>
    </form>
  )
}

export default ContactForm
