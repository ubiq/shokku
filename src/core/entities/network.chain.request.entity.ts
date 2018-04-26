export class NetworkChainRequestEntity<T> {
  constructor(readonly network: string, readonly chain?: string, readonly payload?: T) { }
}
