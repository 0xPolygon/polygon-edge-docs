---
id: types 
title: Types
---

## Overview

The **Types** module implements core object types, such as:

* **Address**
* **Hash**
* **Header**
* lots of helper functions

## RLP Encoding / Decoding

Unlike clients such as GETH, the Polygon Edge doesn't use reflection for the encoding.<br />
The preference was to not use reflection because it introduces new problems, such as performance
degradation, and harder scaling.

The **Types** module provides an easy-to-use interface for RLP marshaling and unmarshalling, using the FastRLP package.

Marshaling is done through the *MarshalRLPWith* and *MarshalRLPTo* methods. The analogous methods exist for
unmarshalling.

By manually defining these methods, the Polygon Edge doesn't need to use reflection. In *rlp_marshal.go*, you can find
methods for marshaling:

* **Bodies**
* **Blocks**
* **Headers**
* **Receipts**
* **Logs**
* **Transactions**