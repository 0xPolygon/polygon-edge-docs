---
id: sealer
title: Sealer
---

## Overview

The **Sealer** is an entity that gathers the transactions, and creates a new block.<br />
Then, that block is sent to the **Consensus** module to seal it.

The final sealing logic is located within the **Consensus** module.

## Run Method

````go title="sealer/sealer.go"
func (s *Sealer) run(ctx context.Context) {
	sub := s.blockchain.SubscribeEvents()
	eventCh := sub.GetEventCh()

	for {
		if s.config.DevMode {
			// In dev-mode we wait for new transactions to seal blocks
			select {
			case <-s.wakeCh:
			case <-ctx.Done():
				return
			}
		}

		// start sealing
		subCtx, cancel := context.WithCancel(ctx)
		done := s.sealAsync(subCtx)

		// wait for the sealing to be done
		select {
		case <-done:
			// the sealing process has finished
		case <-ctx.Done():
			// the sealing routine has been canceled
		case <-eventCh:
			// there is a new head, reset sealer
		}

		// cancel the sealing process context
		cancel()

		if ctx.Err() != nil {
			return
		}
	}
}
````

:::caution Work in progress
The **Sealer** and the **Consensus** modules will be combined into a single entity in the near future.

The new module will incorporate modular logic for different kinds of consensus mechanisms, which require different sealing implementations:
* **PoS** (Proof of Stake)
* **PoA** (Proof of Authority)

Currently, the **Sealer** and the **Consensus** modules work with PoW (Proof of Work).
:::