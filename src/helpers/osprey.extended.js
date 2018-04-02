import {
  server,
  security
} from 'osprey'
import { loadRAML } from 'raml-1-parser'
import { compose } from 'compose-middleware'
import errorHandler from 'request-error-handler'
import _ from 'lodash'

import jwt from 'helpers/jwt'

const osprey = (path, options = {}) => loadRAML(path, {
  rejectOnErrors: true
}).then(raml => {
  const middlewares = []
  const apiRaml = raml.expand(true).toJSON({
    serializeMetadata: false
  })

  if (options.jwt) {
    const securityMiddleware = security(apiRaml, {
      jwt
    })
    middlewares.push(securityMiddleware)
  }

  const serverOpts = _.extend({ RAMLVersion: raml.RAMLVersion(), notFoundHandler: false }, options.server)
  const serverMiddleware = server(apiRaml, serverOpts)
  middlewares.push(serverMiddleware)

  const errorMiddleware = errorHandler((req, res, errors) => {
    res.json({
      code: res.statusCode,
      message: 'Invalid arguments passed to request',
      extra: errors
    })
  })
  middlewares.push(errorMiddleware)

  const notFoundHandler = (req, res, next) => {
    if (req.resourcePath) {
      return next()
    }

    return res.status(404).json({
      code: 404,
      message: 'Invalid URL requested'
    })
  }
  middlewares.push(notFoundHandler)

  const app = compose(middlewares)
  app.ramlUriParameters = serverMiddleware.ramlUriParameters

  return app
})

export default osprey
