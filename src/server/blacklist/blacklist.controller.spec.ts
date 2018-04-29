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
    test('when calling root() | resp -> {}', () => {
      // Fake response from service
      jest.spyOn(service, 'blacklist').mockImplementation(() => {
        blacklist: []
      })

      // Fake NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'mainnet')

      // Call controller
      const result = controller.root(req)

      expect(result).to.equals({ blacklist: [] })
    })
  })
})
