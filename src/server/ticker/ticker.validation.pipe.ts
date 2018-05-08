import { ArgumentMetadata, NotFoundException, Pipe, PipeTransform } from '@nestjs/common'
import { HttpTickerInvalidExchangeSymbolException } from '@/core/exceptions'

const validatorOpts = {}

@Pipe()
export default class TickerValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    return value
  }

  private invalidTickerException(): never {
    throw HttpTickerInvalidExchangeSymbolException
  }
}
