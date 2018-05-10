import { NetworkChainRequestEntity } from '@/core/entities'
import { HttpNetworkChainNotFoundException } from '@/core/exceptions'
import { createRouteParamDecorator } from '@nestjs/common'

const NETWORK_CHAIN_REGEX = /^\/(\w+)\/(\w+)\/?/

interface NetworkChainOptions {
  ignoreChain: boolean
}

export const NetworkChain = createRouteParamDecorator((options?: NetworkChainOptions, req?) => {
  const { path } = req

  if (NETWORK_CHAIN_REGEX.test(path)) {
    const match = path.match(NETWORK_CHAIN_REGEX)
    const network = match[1]
    const chain = options && options.ignoreChain ? '' : match[2]

    return new NetworkChainRequestEntity(req, network, chain, chain === '')
  }

  throw HttpNetworkChainNotFoundException
})
