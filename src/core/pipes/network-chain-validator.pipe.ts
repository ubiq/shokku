import { NetworkChainRequestEntity } from '@/core/entities'
import { ArgumentMetadata, HttpException, HttpStatus, Pipe, PipeTransform } from '@nestjs/common'
import { NetworksRepository } from 'networks'

@Pipe()
export class NetworkChainValidatorPipe implements PipeTransform<any> {
  constructor(private readonly repository: NetworksRepository) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value instanceof NetworkChainRequestEntity) {
      if (this.repository.hasNetworkChain(value.network, value.chain)) {
        return value
      }

      throw new HttpException('Invalid network or chain requested', HttpStatus.NOT_FOUND)
    }

    return value
  }
}
