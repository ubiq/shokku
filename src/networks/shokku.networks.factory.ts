import { NetworkProvider } from '@/networks/networks'
import { UbiqNetworksProviderFactory } from '@/networks/ubiq/ubiq.network'

export default class ShokkuNetworksFactory {
  static create(): Map<string, NetworkProvider> {
    const networks = new Map<string, NetworkProvider>()

    // Ubiq
    const ubiq = UbiqNetworksProviderFactory.create()
    networks.set(ubiq.id, ubiq)

    return networks
  }
}
