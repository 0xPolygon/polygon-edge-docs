---
id: consensus
title: Consensus
---

## Overview

The **Consensus** module provides an interface for consensus mechanisms.

Currently, the following consensus engines are available:
* **IBFT PoA**
* **IBFT PoS**

The Polygon Edge wants to maintain a state of modularity and pluggability. <br />
This is why the core consensus logic has been abstracted away, so new consensus mechanisms can be built on top, without
compromising on usability and ease of use.

## Consensus Interface

````go title="consensus/consensus.go"
// Consensus is the interface for consensus
type Consensus interface {
	// VerifyHeader verifies the header is correct
	VerifyHeader(parent, header *types.Header) error

	// Start starts the consensus
	Start() error

	// Close closes the connection
	Close() error
}
````

The ***Consensus*** interface is the core of the mentioned abstraction. <br />
* The **VerifyHeader** method represents a helper function which the consensus layer exposes to the **blockchain** layer
It is there to handle header verification
* The **Start** method simply starts the consensus process, and everything associated with it. This includes synchronization, 
sealing, everything that needs to be done
* The **Close** method closes the consensus connection

## Consensus Configuration

````go title="consensus/consensus.go"
// Config is the configuration for the consensus
type Config struct {
	// Logger to be used by the backend
	Logger *log.Logger

	// Params are the params of the chain and the consensus
	Params *chain.Params

	// Specific configuration parameters for the backend
	Config map[string]interface{}

	// Path for the consensus protocol to store information
	Path string
}
````

There may be times when you might want to pass in a custom location for the consensus protocol to store data, or perhaps 
a custom key-value map that you want the consensus mechanism to use. This can be achieved through the ***Config*** struct, 
which gets read when a new consensus instance is created.

## IBFT

### ExtraData

