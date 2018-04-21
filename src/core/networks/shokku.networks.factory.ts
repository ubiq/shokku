import { NetworkProvider } from '@/core/networks/network.provider'
import { UbiqNetworksProviderFactory } from '@/core/networks/ubiq/ubiq.network'

export default class ShokkuNetworksFactory {
  static create(): Map<string, NetworkProvider> {
    const networks = new Map<string, NetworkProvider>()

    // Ubiq
    const ubiq = new UbiqNetworksProviderFactory().create()
    networks.set(ubiq.id, ubiq)

    return networks
  }
}
