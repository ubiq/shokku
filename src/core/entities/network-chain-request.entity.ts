export class NetworkChainRequestEntity<T> {
  constructor(readonly network: string, readonly chain: string = '', readonly ignoreChain: boolean = false, readonly payload?: T) {}
}
