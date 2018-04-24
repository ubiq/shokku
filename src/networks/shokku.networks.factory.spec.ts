import { expect } from 'chai'
import { NetworksRepository } from './networks'

describe('shokku.networks.factory', () => {
  let repository: NetworksRepository

  beforeAll(() => {
    repository = new NetworksRepository()
  })

  describe('create() method', () => {
    it('should return a complete list of registered NetworksProviders', () => {
      const networksProviders = repository.getAll()
      expect(networksProviders).to.be.an('array').to.have.lengthOf(1)
    })
  })
})
