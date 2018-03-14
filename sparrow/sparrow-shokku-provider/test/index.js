import test from 'tape'

import { fetchConfigFromReq } from '../src/index'

test('fetchConfigFromReq - basic', t => {
  const network = 'mainnet'
  const req = {
    method: 'eth_getBlockByNumber',
    params: ['0x482103', true]
  }

  const {
    fetchUrl,
    fetchParams
  } = fetchConfigFromReq({
    network,
    req
  })

  t.equals(fetchUrl, 'https://api.shokku.com/v1/jsonrpc/mainnet/eth_getBlockByNumber?params=%5B%220x482103%22%2Ctrue%5D')
  t.deepEquals(fetchParams, {
    method: 'GET'
  })
  t.end()
})

test('fetchConfigFromReq - basic', t => {
  const network = 'testnet'
  const req = {
    method: 'eth_sendRawTransaction',
    params: ['0x0102030405060708090a0b0c0d0e0f']
  }

  const {
    fetchUrl,
    fetchParams
  } = fetchConfigFromReq({
    network,
    req
  })

  t.equals(fetchUrl, 'https://api.shokku.com/v1/jsonrpc/testnet')
  t.deepEquals(fetchParams, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req)
  })
  t.end()
})
