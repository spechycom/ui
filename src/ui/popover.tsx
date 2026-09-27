'use client'

import { Popover as PopoverPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'
import { usePortalContainer } from '@/lib/portal-container'

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * When a `Select`/`DropdownMenu` INSIDE a Popover opens, its content is rendered into a
 * sibling portal — it sits next to the popover in the DOM, not under it. Radix treats
 * that as an "outside click" and closes the popover, so from the user's view the nested
 * dropdown never seems to open (this is how a calendar's month/year picker used to break).
 * Interaction from these nested layers is logically inside the popover, not outside it.
 */
function isInsideNestedOverlay(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('[data-slot="select-content"], [data-slot="dropdown-menu-content"]') !== null
  )
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  onPointerDownOutside,
  onFocusOutside,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  // Nested scroll fix — portals into the enclosing Sheet/Dialog's content node when there is one, otherwise document.body.
  const container = usePortalContainer()
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        onPointerDownOutside={(event) => {
          if (isInsideNestedOverlay(event.target)) event.preventDefault()
          onPointerDownOutside?.(event)
        }}
        onFocusOutside={(event) => {
          if (isInsideNestedOverlay(event.target)) event.preventDefault()
          onFocusOutside?.(event)
        }}
        className={cn(
          'z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('flex flex-col gap-1 text-sm', className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <div data-slot="popover-title" className={cn('font-medium', className)} {...props} />
}

function PopoverDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="popover-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
