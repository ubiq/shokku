import { Test, TestingModule } from '@nestjs/testing'
import BlacklistController from './blacklist.controller'

describe('blacklist.controller', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [BlacklistController],
    }).compile()
  })

  describe('/blacklist', () => {
    test('when calling root() | resp -> []', () => {
      const controller = app.get<BlacklistController>(BlacklistController)
      expect(controller.root()).toBe([])
    })
  })
})
