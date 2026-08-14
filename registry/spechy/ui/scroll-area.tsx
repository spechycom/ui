import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        // Radix, çocuğu `display:table; min-width:100%` inline style'lı bir
        // div'e sarıyor — auto table-layout, içindeki metin (truncate/nowrap)
        // taşana kadar genişliği içeriğe göre büyütüyor, bu da kırpma yerine
        // yatay taşmaya yol açıyor. Inline style'ı ezmek için `!` gerekiyor.
        className="size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>div]:!block"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'flex touch-none select-none p-px transition-colors',
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
