import _ from 'lodash'
import errors from 'common-errors'

import JsonRpcService from 'server/services/jsonrpc'
import l from 'helpers/logger'

export class Controller {
  async networks(req, res) {
    l.info('JsonRpcController - networks() / Obtaining list of available networks')
    const result = await JsonRpcService.networks()
    return res.json(result)
  }

  async methods(req, res) {
    l.info('JsonRpcController - networks() / Obtaining list of available RPC methods')
    const result = await JsonRpcService.methods()
    return res.json(result)
  }

  async method(req, res) {
    l.info('JsonRpcController - networks() / Handling concrete RPC')

    const method = req.method
    const opts = {
      network: req.params && req.params.network === 'mainnet' ? 'mn' : 'tn',
      method: method === 'GET' ? req.params.method : req.body.method,
      params: method === 'GET' ? (req.query.params || []) : (req.body.params || []),
      id: method === 'POST' ? req.body.id : undefined
    }

    try {
      l.info('JsonRpcController - method() / Calling rpc controller')
      const result = await JsonRpcService.method(opts)
      return res.json(result)
    } catch (err) {
      l.error(`JsonRpcController - method() / ${err}`)
      const error = { message: err.message }
      if (err instanceof errors.ArgumentError) {
        _.extend(error, { code: 400 })
      } else if (err instanceof errors.NotPermittedError) {
        _.extend(error, { code: 404 })
      } else {
        // Something bad happened with gubiq
        _.extend(error, { code: 502 })
      }

      return res.error(error)
    }
  }
}

export default new Controller()
