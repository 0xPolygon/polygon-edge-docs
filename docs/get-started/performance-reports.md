# Performance Reports

Our goal is to make a highly-performant, feature-rich and easy to setup and maintain blcokchain client software.

All tests were done using the [Polygon Edge Loadbot](../additional-features/stress-testing.md).

Every performance report you will find on this page is properly dated, environment clearly described and the testing method clearly explained.

## January 21st 2022

### Summary

This test was done after the TxPool refactor which significantly improved performance (released in [v0.2.0](https://github.com/0xPolygon/polygon-edge/releases/v0.2.0)).

The goal was to setup a large network consisting of 30 actively participating validators in order to properly stress test the
consensus and TxPool transaction gossiping as all transactions were sent to a single node's JSON-RPC.

Our aim was not to strive to reach a maximum possible TPS, as the network size negatively impacts the performance,
and since block gas limit & block time are set to sane values that don't consume much system resources, and would allow this to run on commodity hardware.

### Results

| Metric | Value |
| ------ | ----- |
| Transactions per second | 344 |
| Transactions failed | 0 |
| Transactions succeeded | 10000 |
| Total run time | 30s |

### Environment

<details>
  <summary>Host Configuration</summary>
  <div>
    <div>
        <table>
            <tr>
                <td>Cloud provider</td>
                <td>AWS</td>
            </tr>
            <tr>
                <td>Instance size</td>
                <td>t2.xlarge</td>
            </tr>
            <tr>
                <td>Networking</td>
                <td>private subnet</td>
            </tr>
            <tr>
                <td>Operating system</td>
                <td>Linux Ubuntu 20.04 LTS - Focal Fossa</td>
            </tr>
            <tr>
                <td>File descriptor limit</td>
                <td>65535</td>
            </tr>
            <tr>
                <td>Max user processes</td>
                <td>65535</td>
            </tr>
        </table>
    </div>
    <br/>
  </div>
</details>

<details>
  <summary>Blockchain Configuration</summary>
  <div>
    <div>
        <table>
            <tr>
                <td>Polygon Edge version</td>
                <td>Commit <a href="https://github.com/0xPolygon/polygon-edge/commit/8377162281d1a2e4342ae27cd4e5367c4364aee2">8377162281d1a2e4342ae27cd4e5367c4364aee2</a> on develop branch</td>
            </tr>
            <tr>
                <td>Validator nodes</td>
                <td>30</td>
            </tr>
            <tr>
                <td>Non-validator nodes</td>
                <td>0</td>
            </tr>
            <tr>
                <td>Consensus</td>
                <td>IBFT PoA</td>
            </tr>
            <tr>
                <td>Block time</td>
                <td>2000ms</td>
            </tr>
            <tr>
                <td>Block gas limit</td>
                <td>5242880</td>
            </tr>
        </table>
    </div>
    <br/>
  </div>
</details>

<details>
  <summary>Loadbot Configuration</summary>
  <div>
    <div>
        <table>
            <tr>
                <td>Total Transactions</td>
                <td>10000</td>
            </tr>
            <tr>
                <td>Transactions sent per second</td>
                <td>400</td>
            </tr>
            <tr>
                <td>Type of transactions</td>
                <td>EOA to EOA transfers</td>
            </tr>
        </table>
    </div>
    <br/>
  </div>
</details>


## February 18th 2022

### Summary

This test was done to measure the SC ERC20 token transfer functionality with heavy loads and speed of the transactions.

The goal was to check if everything is working as expected during heavy load with ERC20 token transfers. That was also the reason we’ve introduced gas metrics in the loadbot output, which show us if the blocks are filled with transactions properly.

All transactions were sent to the single node via GRPC API, and the receipts were received via JSON-RPC API. After all transactions were done, gas information was read from each block, using the eth_getBlockByNumber JSON-RPC method.

Our aim was not to strive to reach a maximum possible TPS,
since block gas limit & block time are set to sane values that don't consume much system resources, and would allow this to run on commodity hardware.

### Results

| Metric | Value |
| ------ | ----- |
| Transactions per second | 4 |
| Transactions failed | 0 |
| Transactions succeeded | 300 |
| ERC20 transaction run time | 74.143900s |
| SC Deploy time | 4.054110s |

### Environment

<details>
  <summary>Host Configuration</summary>
  <div>
    <div>
        <table>
            <tr>
                <td>Cloud provider</td>
                <td>AWS</td>
            </tr>
            <tr>
                <td>Instance size</td>
                <td>t2.micro</td>
            </tr>
            <tr>
                <td>Networking</td>
                <td>private subnet</td>
            </tr>
            <tr>
                <td>Operating system</td>
                <td>Linux Ubuntu 20.04 LTS - Focal Fossa</td>
            </tr>
            <tr>
                <td>File descriptor limit</td>
                <td>65535</td>
            </tr>
            <tr>
                <td>Max user processes</td>
                <td>65535</td>
            </tr>
        </table>
    </div>
    <br/>
  </div>
</details>

<details>
  <summary>Blockchain Configuration</summary>
  <div>
    <div>
        <table>
            <tr>
                <td>Polygon Edge version</td>
                <td>Commit <a href="https://github.com/0xPolygon/polygon-edge/commit/bd192e4677a2b15e67765c3949c13d1e43d945eb">bd192e4677a2b15e67765c3949c13d1e43d945eb</a> on develop branch</td>
            </tr>
            <tr>
                <td>Validator nodes</td>
                <td>6</td>
            </tr>
            <tr>
                <td>Non-validator nodes</td>
                <td>0</td>
            </tr>
            <tr>
                <td>Consensus</td>
                <td>IBFT PoA</td>
            </tr>
            <tr>
                <td>Block time</td>
                <td>2s</td>
            </tr>
            <tr>
                <td>Block gas limit</td>
                <td>5242880</td>
            </tr>
            <tr>
                <td>Average block utilization</td>
                <td>4%</td>
            </tr>
        </table>
    </div>
    <br/>
  </div>
</details>

<details>
  <summary>Loadbot Configuration</summary>
  <div>
    <div>
        <table>
            <tr>
                <td>Total Transactions</td>
                <td>300</td>
            </tr>
            <tr>
                <td>Transactions sent per second</td>
                <td>100</td>
            </tr>
            <tr>
                <td>Type of transactions</td>
                <td>ERC20 to ERC20 transfers</td>
            </tr>
        </table>
    </div>
    <br/>
  </div>
</details>