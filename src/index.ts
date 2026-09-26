// @spechycom/ui v0.1 — see docs/spec-faz2.md §4.3 for the full contract.
// Components beyond this set live in src/ui/ for the shadcn registry but are
// not part of the package's public API yet.

export { cn } from '@/lib/utils'
export { type Theme, ThemeProvider, useTheme } from '@/hooks/use-theme'

export { Button, buttonVariants } from '@/ui/button'
export { Input } from '@/ui/input'
export { PasswordInput, type PasswordInputProps } from '@/ui/password-input'
export { Label } from '@/ui/label'
export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/ui/field'
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card'
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog'
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/ui/popover'
export { Calendar, CalendarDayButton, defaultCalendarEndMonth, defaultCalendarStartMonth } from '@/ui/calendar'
export { DateRangePicker, type DateRangeValue } from '@/ui/date-range-picker'
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from '@/ui/tabs'
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/ui/table'
export { Badge, badgeVariants } from '@/ui/badge'
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
export { Skeleton } from '@/ui/skeleton'
export { Spinner } from '@/ui/spinner'
export { Separator } from '@/ui/separator'
export { ScrollArea, ScrollBar } from '@/ui/scroll-area'
export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet'

export {
  DataTable,
  DEFAULT_DATA_TABLE_LABELS,
  type ColumnDef,
  type DataTableLabels,
  type DataTableProps,
  getPaginationRange,
} from '@/data-table'

export {
  AppSidebar,
  DEFAULT_APP_SIDEBAR_LABELS,
  type AppSidebarIcon,
  type AppSidebarLabels,
  type AppSidebarLinkProps,
  type AppSidebarNavItem,
  type AppSidebarProps,
  type ProfileMenuAction,
  type ProfileMenuLanguageOption,
  type ProfileMenuUser,
} from '@/app-sidebar'
