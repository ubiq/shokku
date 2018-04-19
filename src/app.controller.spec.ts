import { Test, TestingModule } from '@nestjs/testing'
import AppController from './app.controller'

describe('app.controller', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile()
  })

  describe('/', () => {
    test('when calling root() | resp -> []', () => {
      const controller = app.get<AppController>(AppController)
      expect(controller.root()).toBe([])
    })
  })
})
