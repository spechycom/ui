// ponytar: elle 37 registry item yazmak yerine importlardan otomatik üretim.
// Yeni bileşen eklerken bu script tekrar çalıştırılır, çıktı gözden geçirilir.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const DIR = new URL('../registry/spechy/ui/', import.meta.url)
const NPM_DEP_MAP = {
  'radix-ui': 'radix-ui',
  '@tabler/icons-react': '@tabler/icons-react',
  'class-variance-authority': 'class-variance-authority',
  cmdk: 'cmdk',
  'date-fns': 'date-fns',
  'date-fns/locale': 'date-fns',
  'react-day-picker': 'react-day-picker',
  'react-i18next': 'react-i18next',
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.tsx'))
const items = []

for (const file of files) {
  const name = file.replace(/\.tsx$/, '')
  const src = readFileSync(new URL(file, DIR), 'utf8')
  const deps = new Set()
  const registryDeps = new Set()

  for (const m of src.matchAll(/from ['"]([^'"]+)['"]/g)) {
    const spec = m[1]
    if (spec === 'react' || spec === 'react/jsx-runtime') continue
    if (spec === '@/lib/utils') {
      registryDeps.add('utils')
    } else if (spec.startsWith('@/components/ui/')) {
      registryDeps.add(spec.replace('@/components/ui/', ''))
    } else if (NPM_DEP_MAP[spec]) {
      deps.add(NPM_DEP_MAP[spec])
    } else if (!spec.startsWith('.')) {
      console.warn(`[${name}] eşlenmemiş import: ${spec} — registry.json'a elle eklenmeli`)
    }
  }

  registryDeps.delete(name) // kendine referans olmasın (barrel export tarama hatası)

  items.push({
    name,
    type: 'registry:ui',
    title: name,
    dependencies: [...deps].sort(),
    registryDependencies: [...registryDeps].sort(),
    files: [{ path: `registry/spechy/ui/${file}`, type: 'registry:ui' }],
  })
}

items.sort((a, b) => a.name.localeCompare(b.name))

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'spechy',
  homepage: 'https://github.com/spechycom/ui',
  items: [
    {
      name: 'utils',
      type: 'registry:lib',
      title: 'utils',
      dependencies: ['clsx', 'tailwind-merge'],
      files: [{ path: 'registry/spechy/lib/utils.ts', type: 'registry:lib' }],
    },
    {
      name: 'theme',
      type: 'registry:file',
      title: 'Spechy tasarım token’ları',
      description:
        'Bileşenlerin render için ihtiyaç duyduğu CSS değişkenleri (renk, control yüksekliği, radius, gölge, animasyon). Önce bu eklenmeli.',
      dependencies: ['tw-animate-css'],
      files: [
        {
          path: 'registry/spechy/theme/spechy-ui-theme.css',
          type: 'registry:file',
          target: '~/styles/spechy-ui-theme.css',
        },
      ],
    },
    ...items,
    {
      name: 'spechy-ui-all',
      type: 'registry:block',
      title: 'Tüm Spechy UI bileşenleri',
      description: 'Tek komutla tüm bileşenleri + tema dosyasını kurar.',
      registryDependencies: ['theme', ...items.map((i) => i.name)],
      files: [],
    },
  ],
}

writeFileSync(new URL('../registry.json', import.meta.url), `${JSON.stringify(registry, null, 2)}\n`)
console.log(`${items.length} bileşen + utils + bundle → registry.json yazıldı`)
