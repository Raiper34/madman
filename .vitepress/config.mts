import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './docs',
  outDir: './build/docs',
  assetsDir: './assets',
  title: "Madman",
  description: "MD manual in command line",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/installation' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        link: '/introduction'
      },
      {
        text: 'Getting started',
        link: '/installation'
      },
      {
        text: 'Usage',
        link: '/usage'
      },
      {
        text: 'License',
        link: '/license'
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Raiper34/madman' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/madman' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Filip Raiper34 Gulan'
    },
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/Raiper34/madman/tree/main/docs/:path'
    },
  }
})
