// ponytail: generates registry.json from real imports instead of hand-writing ~40 items.
// Re-run this after adding/editing a component; review the diff.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'

const DIR = new URL('../src/ui/', import.meta.url)
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

// Extracts dependencies/registryDependencies from a file's imports.
// `deps`/`registryDeps` are provided by the caller — several files (e.g. every
// file in a block folder) can accumulate into the same Set.
function collectImports(src, { deps, registryDeps, name }) {
  for (const m of src.matchAll(/from ['"]([^'"]+)['"]/g)) {
    const spec = m[1]
    if (spec === 'react' || spec === 'react/jsx-runtime') continue
    if (spec.startsWith('@/lib/')) {
      registryDeps.add(`@spechy/${spec.replace('@/lib/', '')}`)
    } else if (spec.startsWith('@/components/ui/')) {
      registryDeps.add(`@spechy/${spec.replace('@/components/ui/', '')}`)
    } else if (spec.startsWith('@/hooks/')) {
      registryDeps.add(`@spechy/${spec.replace('@/hooks/', '')}`)
    } else if (NPM_DEP_MAP[spec]) {
      deps.add(NPM_DEP_MAP[spec])
    } else if (!spec.startsWith('.')) {
      console.warn(`[${name}] unmapped import: ${spec} — add it to registry.json by hand`)
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
  registryDeps.delete(`@spechy/${name}`) // no self-reference (barrel export would otherwise pick itself up)

  items.push({
    name,
    type: 'registry:ui',
    title: name,
    dependencies: [...deps].sort(),
    registryDependencies: [...registryDeps].sort(),
    files: [{ path: `src/ui/${file}`, type: 'registry:ui' }],
  })
}

items.sort((a, b) => a.name.localeCompare(b.name))

// registry/spechy/blocks/<folder>/ → one registry:block item each.
// A missing folder (no blocks added yet) silently yields zero items.
const blockItems = []
const blockDirNames = existsSync(BLOCKS_DIR)
  ? readdirSync(BLOCKS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : []

for (const name of blockDirNames) {
  const blockDir = new URL(`${name}/`, BLOCKS_DIR)
  const blockFiles = readdirSync(blockDir, { withFileTypes: true })
    .filter((d) => d.isFile() && !d.name.startsWith('.')) // skip .DS_Store and the like
    .map((d) => d.name)
    .sort()
  if (blockFiles.length === 0) continue // folder exists but has no files yet — no item

  const deps = new Set()
  const registryDeps = new Set()

  for (const file of blockFiles) {
    const src = readFileSync(new URL(file, blockDir), 'utf8')
    collectImports(src, { deps, registryDeps, name })
  }
  registryDeps.delete(`@spechy/${name}`) // same self-reference guard as the ui loop

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
      files: [{ path: 'src/lib/utils.ts', type: 'registry:lib' }],
    },
    {
      name: 'portal-container',
      type: 'registry:lib',
      title: 'portal-container',
      description:
        'Lets nested overlays (Popover/Select/DropdownMenu) portal into an outer Dialog/Sheet\'s content node instead of `document.body`, so scroll locking keeps working.',
      files: [{ path: 'src/lib/portal-container.tsx', type: 'registry:lib' }],
    },
    {
      name: 'use-theme',
      type: 'registry:hook',
      title: 'use-theme',
      description:
        'ThemeProvider + useTheme() — writes the light/dark/system choice to localStorage, applies the `dark` class to `<html>`, and follows the OS preference while "system" is selected.',
      files: [
        {
          path: 'src/hooks/use-theme.tsx',
          type: 'registry:hook',
          target: '~/hooks/use-theme.tsx',
        },
      ],
    },
    {
      name: 'use-horizontal-scroll-fade',
      type: 'registry:hook',
      title: 'use-horizontal-scroll-fade',
      description: 'Scroll-edge state for a horizontally scrollable bar, to fade in a "more content" hint.',
      files: [
        {
          path: 'src/hooks/use-horizontal-scroll-fade.ts',
          type: 'registry:hook',
          target: '~/hooks/use-horizontal-scroll-fade.ts',
        },
      ],
    },
    {
      name: 'theme',
      type: 'registry:file',
      title: 'Spechy design tokens',
      description:
        'The CSS variables components need to render (color, control height, radius, shadow, animation). Add this first.',
      dependencies: ['tw-animate-css'],
      files: [
        {
          path: 'src/theme.css',
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
      title: 'All Spechy UI components',
      description: 'Installs every component plus the theme file in one command.',
      registryDependencies: ['@spechy/theme', ...items.map((i) => `@spechy/${i.name}`)],
      files: [],
    },
  ],
}

writeFileSync(new URL('../registry.json', import.meta.url), `${JSON.stringify(registry, null, 2)}\n`)
console.log(
  `${items.length} components + ${blockItems.length} blocks + utils/hooks/theme + bundle → registry.json written`,
)
