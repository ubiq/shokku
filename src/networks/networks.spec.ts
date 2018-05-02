import { expect } from 'chai'
import { NetworkProviderNotFound } from './networks'

describe('networks', () => {
  describe('NetworksRepository', () => {
    let repository: NetworksRepository

    beforeAll(() => {
      repository = new NetworksRepository()
    })

    describe('getAll() method', () => {
      it('should return create a complete list of registered NetworksProviders', () => {
        const networksProviders = repository.getAllNetworkProviders()
        expect(networksProviders).to.be.an('array').to.have.lengthOf(1)
      })
    })

    describe('get(:id) method', () => {
      it('it should return a concrete NetworkProvider by :id', () => {
        const networkProvider = repository.getNetworkProvider('ubiq')
        expect(networkProvider).to.exist
      })

      it('it should not return concrete NetworkProvider by :id if is not registered', () => {
        const networkProvider = repository.getNetworkProvider('')
        expect(networkProvider).to.be.undefined
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
