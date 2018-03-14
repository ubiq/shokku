import _ from 'lodash'

import controller from 'server/controllers/jsonrpc'

export function jsonRpcRoutes(router) {
  router
    .get('/jsonrpc/{network}/methods', controller.methods)
    .get('/jsonrpc/{network}/{method}', controller.method)
    .post('/jsonrpc/{network}', controller.method)
}

export function subdomainJsonRpcRoutes(router, middleware) {
  router.use((req, res, next) => {
    _.extend(req.params, {
      network: _.isArray(req.subdomains) && req.subdomains.length > 1 ? req.subdomains[1] : 'mainnet'
    })
    next()
  })
  router.use(middleware)
  router.post('/', controller.method)
}
