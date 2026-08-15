// ponytar: elle 37 registry item yazmak yerine importlardan otomatik üretim.
// Yeni bileşen eklerken bu script tekrar çalıştırılır, çıktı gözden geçirilir.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'

const DIR = new URL('../registry/spechy/ui/', import.meta.url)
const BLOCKS_DIR = new URL('../registry/spechy/blocks/', import.meta.url)
const NPM_DEP_MAP = {
  'radix-ui': 'radix-ui',
  '@tabler/icons-react': '@tabler/icons-react',
  'class-variance-authority': 'class-variance-authority',
  cmdk: 'cmdk',
  'date-fns': 'date-fns',
  'date-fns/locale': 'date-fns',
  'react-day-picker': 'react-day-picker',
}

// Bir dosyanın import'larından dependencies/registryDependencies çıkarır.
// `deps`/`registryDeps` çağıran tarafından verilir — birden fazla dosya
// (ör. bir block klasöründeki tüm dosyalar) aynı Set'e biriktirebilir.
function collectImports(src, { deps, registryDeps, name }) {
  for (const m of src.matchAll(/from ['"]([^'"]+)['"]/g)) {
    const spec = m[1]
    if (spec === 'react' || spec === 'react/jsx-runtime') continue
    if (spec === '@/lib/utils') {
      registryDeps.add('@spechy/utils')
    } else if (spec.startsWith('@/components/ui/')) {
      registryDeps.add(`@spechy/${spec.replace('@/components/ui/', '')}`)
    } else if (spec.startsWith('@/hooks/')) {
      registryDeps.add(`@spechy/${spec.replace('@/hooks/', '')}`)
    } else if (NPM_DEP_MAP[spec]) {
      deps.add(NPM_DEP_MAP[spec])
    } else if (!spec.startsWith('.')) {
      console.warn(`[${name}] eşlenmemiş import: ${spec} — registry.json'a elle eklenmeli`)
    }
  }
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.tsx'))
const items = []

for (const file of files) {
  const name = file.replace(/\.tsx$/, '')
  const src = readFileSync(new URL(file, DIR), 'utf8')
  const deps = new Set()
  const registryDeps = new Set()

  collectImports(src, { deps, registryDeps, name })
  registryDeps.delete(`@spechy/${name}`) // kendine referans olmasın (barrel export tarama hatası)

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

// registry/spechy/blocks/<klasör>/ → tek bir registry:block item.
// Klasör yoksa (henüz block eklenmemiş) sessizce sıfır item üretir.
const blockItems = []
const blockDirNames = existsSync(BLOCKS_DIR)
  ? readdirSync(BLOCKS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : []

for (const name of blockDirNames) {
  const blockDir = new URL(`${name}/`, BLOCKS_DIR)
  const blockFiles = readdirSync(blockDir, { withFileTypes: true })
    .filter((d) => d.isFile() && !d.name.startsWith('.')) // .DS_Store vb. dosya sistemi çöpünü atla
    .map((d) => d.name)
    .sort()
  if (blockFiles.length === 0) continue // henüz dosya eklenmemiş klasör — item üretme

  const deps = new Set()
  const registryDeps = new Set()

  for (const file of blockFiles) {
    const src = readFileSync(new URL(file, blockDir), 'utf8')
    collectImports(src, { deps, registryDeps, name })
  }
  registryDeps.delete(`@spechy/${name}`) // kendine referans olmasın (ui loop'uyla aynı guard)

  blockItems.push({
    name,
    type: 'registry:block',
    title: name,
    dependencies: [...deps].sort(),
    registryDependencies: [...registryDeps].sort(),
    files: blockFiles.map((file) => ({
      path: `registry/spechy/blocks/${name}/${file}`,
      type: 'registry:block',
      target: `~/src/blocks/${name}/${file}`,
    })),
  })
}

blockItems.sort((a, b) => a.name.localeCompare(b.name))

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
      name: 'use-theme',
      type: 'registry:hook',
      title: 'use-theme',
      description:
        'ThemeProvider + useTheme() — light/dark/system tema seçimini localStorage’a yazar, <html>’e `dark` class’ını uygular, "system" seçiliyken işletim sistemi tercihini dinler.',
      files: [
        {
          path: 'registry/spechy/hooks/use-theme.tsx',
          type: 'registry:hook',
          target: '~/hooks/use-theme.tsx',
        },
      ],
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
    ...blockItems,
    {
      name: 'spechy-ui-all',
      type: 'registry:block',
      title: 'Tüm Spechy UI bileşenleri',
      description: 'Tek komutla tüm bileşenleri + tema dosyasını kurar.',
      registryDependencies: ['@spechy/theme', ...items.map((i) => `@spechy/${i.name}`)],
      files: [],
    },
  ],
}

writeFileSync(new URL('../registry.json', import.meta.url), `${JSON.stringify(registry, null, 2)}\n`)
console.log(`${items.length} bileşen + ${blockItems.length} block + utils + bundle → registry.json yazıldı`)
