# Spechy UI

> Spechy'nin özelleştirilmiş [shadcn/ui](https://ui.shadcn.com) bileşen registry'si. Kaynak: https://github.com/spechycom/ui

I want you to install Spechy UI into this project for me. Execute all the steps below autonomously.

OBJECTIVE: Bu projeye `@spechy` shadcn registry'sini tanımla, tema token'larını
ve (kullanıcı belirli bileşen adı vermediyse tümünü, verdiyse sadece onları)
bileşenleri kur. Bu ortam Claude Code ise kurulum/güncelleme skill'ini de
projeye ekle.

DONE WHEN: `components.json` içinde `registries.@spechy` tanımlı, tema dosyası
ana CSS'ten import ediliyor, istenen bileşen dosyaları projenin ui alias
dizininde mevcut, hepsi sıfır hata ile bitti.

TODO:
- [ ] `components.json` var mı kontrol et; yoksa `npx shadcn@latest init`
      çalıştır (paket yöneticisine göre `pnpm dlx`/`yarn dlx`/`bunx --bun` da
      olabilir — kilit dosyasına bak: `pnpm-lock.yaml`/`yarn.lock`/`bun.lockb`).
      Bu adım stil ve alias sorularını interaktif sorar, atlanamaz.
- [ ] Vite projesiyse kök `tsconfig.json`'da `@/*` alias'ı (`baseUrl` +
      `paths`) tanımlı mı kontrol et — sadece `tsconfig.app.json`'da olması
      yetmez, yoksa dosyalar `src/` yerine literal bir `@/` klasörüne düşer.
      Yoksa ekle.
- [ ] `components.json`'a şunu ekle (zaten varsa atla):
      ```json
      "registries": {
        "@spechy": "https://raw.githubusercontent.com/spechycom/ui/main/public/r/{name}.json"
      }
      ```
      Bu tanım proje başına bir kere yapılır, `{name}` yer tutucusunu CLI her
      `add` çağrısında otomatik dolduruyor.
- [ ] `npx shadcn@latest add @spechy/theme` çalıştır. Oluşan
      `spechy-ui-theme.css`'i ana CSS dosyasında `@import "tailwindcss"`'ten
      **sonra** import et: `@import "./spechy-ui-theme.css";`. `tw-animate-css`
      paketi kurulu değilse ekle.
- [ ] Kullanıcı belirli bileşen adı vermediyse tümünü kur:
      `npx shadcn@latest add @spechy/spechy-ui-all`. Verdiyse sadece onları:
      `npx shadcn@latest add @spechy/<isim> @spechy/<isim2> ...`.
- [ ] Bu ortam Claude Code ise skill dosyasını da ekle:
      ```bash
      mkdir -p .claude/skills/spechy-ui
      curl -fsSL https://raw.githubusercontent.com/spechycom/ui/main/.claude/skills/spechy-ui/SKILL.md \
        -o .claude/skills/spechy-ui/SKILL.md
      ```
      Böylece ileride `/spechy-ui [bileşen-adı ...]` ile bileşen ekleyip
      güncelleyebilirsin. Claude Code değilse bu adımı atla.
- [ ] Projede i18n varsa: `PasswordInput` (`showLabel`/`hideLabel`),
      `DialogContent`/`SheetContent`/`DialogFooter` (`closeLabel`)
      kurulduysa bu bileşenleri kullanan yerlerde kendi çevirini geç
      (`<PasswordInput showLabel={t('password.show')} hideLabel={t('password.hide')} />`).
      i18n yoksa atla, varsayılan İngilizce string'ler kalır.

EXECUTE NOW: Yukarıdaki TODO listesini tamamla, hedef: yukarıdaki DONE WHEN
durumuna ulaşmak.
