(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{101:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return h}));var r=n(0),a=n.n(r);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),u=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=u(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,o=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=u(n),m=r,h=p["".concat(o,".").concat(m)]||p[m]||b[m]||s;return n?a.a.createElement(h,i(i({ref:t},l),{},{components:n})):a.a.createElement(h,i({ref:t},l))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,o=new Array(s);o[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var l=2;l<s;l++)o[l]=n[l];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},80:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return u}));var r=n(3),a=n(7),s=(n(0),n(101)),o={id:"state",title:"State"},i={unversionedId:"reference/modules/state",id:"reference/modules/state",isDocsHomePage:!1,title:"State",description:"To truly understand how State works, you must understand some basic Ethereum concepts.",source:"@site/docs/reference/modules/state.md",slug:"/reference/modules/state",permalink:"/docs/reference/modules/state",editUrl:"https://github.com/0xPolygon/polygon-sdk-docs/docs/reference/modules/state.md",version:"current",sidebar:"develop",previous:{title:"Networking",permalink:"/docs/reference/modules/networking"},next:{title:"TxPool",permalink:"/docs/reference/modules/txpool"}},c=[{value:"Overview",id:"overview",children:[]},{value:"Executor",id:"executor",children:[]},{value:"Runtime",id:"runtime",children:[]}],l={toc:c};function u(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(s.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(s.b)("p",null,"To truly understand how ",Object(s.b)("strong",{parentName:"p"},"State")," works, you must understand some basic Ethereum concepts.",Object(s.b)("br",null)),Object(s.b)("p",null,"We highly recommend reading the ",Object(s.b)("strong",{parentName:"p"},Object(s.b)("a",{parentName:"strong",href:"/docs/guides/ethereum-state"},"State in Ethereum guide")),"."),Object(s.b)("h2",{id:"overview"},"Overview"),Object(s.b)("p",null,"Now that we've familiarized ourselves with basic Ethereum concepts, the next overview should be easy."),Object(s.b)("p",null,"We mentioned that the ",Object(s.b)("strong",{parentName:"p"},"World state trie")," has all the Ethereum accounts that exist. ",Object(s.b)("br",null),"\nThese accounts are the leaves of the Merkle trie. Each leaf has encoded ",Object(s.b)("strong",{parentName:"p"},"Account State")," information."),Object(s.b)("p",null,"This enables the Polygon SDK to get a specific Merkle trie, for a specific point in time. ",Object(s.b)("br",null),"\nFor example, we can get the hash of the state at block 10."),Object(s.b)("p",null,"The Merkle trie, at any point in time, is called a ",Object(s.b)("strong",{parentName:"p"},Object(s.b)("em",{parentName:"strong"},"Snapshot")),"."),Object(s.b)("p",null,"We can have ",Object(s.b)("strong",{parentName:"p"},Object(s.b)("em",{parentName:"strong"},"Snapshots"))," for the ",Object(s.b)("strong",{parentName:"p"},"state trie"),", or for the ",Object(s.b)("strong",{parentName:"p"},"storage trie")," - they are basically the same. ",Object(s.b)("br",null),"\nThe only difference is in what the leaves represent:"),Object(s.b)("ul",null,Object(s.b)("li",{parentName:"ul"},"In the case of the storage trie, the leaves contain arbitrary state, which we cannot process or know what's in there"),Object(s.b)("li",{parentName:"ul"},"In the case of the state trie, the leaves represent accounts")),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-go",metastring:'title="state/state.go',title:'"state/state.go'},"type State interface {\n    // Gets a snapshot for a specific hash\n    NewSnapshotAt(types.Hash) (Snapshot, error)\n    \n    // Gets the latest snapshot\n    NewSnapshot() Snapshot\n    \n    // Gets the codeHash\n    GetCode(hash types.Hash) ([]byte, bool)\n}\n")),Object(s.b)("p",null,"The ",Object(s.b)("strong",{parentName:"p"},"Snapshot")," interface is defined as such:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-go",metastring:'title="state/state.go',title:'"state/state.go'},"type Snapshot interface {\n    // Gets a specific value for a leaf\n    Get(k []byte) ([]byte, bool)\n    \n    // Commits new information\n    Commit(objs []*Object) (Snapshot, []byte)\n}\n")),Object(s.b)("p",null,"The information that can be committed is defined by the ",Object(s.b)("em",{parentName:"p"},"Object struct"),":"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-go",metastring:'title="state/state.go',title:'"state/state.go'},"// Object is the serialization of the radix object\ntype Object struct {\n    Address  types.Address\n    CodeHash types.Hash\n    Balance  *big.Int\n    Root     types.Hash\n    Nonce    uint64\n    Deleted  bool\n\n    DirtyCode bool\n    Code      []byte\n\n    Storage []*StorageObject\n}\n")),Object(s.b)("p",null,"The implementation for the Merkle trie is in the ",Object(s.b)("em",{parentName:"p"},"state/immutable-trie")," folder. ",Object(s.b)("br",null),"\n",Object(s.b)("em",{parentName:"p"},"state/immutable-trie/state.go")," implements the ",Object(s.b)("strong",{parentName:"p"},"State")," interface."),Object(s.b)("p",null,Object(s.b)("em",{parentName:"p"},"state/immutable-trie/trie.go")," is the main Merkle trie object. It represents an optimized version of the Merkle trie,\nwhich reuses as much memory as possible."),Object(s.b)("h2",{id:"executor"},"Executor"),Object(s.b)("p",null,Object(s.b)("em",{parentName:"p"},"state/executor.go")," includes all the information needed for the Polygon SDK to decide how a block changes the current\nstate. The implementation of ",Object(s.b)("em",{parentName:"p"},"ProcessBlock")," is located here."),Object(s.b)("p",null,"The ",Object(s.b)("em",{parentName:"p"},"apply")," method does the actual state transition. The executor calls the EVM."),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-go",metastring:'title="state/executor.go"',title:'"state/executor.go"'},"func (t *Transition) apply(msg *types.Transaction) ([]byte, uint64, bool, error) {\n    // check if there is enough gas in the pool\n    if err := t.subGasPool(msg.Gas); err != nil {\n        return nil, 0, false, err\n    }\n\n    txn := t.state\n    s := txn.Snapshot()\n\n    gas, err := t.preCheck(msg)\n    if err != nil {\n        return nil, 0, false, err\n    }\n    if gas > msg.Gas {\n        return nil, 0, false, errorVMOutOfGas\n    }\n\n    gasPrice := new(big.Int).SetBytes(msg.GetGasPrice())\n    value := new(big.Int).SetBytes(msg.Value)\n\n    // Set the specific transaction fields in the context\n    t.ctx.GasPrice = types.BytesToHash(msg.GetGasPrice())\n    t.ctx.Origin = msg.From\n\n    var subErr error\n    var gasLeft uint64\n    var returnValue []byte\n\n    if msg.IsContractCreation() {\n        _, gasLeft, subErr = t.Create2(msg.From, msg.Input, value, gas)\n    } else {\n        txn.IncrNonce(msg.From)\n        returnValue, gasLeft, subErr = t.Call2(msg.From, *msg.To, msg.Input, value, gas)\n    }\n    \n    if subErr != nil {\n        if subErr == runtime.ErrNotEnoughFunds {\n            txn.RevertToSnapshot(s)\n            return nil, 0, false, subErr\n        }\n    }\n\n    gasUsed := msg.Gas - gasLeft\n    refund := gasUsed / 2\n    if refund > txn.GetRefund() {\n        refund = txn.GetRefund()\n    }\n\n    gasLeft += refund\n    gasUsed -= refund\n\n    // refund the sender\n    remaining := new(big.Int).Mul(new(big.Int).SetUint64(gasLeft), gasPrice)\n    txn.AddBalance(msg.From, remaining)\n\n    // pay the coinbase\n    coinbaseFee := new(big.Int).Mul(new(big.Int).SetUint64(gasUsed), gasPrice)\n    txn.AddBalance(t.ctx.Coinbase, coinbaseFee)\n\n    // return gas to the pool\n    t.addGasPool(gasLeft)\n\n    return returnValue, gasUsed, subErr != nil, nil\n}\n")),Object(s.b)("h2",{id:"runtime"},"Runtime"),Object(s.b)("p",null,"When a state transition is executed, the main module that executes the state transition is the EVM (located in\nstate/runtime/evm)."),Object(s.b)("p",null,"The ",Object(s.b)("strong",{parentName:"p"},"dispatch table")," does a match between the ",Object(s.b)("strong",{parentName:"p"},"opcode")," and the instruction."),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-go",metastring:'title="state/runtime/evm/dispatch_table.go"',title:'"state/runtime/evm/dispatch_table.go"'},"func init() {\n    // unsigned arithmetic operations\n    register(STOP, handler{opStop, 0, 0})\n    register(ADD, handler{opAdd, 2, 3})\n    register(SUB, handler{opSub, 2, 3})\n    register(MUL, handler{opMul, 2, 5})\n    register(DIV, handler{opDiv, 2, 5})\n    register(SDIV, handler{opSDiv, 2, 5})\n    register(MOD, handler{opMod, 2, 5})\n    register(SMOD, handler{opSMod, 2, 5})\n    register(EXP, handler{opExp, 2, 10})\n\n    ...\n\n    // jumps\n    register(JUMP, handler{opJump, 1, 8})\n    register(JUMPI, handler{opJumpi, 2, 10})\n    register(JUMPDEST, handler{opJumpDest, 0, 1})\n}\n")),Object(s.b)("p",null,"The core logic that powers the EVM is the ",Object(s.b)("em",{parentName:"p"},"Run")," loop. ",Object(s.b)("br",null)),Object(s.b)("p",null,"This is the main entry point for the EVM. It does a loop and checks the current opcode, fetches the instruction, checks\nif it can be executed, consumes gas and executes the instruction until it either fails or stops."),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-go",metastring:'title="state/runtime/evm/state.go"',title:'"state/runtime/evm/state.go"'},"\n// Run executes the virtual machine\nfunc (c *state) Run() ([]byte, error) {\n    var vmerr error\n\n    codeSize := len(c.code)\n    \n    for !c.stop {\n        if c.ip >= codeSize {\n            c.halt()\n            break\n        }\n\n        op := OpCode(c.code[c.ip])\n\n        inst := dispatchTable[op]\n        \n        if inst.inst == nil {\n            c.exit(errOpCodeNotFound)\n            break\n        }\n        \n        // check if the depth of the stack is enough for the instruction\n        if c.sp < inst.stack {\n            c.exit(errStackUnderflow)\n            break\n        }\n        \n        // consume the gas of the instruction\n        if !c.consumeGas(inst.gas) {\n            c.exit(errOutOfGas)\n            break\n        }\n\n        // execute the instruction\n        inst.inst(c)\n\n        // check if stack size exceeds the max size\n        if c.sp > stackSize {\n            c.exit(errStackOverflow)\n            break\n        }\n        \n        c.ip++\n    }\n\n    if err := c.err; err != nil {\n        vmerr = err\n    }\n    \n    return c.ret, vmerr\n}\n")))}u.isMDXComponent=!0}}]);