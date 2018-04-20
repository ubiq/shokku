import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import BlacklistController from './blacklist.controller'
import BlacklistService from './blacklist.service'

describe('blacklist.controller', () => {
  let controller: BlacklistController
  let service: BlacklistService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [BlacklistController],
      components: [BlacklistService],
    }).compile()

    controller = module.get<BlacklistController>(BlacklistController)
    service = module.get<BlacklistService>(BlacklistService)
  })

  describe('root() method', () => {
    test('when calling root() | resp -> {}', () => {
      // Fake response from service
      jest.spyOn(service, 'blacklist').mockImplementation(() => {})

      expect(controller.root()).to.equals({})
    })
  })
})
