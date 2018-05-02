import { expect } from 'chai'
import { NetworkProviderNotFound, NetworksRepository } from './networks'

describe('networks', () => {
  describe('NetworksRepository', () => {
    let repository: NetworksRepository

    beforeAll(() => {
      repository = new NetworksRepository()
    })

    describe('getAll() method', () => {
      it('should create a complete list of registered NetworksProviders', () => {
        const networksProviders = repository.getAllNetworkProviders()
        expect(networksProviders).to.be.an('array').to.have.lengthOf(1)
      })
    })

    describe('get(:id) method', () => {
      it('it should return a concrete NetworkProvider by :id', () => {
        const networkProvider = repository.getNetworkProvider('ubiq')
        expect(networkProvider).to.exist
      })

      it('it should throw a NetworkProviderNotFound exception if NetworkProvider :id is not registered', () => {
        expect(repository.getNetworkProvider('')).to.throw(NetworkProviderNotFound)
      })
    })
  })

  describe('shokku-networks.factory', () => {
    let repository: NetworksRepository

    beforeAll(() => {
      repository = new NetworksRepository()
    })

    describe('create() method', () => {
      it('should return a complete list of registered NetworksProviders', () => {
        const networksProviders = repository.getAllNetworkProviders()
        expect(networksProviders).to.be.an('array').to.have.lengthOf(1)
      })
    })
  })

})
