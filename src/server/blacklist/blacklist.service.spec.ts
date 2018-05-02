import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import { NetworkChainRequestEntity } from '../../core/entities/network-chain-request.entity'
import { NetworkChainNotFound, NetworkProviderNotFound, NetworksRepository } from '../../networks/networks'
import BlacklistService from './blacklist.service'

describe('blacklist.service', () => {
  let service: BlacklistService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      components: [NetworksRepository, BlacklistService]
    }).compile()

    service = module.get<BlacklistService>(BlacklistService)
  })

  describe('blacklist() method', () => {
    it('should return a list of blacklisted domains if networkId and chainId are correct', () => {
      // Correct NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'mainnet')

      // Call service
      const result = service.blacklist(req)

      // Assert
      expect(result).to.not.be.empty
      expect(result).to.be.an('object')
      expect(result.blacklist).to.be.an('array')
    })

    it("should throw a NetworkProviderNotFound exception if networkId does not exist", () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('wrongNetworkId', 'wrongChainId')

      // Call service and assert
      expect(service.blacklist(req)).to.throw(NetworkProviderNotFound)
    })

    it("should throw a NetworkChainNotFound exception if networkId exists but chainId does not", () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'wrongChainId')

      // Call service and assert
      expect(service.blacklist(req)).to.throw(NetworkChainNotFound)
    })
  })
})
