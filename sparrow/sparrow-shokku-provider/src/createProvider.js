import RpcEngine from 'json-rpc-engine'
import providerFromEngine from 'eth-json-rpc-middleware/providerFromEngine'

import createInfuraMiddleware from './index'

export default function createProvider(opts) {
  const engine = new RpcEngine()
  engine.push(createInfuraMiddleware(opts))
  return providerFromEngine(engine)
}
