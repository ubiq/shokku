import { HttpException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import { NetworkChainRequestEntity } from '../../core/entities/network-chain-request.entity'
import { NetworksRepository } from '../../networks/networks'
import BlacklistController from './blacklist.controller'
import BlacklistService from './blacklist.service'

describe('blacklist.controller', () => {
  let controller: BlacklistController
  let service: BlacklistService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [BlacklistController],
      components: [NetworksRepository, BlacklistService]
    }).compile()

    controller = module.get<BlacklistController>(BlacklistController)
    service = module.get<BlacklistService>(BlacklistService)
  })

  describe('root() method', () => {
    it('should return a list of blacklisted domains if networkId and chainId are correct', () => {
      // Fake response from service
      jest.spyOn(service, 'blacklist').mockImplementation(() => {
        return {
          blacklist: []
        }
      })

      // Correct NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'mainnet')

      // Call controller
      const result = controller.root(req)

      // Assert
      expect(result).to.not.be.empty
      expect(result).to.be.an('object')
      expect(result.blacklist).to.be.an('array')
    })

    it('should throw a HttpNetworkNotFoundException exception if networkId does not exist', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('wrongNetworkId', 'wrongChainId')

      // Throw fn
      const toTest = function() {
        controller.root(req)
      }

      // Call controller and assert
      expect(toTest).to.throw(HttpException)
    })

    it('should throw a HttpNetworkChainNotFoundException exception if networkId exists but chainId does not', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'wrongChainId')

      // Throw fn
      const toTest = function() {
        controller.root(req)
      }

      // Call controller and assert
      expect(toTest).to.throw(HttpException)
    })
  })
})