The blockchain header object, among other fields, has a field called **ExtraData**. <br />
To review the fields present in the block header, please check out the **[State in Ethereum](/docs/concepts/ethereum-state#blocks)** section.

IBFT uses this extra field to store operational information regarding the block, answering questions like:
* "Who signed this block?"
* "Who are the validators for this block?"

These extra fields for IBFT are defined as follows:
````go title="consensus/ibft/extra.go"
type IstanbulExtra struct {
	Validators    []types.Address
	Seal          []byte
	CommittedSeal [][]byte
}
````

### Signing Data

In order for the node to sign information in IBFT, it leverages the *signHash* method:
````go title="consensus/ibft/sign.go"
func signHash(h *types.Header) ([]byte, error) {
	//hash := istambulHeaderHash(h)
	//return hash.Bytes(), nil

	h = h.Copy() // make a copy since we update the extra field

	arena := fastrlp.DefaultArenaPool.Get()
	defer fastrlp.DefaultArenaPool.Put(arena)

	// when hashign the block for signing we have to remove from
	// the extra field the seal and commitedseal items
	extra, err := getIbftExtra(h)
	if err != nil {
		return nil, err
	}
	putIbftExtraValidators(h, extra.Validators)

	vv := arena.NewArray()
	vv.Set(arena.NewBytes(h.ParentHash.Bytes()))
	vv.Set(arena.NewBytes(h.Sha3Uncles.Bytes()))
	vv.Set(arena.NewBytes(h.Miner.Bytes()))
	vv.Set(arena.NewBytes(h.StateRoot.Bytes()))
	vv.Set(arena.NewBytes(h.TxRoot.Bytes()))
	vv.Set(arena.NewBytes(h.ReceiptsRoot.Bytes()))
	vv.Set(arena.NewBytes(h.LogsBloom[:]))
	vv.Set(arena.NewUint(h.Difficulty))
	vv.Set(arena.NewUint(h.Number))
	vv.Set(arena.NewUint(h.GasLimit))
	vv.Set(arena.NewUint(h.GasUsed))
	vv.Set(arena.NewUint(h.Timestamp))
	vv.Set(arena.NewCopyBytes(h.ExtraData))

	buf := keccak.Keccak256Rlp(nil, vv)
	return buf, nil
}
````
Another notable method is the *VerifyCommittedFields* method, which verifies that the committed seals are from valid validators:
````go title="consensus/ibft/sign.go
func verifyCommitedFields(snap *Snapshot, header *types.Header) error {
	extra, err := getIbftExtra(header)
	if err != nil {
		return err
	}
	if len(extra.CommittedSeal) == 0 {
		return fmt.Errorf("empty committed seals")
	}

	// get the message that needs to be signed
	signMsg, err := signHash(header)
	if err != nil {
		return err
	}
	signMsg = commitMsg(signMsg)

	visited := map[types.Address]struct{}{}
	for _, seal := range extra.CommittedSeal {
		addr, err := ecrecoverImpl(seal, signMsg)
		if err != nil {
			return err
		}

		if _, ok := visited[addr]; ok {
			return fmt.Errorf("repeated seal")
		} else {
			if !snap.Set.Includes(addr) {
				return fmt.Errorf("signed by non validator")
			}
			visited[addr] = struct{}{}
		}
	}

	validSeals := len(visited)
	if validSeals <= 2*snap.Set.MinFaultyNodes() {
		return fmt.Errorf("not enough seals to seal block")
	}
	return nil
}
````

### Snapshots

Snapshots, as the name implies, are there to provide a *snapshot*, or the *state* of a system at any block height (number).

Snapshots contain a set of nodes who are validators, as well as voting information (validators can vote for other validators).
Validators include voting information in the **Miner** header filed, and change the value of the **nonce**:
* Nonce is **all 1s** if the node wants to remove a validator
* Nonce is **all 0s** if the node wants to add a validator

Snapshots are calculated using the ***processHeaders*** method:

````go title="consensus/ibft/snapshot.go"
func (i *Ibft) processHeaders(headers []*types.Header) error {
	if len(headers) == 0 {
		return nil
	}

	parentSnap, err := i.getSnapshot(headers[0].Number - 1)
	if err != nil {
		return err
	}
	snap := parentSnap.Copy()

	saveSnap := func(h *types.Header) error {
		if snap.Equal(parentSnap) {
			return nil
		}

		snap.Number = h.Number
		snap.Hash = h.Hash.String()

		i.store.add(snap)

		parentSnap = snap
		snap = parentSnap.Copy()
		return nil
	}

	for _, h := range headers {
		number := h.Number

		validator, err := ecrecoverFromHeader(h)
		if err != nil {
			return err
		}
		if !snap.Set.Includes(validator) {
			return fmt.Errorf("unauthroized validator")
		}

		if number%i.epochSize == 0 {
			// during a checkpoint block, we reset the voles
			// and there cannot be any proposals
			snap.Votes = nil
			if err := saveSnap(h); err != nil {
				return err
			}

			// remove in-memory snaphots from two epochs before this one
			epoch := int(number/i.epochSize) - 2
			if epoch > 0 {
				purgeBlock := uint64(epoch) * i.epochSize
				i.store.deleteLower(purgeBlock)
			}
			continue
		}

		// if we have a miner address, this might be a vote
		if h.Miner == types.ZeroAddress {
			continue
		}

		// the nonce selects the action
		var authorize bool
		if h.Nonce == nonceAuthVote {
			authorize = true
		} else if h.Nonce == nonceDropVote {
			authorize = false
		} else {
			return fmt.Errorf("incorrect vote nonce")
		}

		// validate the vote
		if authorize {
			// we can only authorize if they are not on the validators list
			if snap.Set.Includes(h.Miner) {
				continue
			}
		} else {
			// we can only remove if they are part of the validators list
			if !snap.Set.Includes(h.Miner) {
				continue
			}
		}

		count := snap.Count(func(v *Vote) bool {
			return v.Validator == validator && v.Address == h.Miner
		})
		if count > 1 {
			// there can only be one vote per validator per address
			return fmt.Errorf("more than one proposal per validator per address found")
		}
		if count == 0 {
			// cast the new vote since there is no one yet
			snap.Votes = append(snap.Votes, &Vote{
				Validator: validator,
				Address:   h.Miner,
				Authorize: authorize,
			})
		}

		// check the tally for the proposed validator
		tally := snap.Count(func(v *Vote) bool {
			return v.Address == h.Miner
		})

		if tally > snap.Set.Len()/2 {
			if authorize {
				// add the proposal to the validator list
				snap.Set.Add(h.Miner)
			} else {
				// remove the proposal from the validators list
				snap.Set.Del(h.Miner)

				// remove any votes casted by the removed validator
				snap.RemoveVotes(func(v *Vote) bool {
					return v.Validator == h.Miner
				})
			}

			// remove all the votes that promoted this validator
			snap.RemoveVotes(func(v *Vote) bool {
				return v.Address == h.Miner
			})
		}

		if err := saveSnap(h); err != nil {
			return nil
		}
	}

	// update the metadata
	i.store.updateLastBlock(headers[len(headers)-1].Number)
	return nil
}
````

This method is usually called with 1 header, but the flow is the same even with multiple headers. <br />
For each passed-in header, IBFT needs to verify that the proposer of the header is the validator. This can be done easily by 
grabbing the latest snapshot, and checking if the node is in the validator set.

Next, the nonce is checked. The vote is included, and tallied - and if there are enough votes a node is added/removed from 
the validator set, following which the new snapshot is saved.

#### Snapshot Store

The snapshot service manages and updates an entity called the **snapshotStore**, which stores the list of all available snapshots.
Using it, the service is able to quickly figure out which snapshot is associated with which block height.
````go title="consensus/ibft/snapshot.go"
type snapshotStore struct {
	lastNumber uint64
	lock       sync.Mutex
	list       snapshotSortedList
}
````

### IBFT Startup

To start up IBFT, the Polygon Edge firstly needs to set up the IBFT transport:
````go title="consensus/ibft/ibft.go"
func (i *Ibft) setupTransport() error {
	// use a gossip protocol
	topic, err := i.network.NewTopic(ibftProto, &proto.MessageReq{})
	if err != nil {
		return err
	}

	err = topic.Subscribe(func(obj interface{}) {
		msg := obj.(*proto.MessageReq)

		if !i.isSealing() {
			// if we are not sealing we do not care about the messages
			// but we need to subscribe to propagate the messages
			return
		}

		// decode sender
		if err := validateMsg(msg); err != nil {
			i.logger.Error("failed to validate msg", "err", err)
			return
		}

		if msg.From == i.validatorKeyAddr.String() {
			// we are the sender, skip this message since we already
			// relay our own messages internally.
			return
		}
		i.pushMessage(msg)
	})
	if err != nil {
		return err
	}

	i.transport = &gossipTransport{topic: topic}
	return nil
}
````

It essentially creates a new topic with IBFT proto, with a new proto buff message.<br />
The messages are meant to be used by validators. The Polygon Edge then subscribes to the topic and handles messages accordingly.

#### MessageReq

The message exchanged by validators:
````go title="consensus/ibft/proto/ibft.proto"
message MessageReq {
    // type is the type of the message
    Type type = 1;

    // from is the address of the sender
    string from = 2;

    // seal is the committed seal if message is commit
    string seal = 3;

    // signature is the crypto signature of the message
    string signature = 4;

    // view is the view assigned to the message
    View view = 5;

    // hash of the locked block
    string digest = 6;

    // proposal is the rlp encoded block in preprepare messages
    google.protobuf.Any proposal = 7;

    enum Type {
        Preprepare = 0;
        Prepare = 1;
        Commit = 2;
        RoundChange = 3;
    }
}

message View {
    uint64 round = 1;
    uint64 sequence = 2;
}
````

The **View** field in the **MessageReq** represents the current node position inside the chain. 
It has a *round*, and a *sequence* attribute.
* **round** represents the proposer round for the height
* **sequence** represents the height of the blockchain

The *msgQueue* filed in the IBFT implementation has the purpose of storing message requests. It orders messages by 
the *View* (firstly by sequence, then by round). The IBFT implementation also possesses different queues for different states in the system.

### IBFT States

After the consensus mechanism is started using the **Start** method, it runs into an infinite loop which simulates a state machine:
````go title="consensus/ibft/ibft.go"
func (i *Ibft) start() {
	// consensus always starts in SyncState mode in case it needs
	// to sync with other nodes.
	i.setState(SyncState)

	header := i.blockchain.Header()
	i.logger.Debug("current sequence", "sequence", header.Number+1)

	for {
		select {
		case <-i.closeCh:
			return
		default:
		}

		i.runCycle()
	}
}

func (i *Ibft) runCycle() {
	if i.state.view != nil {
		i.logger.Debug(
		    "cycle", 
		    "state", 
		    i.getState(), 
		    "sequence", 
		    i.state.view.Sequence, 
		    "round", 
		    i.state.view.Round,
	    )
	}

	switch i.getState() {
	case AcceptState:
		i.runAcceptState()

	case ValidateState:
		i.runValidateState()

	case RoundChangeState:
		i.runRoundChangeState()

	case SyncState:
		i.runSyncState()
	}
}
````

#### SyncState

All nodes initially start in the **Sync** state.

This is because fresh data needs to be fetched from the blockchain. The client needs to find out if it's the validator, 
find the current snapshot. This state resolves any pending blocks.

After the sync finishes, and the client determines it is indeed a validator, it needs to transfer to **AcceptState**.
If the client is **not** a validator, it will continue syncing, and stay in **SyncState**

#### AcceptState

The **Accept** state always check the snapshot and the validator set. If the current node is not in the validators set,
it moves back to the **Sync** state.

On the other hand, if the node **is** a validator, it calculates the proposer. If it turns out that the current node is the 
proposer, it builds a block, and sends preprepare and then prepare messages.

* Preprepare messages - messages sent by proposers to validators, to let them know about the proposal
* Prepare messages - messages where validators agree on a proposal. All nodes receive all prepare messages
* Commit messages - messages containing commit information for the proposal

If the current node **is not** a validator, it uses the *getNextMessage* method to read a message from the previously shown queue. <br />
It waits for the preprepare messages. Once it is confirmed everything is correct, the node moves to the **Validate** state.

#### ValidateState

The **Validate** state is rather simple - all nodes do in this state is read messages and add them to their local snapshot state. 