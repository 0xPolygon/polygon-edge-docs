---
id: installation
title: Installation
---

Please refer to the installation method more applicable to you.

Our recommendation is to use the pre-built releases and verify the provided checksums.

## Pre-built releases

Please refer to the [GitHub Releases](https://github.com/0xPolygon/polygon-sdk/releases) page for a list of releases.

Polygon-SDK comes with cross-compiled AMD64/ARM64 binaries for Darwin and Linux.

--- 

## Docker image

Official Docker images are hosted under the [hub.docker.com registry](https://hub.docker.com/r/0xpolygon/polygon-sdk).

`docker pull 0xpolygon/polygon-sdk:latest`

---

## Building from source

Prior to using `go install` make sure that you have Go `>=1.16` installed and properly configured.

The stable branch is `develop`.

```shell
git clone https://github.com/0xPolygon/polygon-sdk.git
cd polygon-sdk/
go build main.go -o polygon-sdk
sudo mv polygon-sdk /usr/local/bin
```

---

## Using `go install`

Prior to using `go install` make sure that you have Go `>=1.16` installed and properly configured.

`go install github.com/0xPolygon/polygon-sdk@latest`

The binary will be available in your `GOBIN` environment variable.