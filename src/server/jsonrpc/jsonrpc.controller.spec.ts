import { Test, TestingModule } from '@nestjs/testing'
import JsonRpcController from './jsonrpc.controller'
import JsonRpcService from './jsonrpc.service'

describe('jsonrpc.controller', () => {
  let controller: JsonRpcController
  let service: JsonRpcService

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [JsonRpcController],
      components: [JsonRpcService],
    }).compile()

    controller = app.get<JsonRpcController>(JsonRpcController)
    service = app.get<JsonRpcService>(JsonRpcService)
  })

  describe('networks()', () => {
    test('when calling networks() | resp -> []', () => {
      expect(controller.networks()).toBe([])
    })
  })

  describe('chains()', () => {
    test('when calling chains() | resp -> []', () => {
      expect(controller.networks()).toBe([])
    })
  })

  describe('methods()', () => {
    test('when calling methods() | resp -> []', () => {
      expect(controller.networks()).toBe([])
    })
  })

  describe('getMethod()', () => {
    test('when calling getMethod() | resp -> []', () => {
      expect(controller.networks()).toBe([])
    })
  })

  describe('postMethod()', () => {
    test('when calling postMethod() | resp -> []', () => {
      expect(controller.networks()).toBe([])
    })
  })
})
