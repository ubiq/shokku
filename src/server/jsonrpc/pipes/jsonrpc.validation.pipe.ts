import { PipeTransform, Pipe, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

const validatorOpts = {
  skipMissingProperties: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
}

@Pipe()
export default class JsonRpcValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata
    if (!metatype || !this.isValidMetatype(metatype)) {
      this.throwInvalidParamsException()
    }

    const object = plainToClass(metatype, value)
    const errors = await validate(object, validatorOpts)
    if (errors.length > 0) {
      this.throwInvalidParamsException()
    }

    return value
  }

  private isValidMetatype(metatype): boolean {
    const types = [Array, Object]
    return !types.find((type) => metatype === type)
  }

  private throwInvalidParamsException(): never {
    throw new BadRequestException('Invalid params passed!')
  }
}
