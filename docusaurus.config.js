/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Polygon SDK',
  url: 'https://elegant-nightingale-894b88.netlify.app',
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
          editUrl: 'https://github.com/0xPolygon/polygon-sdk-docs',
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
