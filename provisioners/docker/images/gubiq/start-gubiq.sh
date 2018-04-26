#!/bin/sh -e

gubiq $GUBIQ_NET --rpc --rpcapi "eth,net,web3" --rpcaddr "0.0.0.0" --rpcport "8588" --rpccorsdomain --ipcdisable --maxpeers 500 --datadir "/usr/share/gubiq/"
