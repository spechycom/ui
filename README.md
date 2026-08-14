# Spechy UI

Spechy'nin özelleştirdiği [shadcn/ui](https://ui.shadcn.com) bileşenleri —
`new-york` stili, [`@tabler/icons-react`](https://tabler.io/icons) ikonları,
`Inter` tipografisi ve marka renk paletiyle. Klasik bir npm paketi değil, bir
**shadcn registry**: bileşen kaynağı kendi projenize kopyalanır, dilediğiniz
gibi düzenleyebilirsiniz — npm sürümüne bağımlı kalmazsınız.

Kaynak: [`spechy-omni-web`](https://github.com/spechycom/spechy-omni-web)
`src/shared/ui/`'den taşındı ve standart shadcn alias'larına (`@/components/ui`,
`@/lib/utils`) uyacak şekilde yeniden yazıldı.

## Önkoşullar

Hedef projenizde şunlar kurulu olmalı:

- Tailwind CSS v4
- [`tw-animate-css`](https://www.npmjs.com/package/tw-animate-css)
- Bir shadcn `components.json` (yoksa `pnpm dlx shadcn@latest init` ile kurun)
- **Vite projelerinde:** `@/*` alias'ı kök `tsconfig.json`'da da tanımlı olmalı
  (`baseUrl` + `paths`) — sadece `tsconfig.app.json`'da olması yetmez, shadcn
  CLI alias'ı kök dosyadan okur. Eksikse kurulum dosyaları `src/` yerine
  literal bir `@/` klasörüne düşer. Bkz.
  [shadcn Vite kurulum dokümanı](https://ui.shadcn.com/docs/installation/vite).

## Kurulum

`components.json`'a registry'yi tanımlayın:

```json
{
  "registries": {
    "@spechy": "https://raw.githubusercontent.com/spechycom/ui/main/public/r/{name}.json"
  }
}
```

Önce tema dosyasını ekleyin (bileşenlerin `rounded-control`, `--control-md`
gibi token'ları buradan gelir), sonra bileşenleri:

```bash
# Tema (bir kere, projeye ilk entegrasyonda)
pnpm dlx shadcn@latest add @spechy/theme
# → oluşan dosyayı kendi ana CSS dosyanızda "@import tailwindcss"'ten SONRA import edin:
#   @import "./spechy-ui-theme.css";

# Tüm bileşenler, tek komut
pnpm dlx shadcn@latest add @spechy/spechy-ui-all

# Ya da tek tek
pnpm dlx shadcn@latest add @spechy/button @spechy/dialog
```

## Mevcut bileşenler

alert, alert-dialog, avatar, badge, button, calendar, card, checkbox,
collapsible, combobox, command, date-range-picker, date-time-picker, dialog,
dropdown-menu, field, input, label, option-avatar, otp-input, password-input,
popover, radio-group, scroll-area, select, separator, sheet, skeleton,
slider, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

## Bilinmesi gerekenler

- **`password-input`** görünür/gizle butonunun `aria-label`'ı için
  `react-i18next` kullanır (`password.show` / `password.hide` anahtarları).
  Projenizde i18n kuruluysa bu iki anahtarı çeviri dosyanıza ekleyin;
  kurulu değilse bileşeni kopyaladıktan sonra `t(...)` çağrılarını düz
  string'e çevirin.
- Bileşenler `@tabler/icons-react` kullanır, `lucide-react` değil.

## Yeni bileşen ekleme / güncelleme

1. `registry/spechy/ui/` altına dosyayı ekleyin veya güncelleyin — import'lar
   standart shadcn alias'larıyla yazılmalı (`@/components/ui/x`, `@/lib/utils`).
2. `node scripts/gen-registry.mjs` — `registry.json`'ı importlardan otomatik
   yeniden üretir; script'in uyaramadığı bir bağımlılık varsa uyarı basar,
   elle düzeltin.
3. `pnpm dlx shadcn@latest build` — `public/r/*.json` statik dosyalarını üretir.
4. Commit + push. `main`'e giden her push canlı registry'yi günceller.

## Claude Code entegrasyonu

Bu repoda `.claude/skills/spechy-ui/` altında bir kurulum skill'i var — bir
tüketici projeye kopyalayın (`.claude/skills/spechy-ui/`), ardından o
projede `/spechy-ui` ile bileşen ekletebilirsiniz.
