import { ArgumentMetadata, Pipe, PipeTransform } from '@nestjs/common'
import { NetworkChainRequestEntity } from '@/core/entities/network.chain.request.entity'

export class NetworkChainPipeOptions {
  readonly ignoreNetworkCheck?: boolean = false
  readonly ignoreChainCheck?: boolean = false
  readonly toPayload?: Function
}

@Pipe()
export class NetworkChainValidatorPipe implements PipeTransform<NetworkChainRequestEntity<any>> {
  constructor(private readonly options?: NetworkChainPipeOptions) { }

  transform(value: NetworkChainRequestEntity<any>, metadata: ArgumentMetadata) {
    return value
  }
}
