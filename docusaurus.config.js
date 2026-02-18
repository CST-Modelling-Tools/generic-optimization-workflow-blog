// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Generic Optimization Workflow (GOW) Development Blog',
  tagline: 'Development notes, releases, and architecture decisions',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://CST-Modelling-Tools.github.io',
  baseUrl: '/generic-optimization-workflow-blog/',
  trailingSlash: false,
  organizationName: 'CST-Modelling-Tools',
  projectName: 'generic-optimization-workflow-blog',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Plugins configuration
  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-XXXXXXXXXX', // Replace with your actual Measurement ID
        anonymizeIP: true, // Optional: anonymize IP addresses for privacy
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        blog: {
          routeBasePath: '/', // Make blog the homepage
          showReadingTime: true,
          blogTitle: 'Generic Optimization Workflow (GOW) Development Blog',
          blogDescription:
            'Development updates for the Generic Optimization Workflow (GOW): releases, roadmap updates, and architecture decisions.',
          postsPerPage: 10,
          blogSidebarTitle: 'Recent Posts',
          blogSidebarCount: 'ALL',
          feedOptions: {
            type: 'all',
            title: 'Generic Optimization Workflow (GOW) Development Blog',
            description:
              'Development updates for the Generic Optimization Workflow (GOW).',
            copyright: `Copyright © ${new Date().getFullYear()} Generic Optimization Workflow (GOW) Project`,
            language: 'en',
          },
        },
        docs: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const {defaultCreateSitemapItems, ...rest} = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.map((item) => {
              if (
                item.url.includes('/welcome') ||
                (!item.url.includes('/tags') &&
                  !item.url.includes('/archive') &&
                  item.url !== rest.siteConfig.url + rest.siteConfig.baseUrl)
              ) {
                return {...item, priority: 0.7, changefreq: 'daily'};
              }
              if (item.url === rest.siteConfig.url + rest.siteConfig.baseUrl) {
                return {...item, priority: 1.0, changefreq: 'daily'};
              }
              return item;
            });
          },
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {
          name: 'keywords',
          content:
            'generic optimization workflow, GOW, optimization workflow, software development, releases, roadmap, architecture',
        },
        { name: 'author', content: 'Manuel Blanco' },
        {
          name: 'description',
          content:
            'Development blog for Generic Optimization Workflow (GOW), including releases, roadmap updates, and architecture decisions.',
        },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:site_name',
          content: 'Generic Optimization Workflow (GOW) Development Blog',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],

      image: 'img/docusaurus-social-card.jpg',

      colorMode: {
        respectPrefersColorScheme: true,
      },

      navbar: {
        title: 'GOW Development Blog',
        logo: {
          alt: 'Generic Optimization Workflow (GOW) logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'html',
            position: 'left',
            value: `
              <div class="navbar-funding-center">
                <span class="navbar-funding-center-text">
                  Grant ATR2024-155003 funded by:
                </span>
                <img
                  src="/generic-optimization-workflow-blog/img/MICIU_AEI.jpg"
                  alt="MICIU &amp; AEI logo"
                  class="navbar-funding-center-logo"
                />
              </div>
            `,
          },
          {
            href: 'https://github.com/CST-Modelling-Tools/generic-optimization-workflow-blog',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Development',
            items: [
              { label: 'Blog', to: '/' },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'GOW Blog Repository',
                href: 'https://github.com/CST-Modelling-Tools/generic-optimization-workflow-blog',
              },
              {
                label: 'GOW Main Repository',
                href: 'https://github.com/CST-Modelling-Tools/generic-optimization-workflow',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/CST-Modelling-Tools/generic-optimization-workflow-blog',
              },
            ],
          },
          {
            title: 'Funding',
            items: [
              {
                html: `
                  <div class="funding-block">
                    <p class="funding-text">
                      The <strong>GOW Development Blog</strong> supports transparent and reproducible optimization workflow development.
                    </p>
                    <p>
                      Grant ATR2024-155003 funded by:<br/>
                      <img
                        class="funding-logo"
                        src="/generic-optimization-workflow-blog/img/MICIU_AEI.jpg"
                        alt="MICIU + AEI logo"
                      />
                    </p>
                  </div>
                `,
              },
            ],
          },
        ],

        copyright: `Copyright © ${new Date().getFullYear()} Generic Optimization Workflow (GOW) Project. Free and Open Source Software.
        Documentation licensed under
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>.
        Built with Docusaurus.`,
      },

      // ✅ Giscus (comments)
      // Requires: GitHub Discussions enabled + Giscus app installed for this repo
      giscus: {
        repo: 'CST-Modelling-Tools/generic-optimization-workflow-blog',
        repoId: 'R_kgDORTKtXw',
        category: 'General',
        categoryId: 'DIC_kwDORTKtX84C2t_a',
        mapping: 'pathname',
        strict: '0',
        reactionsEnabled: '1',
        emitMetadata: '0',
        inputPosition: 'bottom',
        theme: 'preferred_color_scheme',
        lang: 'en',
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'powershell'],
      },
    }),
};

export default config;
