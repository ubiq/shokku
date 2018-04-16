import { NetworkProvider } from '@/core/networks/network.provider'
import { UbiqNetworksProviderFactory } from '@/core/networks/ubiq/ubiq.network'

export default class ShokkuNetworksFactory {
  static create(): Map<String, NetworkProvider> {
    const networks = new Map<String, NetworkProvider>()

    // Ubiq
    const ubiq = new UbiqNetworksProviderFactory().create({})
    networks.set(ubiq.id, ubiq)

    return networks
  }
}
