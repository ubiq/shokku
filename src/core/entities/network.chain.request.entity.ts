export class NetworkChainRequestEntity<T> {
  readonly network: string
  readonly chain?: string
  readonly payload?: T
}
