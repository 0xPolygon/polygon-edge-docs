module.exports = {
  develop: [
    'overview',
    'cli-commands',
    {
      type: 'category',
      label: 'How-tos',
      items: [
        {
          type: 'category',
          label: 'How to setup IBFT',
          items: [
            'how-tos/howto-setup-ibft/howto-set-ibft-locally',
            'how-tos/howto-setup-ibft/howto-set-ibft-on-the-cloud'
          ]
        },
        'how-tos/howto-query-operator',
        'how-tos/howto-query-json-rpc',
        'how-tos/howto-setup-hashicorp-vault',
        'how-tos/howto-backup-restore',
        'how-tos/howto-manage-private-keys',
        'how-tos/howto-report-bug',
        'how-tos/howto-propose-feature',
        'how-tos/howto-run-loadbot',
        'how-tos/howto-enable-metrics',
        {
          type: 'category',
          label: 'How to bridge assets between networks',
          items: [
            'how-tos/howto-bridge-assets/overview',
            'how-tos/howto-bridge-assets/requirements',
            'how-tos/howto-bridge-assets/deploy-contracts',
            'how-tos/howto-bridge-assets/setup-relayer',
            'how-tos/howto-bridge-assets/setup-erc20-transfer',
            'how-tos/howto-bridge-assets/setup-erc721-transfer',
            'how-tos/howto-bridge-assets/roles-in-bridge'
          ]
        }
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
      items: ['guides/ethereum-state']
    }
  ]
};
