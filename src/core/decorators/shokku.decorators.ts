import _ from 'lodash'
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsRpcMethod() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsRpcMethod',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && _.includes(validRpcMethods, value)
        },
      },
    })
  }
}
