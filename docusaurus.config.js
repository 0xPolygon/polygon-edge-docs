require('dotenv').config()

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'Polygon Edge',
    url: 'https://edge-docs.polygon.technology',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon-32x32.png',
    organizationName: '0xPolygon',
    projectName: 'polygon-edge-docs',
    themes: ['docusaurus-theme-search-typesense'],
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
                    label: 'Docs',
                    position: 'left'
                },
                {
                    href: 'https://github.com/0xPolygon/polygon-edge',
                    position: 'right',
                    className: 'header-github-link',
                    'aria-label': 'GitHub repository',
                },
            ]
        },
        footer: {
            style: 'dark',
            copyright: `Made with ❤ by the humans at <a href='https://trapesys.io'>Trapesys</a>`
        },
        typesense: {
            typesenseCollectionName: 'sdk-docs.polygon.technology', // Replace with your own doc site's name. Should match the collection name in the scraper settings.
            typesenseServerConfig: {
                nodes: [
                    {
                        host: 'fvtlbamhupdcon8rp-1.a1.typesense.net',
                        port: 443,
                        protocol: 'https',
                    },
                ],
                apiKey: process.env.TYPESENSE_API_KEY,
            },
        },
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
