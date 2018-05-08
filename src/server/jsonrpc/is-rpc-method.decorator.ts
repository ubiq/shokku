import { ValidationArguments, registerDecorator } from 'class-validator'
import _ from 'lodash'

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
