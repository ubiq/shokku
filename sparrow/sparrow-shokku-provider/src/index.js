/* global fetch */

import createAsyncMiddleware from 'json-rpc-engine/src/createAsyncMiddleware'
import JsonRpcError from 'json-rpc-error'

function createInfuraMiddleware({
  network = 'mainnet'
}) {
  return createAsyncMiddleware(async (req, res) => {
    const {
      fetchUrl,
      fetchParams
    } = fetchConfigFromReq({
      network,
      req
    })

    const response = await fetch(fetchUrl, fetchParams)
    const rawData = await response.text()

    // handle errors
    if (!response.ok) {
      switch (response.status) {
        case 405: {
          throw new JsonRpcError.MethodNotFound()
        }
        case 418: {
          const msg = 'Request is being rate limited.'
          const error = new Error(msg)
          throw new JsonRpcError.InternalError(error)
        }
        case 503:
        case 504: {
          const msg = 'Gateway timeout. The request took too long to process.'
          const error = new Error(msg)
          throw new JsonRpcError.InternalError(error)
        }
        default: {
          const error = new Error(rawData)
          throw new JsonRpcError.InternalError(error)
        }
      }
    }

    // special case for now
    if (req.method === 'eth_getBlockByNumber' && rawData === 'Not Found') {
      res.result = null
      return
    }

    const data = JSON.parse(rawData)
    res.result = data.result
    res.error = data.error
  })
}

function fetchConfigFromReq({
  network,
  req
}) {
  const {
    method,
    params
  } = req

  const fetchParams = {}
  let fetchUrl = `https://api.shokku.com/v1/jsonrpc/${network}`

  const isPostMethod = ['eth_sendRawTransaction'].includes(req.method)
  if (isPostMethod) {
    fetchParams.method = 'POST'
    fetchParams.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    fetchParams.body = JSON.stringify(req)
  } else {
    fetchParams.method = 'GET'
    const paramsString = encodeURIComponent(JSON.stringify(params))
    fetchUrl += `/${method}?params=${paramsString}`
  }

  return {
    fetchUrl,
    fetchParams
  }
}

export default createInfuraMiddleware
export { fetchConfigFromReq }
