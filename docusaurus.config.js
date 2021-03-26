/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Polygon SDK',
  url: 'https://gifted-pike-b1f52e.netlify.app/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon-32x32.png',
  organizationName: '0xPolygon',
  projectName: 'polygon-sdk-docs',
  themeConfig: {
    colorMode: {
      defaultMode: 'dark'
    },
    prism: {
      defaultLanguage: 'go'
    },
    navbar: {
      hideOnScroll: true,
      title: 'Polygon SDK',
      logo: {
        alt: 'Polygon SDK Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          to: 'docs/home/overview',
          activeBasePath: 'docs/home',
          label: 'Basics',
          position: 'left'
        },
        {
          to: 'docs/modules/blockchain',
          activeBasePath: 'docs/modules',
          label: 'Modules',
          position: 'left'
        },
        {
          href: 'https://github.com/0xPolygon/polygon-sdk',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         to: 'docs/'
      //       }
      //     ]
      //   },
      //   {
      //     title: 'More',
      //     items: [
      //       {
      //         label: 'GitHub',
      //         href: 'https://github.com/facebook/docusaurus'
      //       }
      //     ]
      //   }
      // ],
      copyright: `Made with ❤ by the humans at MVP Workshop`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/0xPolygon/polygon-sdk-docs',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};
