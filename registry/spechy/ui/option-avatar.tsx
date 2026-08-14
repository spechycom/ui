import { initials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

/**
 * Çoklu seçim chip'lerinde/dropdown satırlarında kullanıcı/ekip seçeneği
 * için baş harf rozeti — `AsyncMultiSelect`, settings `MultiSelect` ve
 * filter-panel `MultiComboboxField`'ın üçünde de aynı görsel (Rule of
 * Three, CLAUDE.md § Temel prensipler — üçü de aynı `Avatar`+`initials`
 * bloğunu ayrı ayrı yazıyordu). Kalıcı proje kararı: multiselect seçenekleri
 * kullanıcı/ekip ise bu, kanal ise `option.icon`/`getChannelIcon` zorunlu.
 */
export function OptionAvatar({ label }: { label: string }) {
  return (
    // aria-hidden: baş harfleri label'ın kendisinin tekrarı — erişilebilir
    // isme (ör. CommandItem'ın role="option" adına) sızıp "AY Ayşe Yılmaz"
    // gibi bir çiftlemeye yol açmasın.
    <Avatar aria-hidden size="sm">
      <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
        {initials(label)}
      </AvatarFallback>
    </Avatar>
  )
}
