import { HttpException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import { NetworkChainRequestEntity } from '../../core/entities/network-chain-request.entity'
import { NetworksRepository } from '../../networks/networks'
import TickerController from './ticker.controller'
import TickerService from './ticker.service'

describe('ticker.controller', () => {
  let controller: TickerController
  let service: TickerService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TickerController],
      components: [NetworksRepository, TickerService]
    }).compile()

    controller = module.get<TickerController>(TickerController)
    service = module.get<TickerService>(TickerService)
  })

  describe('symbols() method', () => {
    it('should return a list of supported exchange tickers if networkId and chainId are correct', () => {
      // Fake response from service
      jest.spyOn(service, 'symbols').mockImplementation(() => {
        return {
          symbols: []
        }
      })

      // Correct NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'mainnet')

      // Call controller
      const result = controller.symbols(req)

      // Assert
      expect(result).to.not.be.empty
      expect(result).to.be.an('object')
      expect(result.symbols).to.be.an('array')
    })

    it('should throw a HttpNetworkNotFoundException if networkId does not exist', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('wrongNetworkId', 'wrongChainId')

      // Throw fn
      const toTest = function() {
        const a = controller.symbols(req)
      }

      // Call controller and assert
      expect(toTest).to.throw(HttpException)
    })

    it('should throw a HttpNetworkChainNotFoundException if networkId exists but chainId does not', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'wrongChainId')

      // Throw fn
      const toTest = function() {
        controller.symbols(req)
      }

      // Call controller and assert
      expect(toTest).to.throw(HttpException)
    })
  })

  describe('symbol() method', () => {
    it('should return an exchange ticker information if networkId and chainId are correct', () => {
      // Fake response from service
      jest.spyOn(service, 'symbols').mockImplementation(() => {
        return {
          symbols: []
        }
      })

      // Correct NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'mainnet')

      // Call controller
      const result = controller.symbols(req)

      // Assert
      expect(result).to.not.be.empty
      expect(result).to.be.an('object')
      expect(result.symbols).to.be.an('array')
    })
  })

  it('should throw a HttpNetworkNotFoundException if networkId does not exist', () => {
    // Incorrect NetworkChainRequest
    const req = new NetworkChainRequestEntity<any>('wrongNetworkId', 'wrongChainId')

    // Throw fn
    const toTest = function() {
      const a = controller.symbols(req)
    }

    // Call controller and assert
    expect(toTest).to.throw(HttpException)
  })

  it('should throw a HttpNetworkChainNotFoundException if networkId exists but chainId does not', () => {
    // Incorrect NetworkChainRequest
    const req = new NetworkChainRequestEntity<any>('ubiq', 'wrongChainId')

    // Throw fn
    const toTest = function() {
      controller.symbols(req)
    }

    // Call controller and assert
    expect(toTest).to.throw(HttpException)
  })
})
