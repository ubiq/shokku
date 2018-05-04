import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import { NetworkChainRequestEntity } from '../../core/entities/network-chain-request.entity'
import { NetworkChainNotFound, NetworkProviderNotFound, NetworksRepository } from '../../networks/networks'
import BlacklistService from './ticker.service'
import TickerService from './ticker.service';

describe('blacklist.service', () => {
  let service: TickerService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      components: [NetworksRepository, TickerService]
    }).compile()

    service = module.get<TickerService>(TickerService)
  })

  describe('symbols() method', () => {
    it('should return a list of blacklisted domains if networkId and chainId are correct', () => {
      // Correct NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'mainnet')

      // Call service
      const result = service.symbols(req)

      // Assert
      expect(result).to.not.be.empty
      expect(result).to.be.an('object')
      expect(result.symbols).to.be.an('array')
    })

    it('should throw a NetworkProviderNotFound exception if networkId does not exist', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('wrongNetworkId', 'wrongChainId')

      // Throw
      const toTest = function() {
        service.symbols(req)
      }

      // Call service and assert
      expect(toTest).to.throw(NetworkProviderNotFound)
    })

    it('should throw a NetworkChainNotFound exception if networkId exists but chainId does not', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'wrongChainId')

      // Throw
      const toTest = function() {
        service.symbols(req)
      }

      // Call service and assert
      expect(toTest).to.throw(NetworkChainNotFound)
    })
  })
})
