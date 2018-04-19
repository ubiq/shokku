import { Test, TestingModule } from '@nestjs/testing'
import JsonRpcController from './jsonrpc.controller'

describe('jsonrpc.controller', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [JsonRpcController],
    }).compile()
  })

  describe('/jsonrpc', () => {
    test('when calling networks() | resp -> []', () => {
      const controller = app.get<JsonRpcController>(JsonRpcController)
      expect(controller.networks()).toBe([])
    })
  })
})
