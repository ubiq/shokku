import { PipeTransform, Pipe, ArgumentMetadata, NotFoundException } from '@nestjs/common'

@Pipe()
export default class TickerValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata
    if (!metatype || !this.isValidMetatype(metatype)) {
      this.invalidTickerException()
    }

    const object = plainToClass(metatype, value)
    const errors = await validate(object, validatorOpts)
    if (errors.length > 0) {
      this.invalidTickerException()
    }

    return value
  }

  private isValidMetatype(metatype): boolean {
    const types = [String]
    return !types.find((type) => metatype === type)
  }

  private invalidTickerException(): never {
    throw new NotFoundException('Invalid ticker requested')
  }
}
