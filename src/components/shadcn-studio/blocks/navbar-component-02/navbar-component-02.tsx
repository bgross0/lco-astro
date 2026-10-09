import { ArrowRightIcon, ChevronRightIcon, MenuIcon, PhoneIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'

import Logo from '@/components/shadcn-studio/logo'

import { cn } from '@/lib/utils'

export type NavigationLink = {
  title: string
  href: string
}

export type NavigationItem = NavigationLink & {
  /** Mega menu columns, e.g. services grouped by category. */
  groups?: { title: string; items: NavigationLink[] }[]
  /** Plain dropdown links. */
  items?: NavigationLink[]
}

type Phone = { label: string; display: string; href: string }

type NavbarProps = {
  navigationData: NavigationItem[]
  currentPath: string
  phone: Phone
}

const triggerClass =
  'text-muted-foreground hover:text-primary data-[active=true]:text-primary bg-transparent px-2.5 py-1.5 text-base font-medium hover:bg-transparent focus:bg-accent data-[state=open]:bg-transparent data-[state=open]:text-primary [&>svg]:size-4'

const Navbar = ({ navigationData, currentPath, phone }: NavbarProps) => {
  const isCurrent = (href: string) => currentPath === href
  const isActive = (href: string) => href !== '/' && (currentPath === href || currentPath.startsWith(`${href}/`))
  const sectionActive = (item: NavigationItem) =>
    isActive(item.href) ||
    (item.items ?? []).some(link => isActive(link.href)) ||
    (item.groups ?? []).some(group => group.items.some(link => isActive(link.href)))

  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/85 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 xl:py-4'>
        <a href='/' className='rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none'>
          <Logo className='gap-3' />
        </a>

        <div className='flex items-center gap-5'>
          <NavigationMenu viewport={false} className='max-xl:hidden' aria-label='Main'>
            <NavigationMenuList className='gap-0'>
              {navigationData.map(item => {
                if (item.groups) {
                  return (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger data-active={sectionActive(item)} className={triggerClass}>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className='absolute w-auto'>
                        <div className='grid w-[52rem] grid-cols-4 gap-x-6 gap-y-4 p-3'>
                          {item.groups.map(group => (
                            <div key={group.title} className='space-y-1'>
                              <p className='text-muted-foreground px-2 pb-1 text-xs font-semibold tracking-wide uppercase'>
                                {group.title}
                              </p>
                              <ul>
                                {group.items.map(link => (
                                  <li key={link.href}>
                                    <NavigationMenuLink
                                      href={link.href}
                                      active={isCurrent(link.href)}
                                      aria-current={isCurrent(link.href) ? 'page' : undefined}
                                    >
                                      {link.title}
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className='border-t p-2'>
                          <NavigationMenuLink
                            href={item.href}
                            className='text-primary flex-row items-center gap-1.5 font-medium'
                            aria-current={isCurrent(item.href) ? 'page' : undefined}
                          >
                            All services
                            <ArrowRightIcon className='text-primary!' />
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                }

                if (item.items) {
                  return (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger data-active={sectionActive(item)} className={triggerClass}>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className='absolute w-auto'>
                        <ul className='grid w-48 gap-0.5'>
                          {item.items.map(link => (
                            <li key={link.href}>
                              <NavigationMenuLink
                                href={link.href}
                                active={isCurrent(link.href)}
                                aria-current={isCurrent(link.href) ? 'page' : undefined}
                              >
                                {link.title}
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                }

                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      href={item.href}
                      data-active={isActive(item.href)}
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                      className={cn(navigationMenuTriggerStyle(), triggerClass)}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
          <Separator orientation='vertical' className='h-6! max-xl:hidden' />
          <Button className='rounded-lg text-base max-xl:hidden' size='lg' asChild>
            <a href={phone.href}>
              <PhoneIcon />
              {phone.display}
              <span className='sr-only'> ({phone.label})</span>
            </a>
          </Button>

          <div className='flex items-center gap-2 xl:hidden'>
            <Button size='icon' className='size-10' asChild>
              <a href={phone.href}>
                <PhoneIcon />
                <span className='sr-only'>
                  Call {phone.label} {phone.display}
                </span>
              </a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' className='size-10'>
                  <MenuIcon />
                  <span className='sr-only'>Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-72' align='end'>
                <DropdownMenuGroup>
                  {navigationData.map(item => {
                    const links = item.groups ? null : item.items

                    if (item.groups || links) {
                      return (
                        <Collapsible key={item.title} asChild>
                          <DropdownMenuGroup>
                            <CollapsibleTrigger asChild>
                              <DropdownMenuItem
                                onSelect={event => event.preventDefault()}
                                className='justify-between text-base'
                              >
                                <span className='flex-1'>{item.title}</span>
                                <ChevronRightIcon className='shrink-0 transition-transform [[data-state=open]>&]:rotate-90' />
                              </DropdownMenuItem>
                            </CollapsibleTrigger>
                            <CollapsibleContent className='pl-2'>
                              {item.groups?.map(group => (
                                <DropdownMenuGroup key={group.title}>
                                  <DropdownMenuLabel className='text-muted-foreground pt-2 text-xs font-semibold tracking-wide uppercase'>
                                    {group.title}
                                  </DropdownMenuLabel>
                                  {group.items.map(link => (
                                    <DropdownMenuItem key={link.href} asChild>
                                      <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
                                        {link.title}
                                      </a>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuGroup>
                              ))}
                              {item.groups && (
                                <DropdownMenuItem asChild>
                                  <a href={item.href} className='text-primary! font-medium'>
                                    All services
                                    <ArrowRightIcon className='text-primary!' />
                                  </a>
                                </DropdownMenuItem>
                              )}
                              {links?.map(link => (
                                <DropdownMenuItem key={link.href} asChild>
                                  <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
                                    {link.title}
                                  </a>
                                </DropdownMenuItem>
                              ))}
                            </CollapsibleContent>
                          </DropdownMenuGroup>
                        </Collapsible>
                      )
                    }

                    return (
                      <DropdownMenuItem key={item.title} asChild className='text-base'>
                        <a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
                          {item.title}
                        </a>
                      </DropdownMenuItem>
                    )
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='bg-transparent!' asChild>
                    <Button className='w-full grow text-base' asChild>
                      <a href={phone.href}>
                        <PhoneIcon className='text-primary-foreground!' />
                        {phone.label} {phone.display}
                      </a>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
