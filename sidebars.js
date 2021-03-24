module.exports = {
  introduction: [
    'home/overview',
    'home/polygon-sdk-architecture'
  ],
  development: [
    'develop/getting-started',
    'develop/cli-commands',
    {
      type: 'category',
      label: 'Modules',
      items: [
        'develop/modules/blockchain',
        'develop/modules/chain',
        'develop/modules/consensus',
        'develop/modules/crypto',
        'develop/modules/json-rpc',
        'develop/modules/minimal',
        'develop/modules/protocol',
        'develop/modules/sealer',
        'develop/modules/state',
        'develop/modules/types'
      ]
    }
  ]
};
