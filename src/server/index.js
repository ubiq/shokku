import Express from 'express'
import Router from 'osprey-router'
import * as bodyParser from 'body-parser'
import * as http from 'http'
import * as os from 'os'
import * as path from 'path'
import helmet from 'helmet'
import passport from 'passport'
import _ from 'lodash'
import cors from 'cors'
import subdomain from 'express-subdomain'

import osprey from 'helpers/osprey.extended'
import { jwtOpts } from 'helpers/jwt'
import errorHandler from 'server/middlewares/error.middleware'
import l from 'helpers/logger'

import {
  jsonRpcRoutes,
  subdomainJsonRpcRoutes
} from 'server/routers/jsonrpc'
import tickerRoutes from 'server/routers/ticker'
import blacklistRoutes from 'server/routers/blacklist'
import statusRoutes from 'server/routers/status'
import mainRoutes from 'server/routers/main'

export default class Server {
  constructor(opts = {
    port: process.env.API_PORT || 3000,
    subdomain_mainnet: process.env.API_SUBDOMAIN_MAINNET || 'mainnet.api',
    subdomain_testnet: process.env.API_SUBDOMAIN_TESTNET || 'testnet.api',
    jwt: process.env.API_ENABLE_JWT === 'true' || false
  }) {
    this.opts = opts
    this.app = new Express()
    this.mainRouter = Router()
    this.apiRouter = Router()
    this.subdomainApiRouter = Router()
  }

  async start() {
    l.info('Server - start() / Initializing server...')

    l.info('Server - start() / Initializing passport...')
    this.app.use(passport.initialize())

    if (this.opts.jwt) {
      l.info('Server - start() / Initializing function for JWT')
      _.extend(jwtOpts, {
        verify: (req, payload, done) => {
          l.info('Server - start() / JWTStrategy callback with payload:', payload)
          done(false, {})
        }
      })
    }

    // Load RAML
    const apiRamlFile = path.join(__dirname, 'raml/shokku.raml')
    const subdomainApiRamlFile = path.join(__dirname, 'raml/subdomain-shokku.raml')

    l.info(`Server - start() / Loading RAML API files: ${apiRamlFile} | ${subdomainApiRamlFile}`)
    const osmwErrFn = e => {
      l.error(`Server - start() / Error while using osprey. Error cause: ${e}`)
      l.error('Server - start() / Exiting app! Bye :(')
      process.exit(-1)
    }

    const apiOspreyMw = await osprey(apiRamlFile, {
      jwt: this.opts.jwt
    }).catch(osmwErrFn)
    const subdomainApiOspreyMw = await osprey(subdomainApiRamlFile, {
      jwt: this.opts.jwt
    }).catch(osmwErrFn)

    l.info('Server - start() / Creating default middleware settings for express')
    this.app.use(Express.static('static'))
    this.app.use(helmet())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({
      extended: true
    }))
    this.app.use(errorHandler())

    l.info('Server - start() / Enabling CORS options in app')
    const c = cors()
    this.app.options('*', c)

    l.info('Server - start() / Enabling CORS in api router')
    this.apiRouter.use(c)

    l.info('Server - start() / Registering api routes into api router')
    jsonRpcRoutes(this.apiRouter)
    tickerRoutes(this.apiRouter)
    blacklistRoutes(this.apiRouter)
    statusRoutes(this.apiRouter)

    l.info('Server - start() / Adding osprey middleware to api router')
    this.app.use('/v1', apiOspreyMw, this.apiRouter)

    l.info('Server - start() / Registering routes for main router')
    mainRoutes(this.mainRouter)
    this.app.use('/', this.mainRouter)

    l.info('Server - start() / Enabling CORS in subdomain router')
    this.subdomainApiRouter.use(c)

    l.info('Server - start() / Registering subdomains routes into subdomain router')
    subdomainJsonRpcRoutes(this.subdomainApiRouter, subdomainApiOspreyMw)

    l.info('Server - start() / Creating mainnet and testnet subdomains')
    this.app.use(subdomain(this.opts.subdomain_mainnet, this.subdomainApiRouter))
    this.app.use(subdomain(this.opts.subdomain_testnet, this.subdomainApiRouter))

    const fn = p => l.info(`Server - start() / Server is up and running in ${process.env.NODE_ENV} @: ${os.hostname()} on port: ${p}}`)
    await http.createServer(this.app).listen(this.opts.port, fn(this.opts.port))

    return this.app
  }
}
