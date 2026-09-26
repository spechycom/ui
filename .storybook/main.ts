import type { StorybookConfig } from '@storybook/react-vite'

// No `viteFinal`: `@storybook/builder-vite` auto-loads the project's root
// `vite.config.ts` (minus `build.target`) and merges it with its own config —
// the `@` alias and `@vitejs/plugin-react` are inherited from there. Tailwind
// itself is added below via `.storybook/preview.css` + `@tailwindcss/vite`,
// since the library's own `vite.config.ts` doesn't need Tailwind to build.
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig) => {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()]
    return viteConfig
  },
}

export default config
