module.exports = {
  develop: [
    'overview',
    'cli-commands',
    {
      type: 'category',
      label: 'How-tos',
      items: [
        'how-tos/howto-set-ibft',
        'how-tos/howto-query-operator',
        'how-tos/howto-query-json-rpc',
        'how-tos/howto-report-bug',
        'how-tos/howto-propose-feature'
      ]
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'reference/architecture',
        {
          type: 'category',
          label: 'Modules',
          items: [
            'reference/modules/blockchain',
            'reference/modules/minimal',
            'reference/modules/networking',
            'reference/modules/state',
            'reference/modules/txpool',
            'reference/modules/json-rpc',
            'reference/modules/consensus',
            'reference/modules/storage',
            'reference/modules/types',
            'reference/modules/other-modules'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/ethereum-state'
      ]
    }
  ]
};
