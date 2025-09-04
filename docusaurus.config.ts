import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ckaserer.dev',
  tagline: 'Day in the life of a cloud architect',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://ckaserer.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ckaserer', // Usually your GitHub org/user name.
  projectName: 'ckaserer.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'work-codex',
        path: 'docs/work-codex',
        routeBasePath: 'work-codex',
  sidebarPath: require.resolve('./sidebarsWorkCodex.ts'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'personal-os',
        path: 'docs/personal-os',
        routeBasePath: 'personal-os',
  sidebarPath: require.resolve('./sidebarsPersonalOs.ts'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'skyledger',
        path: 'docs/skyledger',
        routeBasePath: 'skyledger',
  sidebarPath: require.resolve('./sidebarsSkyLedger.ts'),
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'ckaserer.dev',
      logo: {
        alt: 'ckaserer.dev logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/work-codex', label: 'Work Codex', position: 'left' },
        { to: '/personal-os', label: 'Personal OS', position: 'left' },
        { to: '/skyledger', label: 'Sky Ledger', position: 'left' },
        { type: 'localeDropdown', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
            {
              label: 'GitHub',
              href: 'https://github.com/ckaserer',
            },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ckaserer.dev`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: 'FUDAFCB0H9',
      apiKey: '8e10782a2c032f3c9dc5972ca5f5852f',
      indexName: 'ckaserer.dev',
      contextualSearch: true,
      // Optional: see https://docusaurus.io/docs/search#docsearch-parameters
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
