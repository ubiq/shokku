import { ArgumentMetadata, Pipe, PipeTransform } from '@nestjs/common'
import { read } from 'fs';

export class NetworkChainPipeOptions {
  readonly checkNetwork?: boolean = true
  readonly checkChain?: boolean = true
  readonly toPayload?: Function
}

@Pipe()
export class NetworkChainPipe implements PipeTransform<any> {
  constructor(private readonly options?: NetworkChainPipeOptions) { }

  transform(value: any, metadata: ArgumentMetadata) {
    throw new Error('Method not implemented')
  }
}
