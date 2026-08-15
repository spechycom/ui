# Blok kataloğu

Bloklar, gerçek sayfa tasarımlarının **sıfır iş mantığına sahip** kopyalarıdır
— form validasyonu, veri çekme, routing, i18n bağlaması yok, sadece görsel
iskelet. Bir bileşenin aksine prop'larla dışarıdan yapılandırılmaz: kurulunca
proje kaynağına düşen düz `.tsx` dosyalarıdır, kullanıcı kendi iş mantığını
(form state, mutation, router entegrasyonu) doğrudan bu dosyaları düzenleyerek
ekler. Bu yüzden i18n için de "prop geç" değil, "metni doğrudan diskteki
dosyada değiştir" mantığı geçerlidir.

Kurulum, bileşenlerle aynı `add` komutu üzerinden çalışır — ayrı bir CLI yok:

```bash
npx shadcn@latest add @spechy/auth
npx shadcn@latest add @spechy/dashboard
```

Dosyalar `src/blocks/<blok-adı>/` altına iner (bileşenlerin `src/components/ui/`
altına inmesiyle aynı `~/` + `src/` konvansiyonu — bkz. SKILL.md § 1'deki
tsconfig alias notu, aynı gotcha bloklar için de geçerli).

## `auth`

| Dosya | İçerik |
| --- | --- |
| `auth-layout.tsx` | Split-screen shell — sol panelde gradient + öne çıkanlar listesi (`AuthHighlight[]`), sağda `children` |
| `login-page.tsx` | E-posta/şifre formu, "beni hatırla", şifremi unuttum linki, sosyal login satırı |
| `register-page.tsx` | Ad/e-posta/telefon/şifre/şifre onay formu, şartlar checkbox'ı |
| `forgot-password-page.tsx` | Tek e-posta alanlı basit form |
| `reset-password-page.tsx` | Yeni şifre + onay, güç göstergesi yok |
| `verify-code-page.tsx` | Kontrollü `OtpInput` ile kod girişi |
| `social-icons.tsx` | `GoogleIcon`/`MicrosoftIcon`/`FacebookIcon`/`TiktokIcon` — elle çizilmiş SVG, harici ikon paketine bağımlı değil |

`registryDependencies`: `button`, `checkbox`, `input`, `otp-input`,
`password-input`, `utils`. `dependencies`: `@tabler/icons-react`.

Sayfa içi linkler (`/login`, `/register`, `/forgot-password` ...) düz
`<a href>` — kendi router'ınıza (React Router, Next.js `Link`, vb.) bağlamak
size kalır, ADR-0023 tipi "iç navigasyon `<Link>` olmalı" kuralları burada
**geçerli değildir**, çünkü blok router-agnostik tasarlanmıştır.

## `dashboard`

| Dosya | İçerik |
| --- | --- |
| `app-layout.tsx` | Grid shell — masaüstünde sabit sidebar, mobilde `Sheet` içinde aynı sidebar, `Outlet` yerine `children` prop'u |
| `app-header.tsx` | Hamburger (mobil), statik arama input'u, bildirim zili (`Badge` sayaç sabit "3"), avatar + dropdown (Profile/Settings/Log out, `onClick` yok) |
| `app-sidebar.tsx` | 5 statik nav item, collapse/expand toggle, daraltılmışken `Tooltip` |
| `app-footer.tsx` | Tek satır telif hakkı metni |

`registryDependencies`: `avatar`, `badge`, `button`, `dropdown-menu`,
`input`, `sheet`, `tooltip`, `utils`. `dependencies`: `@tabler/icons-react`.

Notlar:
- `app-header.tsx`/`app-layout.tsx`/`app-sidebar.tsx` `'use client'` direktifi
  taşır — Next.js App Router tüketicileri için gerekli (event handler prop'u
  alan bir bileşen render ediyor), Vite/CRA gibi client-only projelerde
  zararsızdır, silmeye gerek yok.
- Sidebar'daki nav item'lar (`Dashboard`, `Contacts`, ...) ve aktif durum
  (`ACTIVE_LABEL`) sabit string karşılaştırmasıdır — gerçek route eşleştirmesi
  yok, kendi router'ınızın aktif-link mantığını siz eklersiniz.
- `Tooltip` kullanıldığı için tüketici projenin kök seviyesinde bir
  `TooltipProvider` olması gerekir (blok kendi provider'ını sarmaz — provider
  genelde app kökünde bir kere kurulur, blok içine gömülürse çift-provider
  hatası çıkar).

## Yeni blok eklerken

`registry/spechy/blocks/<yeni-blok>/` altına dosyaları koyup
`node scripts/gen-registry.mjs` çalıştırmak yeterli — script klasörü otomatik
algılayıp `registry:block` item'ına çevirir, `target` yolu her zaman
`~/src/blocks/<blok-adı>/<dosya>` şablonunu kullanır. Bu dosyayı da güncelleyip
yeni bloğun kataloğunu ekleyin.
