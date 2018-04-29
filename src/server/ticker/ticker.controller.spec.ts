import { Test, TestingModule } from '@nestjs/testing'
import TickerController from './ticker.controller'

describe('ticker.controller', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TickerController],
    }).compile()
  })

  describe('/ticker', () => {
    test('when calling symbols() | resp -> []', () => {
      const controller = app.get<TickerController>(TickerController)
      expect(controller.symbols()).toBe([])
    })
  })

  describe('/ticker/:symbol', () => {
    test('when calling symbol() | resp -> []', () => {
      const controller = app.get<TickerController>(TickerController)
      expect(controller.symbol({ symbol: 'ubqusd' })).toBe([])
    })
  })
})
