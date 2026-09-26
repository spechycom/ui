import { createContext, useContext } from 'react'

/**
 * Nested scroll bug: while a `Sheet`/`Dialog` is open, `react-remove-scroll` only allows
 * wheel/touch events on its own content node (its `shards`); a `Popover`/`Select`/
 * `DropdownMenu` portaling into `document.body` falls outside that allowance and its
 * scroll locks up. Fix: portal the nested content into the outer modal's content node
 * instead — `SheetContent`/`DialogContent` write it, `PopoverContent`/`SelectContent`/
 * `DropdownMenuContent` read it; with no provider it returns `null` and Radix falls back
 * to `document.body` anyway.
 */
const PortalContainerContext = createContext<HTMLElement | null>(null)

export const PortalContainerProvider = PortalContainerContext.Provider

export function usePortalContainer() {
  return useContext(PortalContainerContext)
}
