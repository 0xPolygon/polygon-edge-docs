---
id: overview 
title: Overview
---

Our goal is to make a highly-performant, feature-rich and easy to setup and maintain blockchain client software.
All tests were done using the [Polygon Edge Loadbot](../additional-features/stress-testing.md).
Every performance report you will find in this section is properly dated, environment clearly described and the testing method clearly explained.   

The goal of these performance tests is to show a real world performance of Polygon Edge blockchain network.
Anyone should be able to get the same results as posted here, on the same environment, using our loadbot.    

The first section describes performance tests on the low end hardware resources.
These reports show the performance of the blockchain network on not that powerfull hardware with default chain settings.
The goal here was to show that Polygon Edge blockchain network can run properly on a low spec hardware.

The second section describes performance tests a on more powerfull hardware and with some default chain parameters changed, to provide the best results possible.
Chain configuration was adjusted for most efficient usage of CPU and RAM of the hardware that the chain is running on.

All of the performance tests were conducted on the AWS platform on a chain consisting of EC2 instance nodes.
Quick overview of the performance tests is as following:

## Lower spec hardware

### Environment
| Parameter | Value |
| --------- | ------|
| Instance type | t2.micro |
| CPU count | 1 |
| RAM capacity | 1 GB |
| OS | Linux Ubuntu 20.04 LTS |
| Number of validators | 6 |
| Consensus | IBFT |
| Block time | 2s (default) |
| Block gas limit | 5242880 (default) |

### ERC20 transactions - token transfers
| Metric | Value |
| ------ | ----- |
| Transaction type | ERC20 |
| Transactions per second | 65 |
| Transactions failed | 0 |
| Transactions succeeded | 5000 |
| ERC20 transaction run time | 76.681690s |
| SC Deploy time | 4.048250s |

### ERC721 transactions - token minting
| Metric | Value |
| ------ | ----- |
| Transaction type | ERC721 |
| Transactions per second | 20 |
| Transactions failed | 0 |
| Transactions succeeded | 2000 |
| ERC721 transaction run time | 97.239920s |
| SC Deploy time | 3.048970s |

### EOA to EOA transactions
| Metric | Value |
| ------ | ----- |
| Transactions per second | 344 |
| Transactions failed | 0 |
| Transactions succeeded | 10000 |
| Total run time | 30s |


## Higher spec hardware

### Environment
| Parameter | Value |
| --------- | ------|
| Instance type | c5.2xlarge |
| CPU count | 8 |
| RAM capacity | 16 GB |
| OS | Amazon Linux 2 AMI (HVM) - Kernel 5.10 |
| Number of validators | 4 |
| Consensus | IBFT |
| Block time | 1s |
| Block gas limit | 20 000 000 |
| Max slots | 1 000 000 |

### ERC20 transactions - token transfers
| Metric | Value |
| ------ | ----- |
| Transaction type | ERC20 |
| Transactions per second | 500 |
| Transactions failed | 0 |
| Transactions succeeded | 20000 |
| ERC20 transaction run time | 40.402900s |
| SC Deploy time | 2.004140s |


### ERC721 transactions - token minting
| Metric | Value |
| ------ | ----- |
| Transaction type | ERC721 |
| Transactions per second | 157 |
| Transactions failed | 0 |
| Transactions succeeded | 20000 |
| ERC721 transaction run time | 127.537340s |
| SC Deploy time | 2.004420s |

### EOA to EOA transactions
| Metric | Value |
| ------ | ----- |
| Transactions per second | 689 |
| Transactions failed | 0 |
| Transactions succeeded | 20000 |
| Total run time | 29.921110s |

## Caveats
There are some caveats in regard to the chain configuration and available hardware resources.
Depending on the transaction type, block gas limit can be increased to a very high value. This allows for more transactions to be added into the block.

But, if block gas limit is set on a very high value and the transaction type is such that uses relatively low ammount of gas like EOA to EOA or ERC20 token transfers, there is a possibly that all of the available RAM on the system will be used, and that will eventualy cause system instability.

Example:   
### Environment
| Parameter | Value |
| --------- | ------|
| Instance type | c5.2xlarge |
| CPU count | 8 |
| RAM capacity | 16 GB |
| OS | Amazon Linux 2 AMI (HVM) - Kernel 5.10 |
| Number of validators | 4 |
| Consensus | IBFT |
| Block time | 1s |
| Block gas limit | 80 000 000 |
| Max slots | 1 000 000 |

### ERC721 transactions - token minting
| Metric | Value |
| ------ | ----- |
| Transaction type | ERC721 |
| Transactions per second | 487 |
| Transactions failed | 0 |
| Transactions succeeded | 20000 |
| ERC721 transaction run time | 41.098410s |
| SC Deploy time | 2.004300s |

### ERC20 transactions - token transfers
Server crashed as the system ran out of memory. Error:
```
Mar 23 00:19:06 ip-10-151-2-196 kernel: oom-kill:constraint=CONSTRAINT_NONE,nodemask=(null),cpuset=/,mems_allowed=0,global_oom,task_memcg=/,task=polygon-edge,pid=4560,uid=1000Mar 23 00:19:06 ip-10-151-2-196 kernel: Out of memory: Killed process 4560 (polygon-edge) total-vm:16687652kB, anon-rss:14964372kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:29668kB oom_score_adj:0Mar 23 00:19:06 ip-10-151-2-196 kernel: oom_reaper: reaped process 4560 (polygon-edge), now anon-rss:0kB, file-rss:0kB, shmem-rss:0kB
```