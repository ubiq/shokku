import { NetworkChainRequestEntity } from '@/core/entities'
import { HttpException, HttpStatus, createRouteParamDecorator } from '@nestjs/common'

const NETWORK_CHAIN_REGEX = /^\/(\w+)\/(\w+)\/?/

export const NetworkChain = createRouteParamDecorator((options, req) => {
  const { path } = req

  if (NETWORK_CHAIN_REGEX.test(path)) {
    const match = path.match(NETWORK_CHAIN_REGEX)
    const network = match[1]
    const chain = match[2]

    return new NetworkChainRequestEntity(network, chain)
  }

  throw new HttpException('Invalid network or chain requested', HttpStatus.NOT_FOUND)
})
