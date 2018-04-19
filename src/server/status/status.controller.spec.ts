import { Test, TestingModule } from '@nestjs/testing'
import StatusController from './status.controller'

describe('status.controller', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [StatusController],
    }).compile()
  })

  describe('/status', () => {
    test('when calling root() | resp -> []', () => {
      const controller = app.get<StatusController>(StatusController)
      expect(controller.root()).toBe([])
    })
  })
})
