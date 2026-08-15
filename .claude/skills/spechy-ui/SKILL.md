---
name: spechy-ui
description: Bu projeye Spechy'nin özelleştirilmiş shadcn UI bileşenlerini ve sayfa bloklarını (auth, dashboard) kurar veya günceller. Argüman olarak bileşen/blok adları alır (ör. "button dialog" ya da "auth"); boş bırakılırsa tüm bileşenler kurulur.
disable-model-invocation: true
argument-hint: [bileşen-adı ... | blok-adı]
allowed-tools: Bash, Read, Edit, Write
---

`@spechy` registry'sinden bileşen ve blok kurar. Kaynak ve tam katalog:
https://github.com/spechycom/ui

Argüman bir blok adıysa (`auth`, `dashboard`) adım 4'ü atla, doğrudan
adım 4.5'e geç — bloklar da aynı registry + tema altyapısını kullanır, sadece
kurulan içerik farklıdır (bileşen değil, sayfa iskeleti). Blokların tam
kataloğu, hangi dosyaları içerdiği ve kurulum sonrası dikkat edilmesi
gereken noktalar için `references/blocks.md`'ye bak — orada okumadan blok
kurma, ör. `dashboard` bloğu bir `TooltipProvider` bekliyor ve bunu
kendi sağlamıyor, bu detayı görmeden kurulum "çalışıyor gibi görünüp"
konsolda sessizce yanlış render üretebilir.

Aşağıdaki komutlarda `npx` yazan her yerde, projenin kilit dosyasına göre
doğru çalıştırıcıyı kullan: `pnpm-lock.yaml` → `pnpm dlx`, `yarn.lock` →
`yarn dlx`, `bun.lockb`/`bun.lock` → `bunx --bun`, hiçbiri yoksa `npx`.

## 1. `components.json` var mı, kontrol et

Yoksa `npx shadcn@latest init` ile önce projeyi shadcn'e bağla —
bu adım stil ve alias sorularını interaktif sorar, atlanamaz.

**Bitti sayılır:** `components.json` dosyası proje kökünde mevcut.

Vite projesiyse kök `tsconfig.json`'da `@/*` alias'ı (`baseUrl` + `paths`)
tanımlı mı kontrol et — sadece `tsconfig.app.json`'da olması shadcn CLI için
yetmez, dosyalar `src/` yerine literal bir `@/` klasörüne düşer. Yoksa ekle.

## 2. `@spechy` registry'sini tanımla

`components.json`'ı oku. `registries.@spechy` yoksa ekle — bu tanım proje
başına **bir kere** yapılır, `{name}` yer tutucusunu CLI her `add`
çağrısında otomatik dolduruyor, bileşen başına tekrarlanmaz:

```json
"registries": {
  "@spechy": "https://raw.githubusercontent.com/spechycom/ui/main/public/r/{name}.json"
}
```

Zaten varsa bu adımı atla.

**Bitti sayılır:** `components.json` içinde `registries["@spechy"]` bu URL'i taşıyor.

## 3. Tema token'larını kur (ilk kurulumda bir kere)

Proje ana CSS dosyasında `spechy-ui-theme.css` import'u yoksa:

```bash
npx shadcn@latest add @spechy/theme
```

Sonra oluşan dosyayı proje ana CSS dosyasına, `@import "tailwindcss"`'ten
**sonra** ekle: `@import "./spechy-ui-theme.css";`. `tw-animate-css` paketi
kurulu değilse ekle.

**Bitti sayılır:** tema dosyası diskte var ve ana CSS'ten import ediliyor.

## 4. Bileşenleri kur

Argüman verildiyse o bileşenleri, verilmediyse tümünü kur:

```bash
# argümanla: npx shadcn@latest add @spechy/button @spechy/dialog
# argümansız (hepsi):
npx shadcn@latest add @spechy/spechy-ui-all
```

**Bitti sayılır:** komut sıfır çıkış koduyla bitti, istenen bileşen
dosyaları projenin ui alias dizininde oluştu.

## 4.5. Blok kur (opsiyonel — argüman bir blok adıysa)

Komutu çalıştırmadan önce `references/blocks.md`'yi oku: hangi dosyaların
geleceği, hangi `registryDependencies`'in tetikleneceği ve kurulum sonrası
elle yapılması gereken bağlama (router, `TooltipProvider`, i18n) orada —
blok "sıfır iş mantığı" prensibiyle yazıldığı için prop'la değil, dosyayı
doğrudan düzenleyerek özelleştirilir, bu yüzden ne geldiğini önceden bilmek
kurulum sonrası şaşırmamak için önemli.

```bash
npx shadcn@latest add @spechy/auth
npx shadcn@latest add @spechy/dashboard
```

Dosyalar bileşenlerden farklı bir yere, `src/blocks/<blok-adı>/` altına
iner — `src/components/ui/` ile karıştırma.

**Bitti sayılır:** komut sıfır çıkış koduyla bitti, blok dosyaları
`src/blocks/<blok-adı>/` altında oluştu, `references/blocks.md`'deki
kurulum-sonrası notlar kullanıcıya iletildi.

## 5. Metin prop'larını i18n'e bağla (opsiyonel)

Hiçbir bileşen sabit bir i18n kütüphanesi/anahtarı zorlamaz; kullanıcıya
görünen metinler varsayılan İngilizce string'li prop'lardır:
`PasswordInput`'ta `showLabel`/`hideLabel`, `DialogContent`/`SheetContent`'te
`closeLabel`, `DialogFooter`'da `closeLabel`. Projede i18n kuruluysa bu
bileşenleri kullanan yerlerde kendi çevirini geç (ör.
`<PasswordInput showLabel={t('password.show')} hideLabel={t('password.hide')} />`).
Kurulu değilse bu adımı atla, varsayılanlar kalır.
