import { NetworkChainRequestEntity } from '@/core/entities'
import { HttpExceptionAdapter } from '@/core/exceptions'
import { NetworksRepository } from '@/networks'
import { ArgumentMetadata, Pipe, PipeTransform } from '@nestjs/common'

@Pipe()
export class NetworkChainValidatorPipe implements PipeTransform<any> {
  constructor(private readonly repository: NetworksRepository) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!(value instanceof NetworkChainRequestEntity)) {
      return value
    }

    try {
      this.validate(value)
      return value
    } catch (error) {
      throw HttpExceptionAdapter.toHttpException(error)
    }
  }

  private validate(value: NetworkChainRequestEntity<any>) {
    if (value.ignoreChain) {
      this.repository.getNetworkProvider(value.network)
      return
    }

    this.repository.getNetworkChain(value.network, value.chain)
  }
}
