---
name: spechy-ui
description: Bu projeye Spechy'nin özelleştirilmiş shadcn UI bileşenlerini kurar veya günceller. Argüman olarak bileşen adları alır (ör. "button dialog"); boş bırakılırsa tüm bileşenler kurulur.
disable-model-invocation: true
argument-hint: [bileşen-adı ...]
allowed-tools: Bash, Read, Edit, Write
---

`@spechy` registry'sinden bileşen kurar. Kaynak ve tam katalog:
https://github.com/spechycom/ui

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

## 5. Bilinen istisnaları bildir

`password-input` kuruldularsa: bileşen `react-i18next` ile `t('password.show')`
/ `t('password.hide')` çağırıyor. Projede i18n kuruluysa bu iki anahtarı
çeviri dosyasına ekle; kurulu değilse `password-input.tsx` içindeki `t(...)`
çağrılarını düz string'e çevir. Kullanıcıya hangisini yaptığını söyle.
