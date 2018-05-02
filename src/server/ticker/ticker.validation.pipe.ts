import { PipeTransform, Pipe, ArgumentMetadata, NotFoundException } from '@nestjs/common'

const validatorOpts = {}

@Pipe()
export default class TickerValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    return value
  }

  private invalidTickerException(): never {
    throw new NotFoundException('Invalid ticker requested')
  }
}
