import { cva, type VariantProps } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from 'radix-ui'
import type * as React from 'react'
import { useEffect } from 'react'

import { useHorizontalScrollFade } from '@/hooks/use-horizontal-scroll-fade'
import { cn } from '@/lib/utils'

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  },
)

/** Width of the edge fade — the mask that signals there's more content to scroll to. */
const SCROLL_FADE_WIDTH = '2rem'

function buildScrollFadeMask(fadeStart: boolean, fadeEnd: boolean): string | undefined {
  if (!fadeStart && !fadeEnd) return undefined
  const start = fadeStart ? SCROLL_FADE_WIDTH : '0px'
  const end = fadeEnd ? SCROLL_FADE_WIDTH : '0px'
  // The mask only uses the alpha channel; `black` here isn't a theme color, it means "fully opaque".
  return `linear-gradient(to right, transparent, black ${start}, black calc(100% - ${end}), transparent)`
}

/**
 * When the tab strip overflows it scrolls horizontally instead of wrapping: a wrapped
 * row used to sit outside the fixed `h-9` box and overlap the form fields below it.
 * The scroll container is `TabsList`'s own wrapper — don't reintroduce `flex-wrap` or a
 * hand-rolled scroll container at the call site. The wrapper adds nothing to the outer
 * size; the active indicator and focus ring live on `TabsTrigger` and stay inside the
 * list box, so they're never clipped.
 */
function TabsList({
  className,
  variant = 'line',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  const { ref, canScrollLeft, canScrollRight, onScroll } = useHorizontalScrollFade<HTMLDivElement>()
  const maskImage = buildScrollFadeMask(canScrollLeft, canScrollRight)
  useScrollActiveTriggerIntoView(ref)

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      data-slot="tabs-list-viewport"
      style={{ maskImage, WebkitMaskImage: maskImage }}
      className="scrollbar-hover-reveal min-w-0 shrink-0 overflow-x-auto overflow-y-hidden group-data-[orientation=vertical]/tabs:overflow-visible"
    >
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </div>
  )
}

/**
 * Scrolls the active tab into view when it's out of frame (a restored tab, or a
 * validation error switching tabs programmatically). Keyboard navigation already gets
 * this for free from the browser's own focus scrolling; this observer covers the case
 * where `data-state` changes programmatically instead.
 */
function useScrollActiveTriggerIntoView(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const viewport = ref.current
    if (!viewport) return

    const scrollActiveIntoView = () => {
      viewport
        .querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
        ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }

    scrollActiveIntoView()
    const observer = new MutationObserver(scrollActiveIntoView)
    observer.observe(viewport, { subtree: true, attributeFilter: ['data-state'] })
    return () => observer.disconnect()
  }, [ref])
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
        'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
        'data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground group-data-[variant=line]/tabs-list:data-[state=active]:text-primary',
        'after:absolute after:bg-primary after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-3px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-end-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants }
