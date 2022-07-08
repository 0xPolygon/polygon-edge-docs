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
            ]
        },
        {
            type: 'category',
            label: 'Configuration',
            items: [
                'configuration/sample-config',
                'configuration/manage-private-keys',
                'configuration/enable-metrics',
                {
                    type: 'category',
                    label: 'Secret Managers',
                    items: [
                        'configuration/secret-managers/set-up-aws-ssm',
                        'configuration/secret-managers/set-up-gcp-secrets-manager',
                        'configuration/secret-managers/set-up-hashicorp-vault',
                    ]
                }
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
                        'additional-features/chainbridge/definitions',
                        'additional-features/chainbridge/setup',
                        'additional-features/chainbridge/setup-erc20-transfer',
                        'additional-features/chainbridge/setup-erc721-transfer',
                        'additional-features/chainbridge/use-case-erc20-bridge',
                        'additional-features/chainbridge/use-case-erc721-bridge',
                    ]
                },
                'additional-features/stress-testing',
                'additional-features/blockscout',
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
                        'architecture/modules/protocol',
                        'architecture/modules/sealer',
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
        {
            type: 'category',
            label: 'Performance Reports',
            items: [
                'performance-reports/overview',
                {
                    type: 'category',
                    label: 'Test History',
                    items: [
                        'performance-reports/test-history/test-2022-07-04',
                        'performance-reports/test-history/test-2022-03-23',
                        'performance-reports/test-history/test-2022-03-02',
                        'performance-reports/test-history/test-2022-01-21',
                    ]
                }
            ]
        }
    ]
};
