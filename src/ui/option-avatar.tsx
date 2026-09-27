import { initials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

/** Initials badge for a user/team option in multi-select chips or dropdown rows — one shared source. */
export function OptionAvatar({ label }: { label: string }) {
  return (
    // aria-hidden: the initials just repeat the label, keep them out of the accessible name to avoid duplication.
    <Avatar aria-hidden size="sm">
      <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
        {initials(label)}
      </AvatarFallback>
    </Avatar>
  )
}
