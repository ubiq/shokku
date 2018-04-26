import { createRouteParamDecorator } from '@nestjs/common'
import { ValidationArguments, registerDecorator } from 'class-validator'
import _ from 'lodash'
import { NetworkChainRequestEntity } from '../entities/network.chain.request.entity';

export function IsRpcMethod() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsRpcMethod',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && _.includes([], value)
        },
      },
    })
  }
}

export const NetworkChain = createRouteParamDecorator((options, req) => {
  return new NetworkChainRequestEntity('ubiq', 'mainnet')
})
