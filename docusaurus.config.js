/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Polygon Edge',
  url: 'https://elegant-nightingale-894b88.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon-32x32.png',
  organizationName: '0xPolygon',
  projectName: 'polygon-edge-docs',
  themeConfig: {
    colorMode: {
      defaultMode: 'dark'
    },
    prism: {
      defaultLanguage: 'go'
    },
    navbar: {
      hideOnScroll: true,
      title: 'Polygon Edge',
      logo: {
        alt: 'Polygon Edge Logo',
        src: 'img/logo.svg',
        href: 'docs/overview'
      },
      items: [
        {
          to: 'docs/overview',
          activeBasePath: 'docs/',
          label: 'Develop',
          position: 'left'
        }
      ]
    },
    footer: {
      style: 'dark',
      copyright: `Made with ❤ by the humans at <a href='https://mvpworkshop.co'>MVP Workshop</a>`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
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
