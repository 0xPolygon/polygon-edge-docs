module.exports = {
  introduction: ['home/getting-started'],
  reference: [
    'reference/polygon-sdk-architecture',
    'reference/cli-commands',
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
    // 'reference/reference-e2e'
  ],
  guides: [
    'guides/overview',
    // 'guides/exploring-clients',
    'guides/ethereum-state'
    // {
    //   type: 'category',
    //   label: 'Networking basics',
    //   items: [
    //     'guides/networking/networking-libp2p',
    //     'guides/networking/networking-grpc',
    //     'guides/networking/networking-pb',
    //     'guides/networking/networking-gossip',
    //     'guides/networking/networking-discovery'
    //   ]
    // },
    // {
    //   type: 'category',
    //   label: 'Consensus',
    //   items: ['guides/consensus/consensus-ibft']
    // }
  ],
  howTos: [
    'how-tos/howto-set-ibft',
    'how-tos/howto-query-operator',
    'how-tos/howto-query-json-rpc',
    'how-tos/howto-report-bug',
    'how-tos/howto-propose-feature'
  ]
};
