module.exports = {
    develop: [
        'overview',
        {
            type: 'category',
            label: 'Get started',
            items: [
                'get-started/installation',
                'get-started/set-up-ibft-locally',
                'get-started/set-up-ibft-on-the-cloud',
                'get-started/cli-commands',
                'get-started/json-rpc-commands',
                'get-started/performance-reports',
            ]
        },
        {
            type: 'category',
            label: 'Configuration',
            items: [
                'configuration/manage-private-keys',
                'configuration/set-up-hashicorp-vault',
                'configuration/enable-metrics',
            ]
        },
        {
            type: 'category',
            label: 'Working with a node',
            items: [
                'working-with-node/query-json-rpc',
                'working-with-node/query-operator-info',
                'working-with-node/backup-restore',
            ]
        },
        {
            type: 'category',
            label: 'Consensus',
            items: [
                'consensus/poa',
                'consensus/pos-concepts',
                'consensus/pos-stake-unstake',
                'consensus/migration-to-pos'
            ]
        },
        {
            type: 'category',
            label: 'Additional features',
            items: [
                {
                    type: 'category',
                    label: 'Chainbridge',
                    items: [
                        'additional-features/chainbridge/overview',
                        'additional-features/chainbridge/requirements',
                        'additional-features/chainbridge/deploy-contracts',
                        'additional-features/chainbridge/setup-relayer',
                        'additional-features/chainbridge/setup-erc20-transfer',
                        'additional-features/chainbridge/setup-erc721-transfer',
                        'additional-features/chainbridge/roles-in-bridge'
                    ]
                },
                'additional-features/stress-testing',
            ]
        },
        {
            type: 'category',
            label: 'Architecture',
            items: [
                'architecture/overview',
                {
                    type: 'category',
                    label: 'Modules',
                    items: [
                        'architecture/modules/blockchain',
                        'architecture/modules/minimal',
                        'architecture/modules/networking',
                        'architecture/modules/state',
                        'architecture/modules/txpool',
                        'architecture/modules/json-rpc',
                        'architecture/modules/consensus',
                        'architecture/modules/storage',
                        'architecture/modules/types',
                        'architecture/modules/other-modules'
                    ]
                }
            ]
        },
        {
            type: 'category',
            label: 'Concepts',
            items: [
                'concepts/ethereum-state'
            ]
        },
        {
            type: 'category',
            label: 'Community',
            items: [
                'community/propose-new-feature',
                'community/report-bug'
            ]
        },
    ]
};
