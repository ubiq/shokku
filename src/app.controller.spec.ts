import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import AppController from './app.controller'

describe('app.controller', () => {
  let controller: AppController

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile()

    controller = app.get<AppController>(AppController)
  })

  describe('root() method', () => {
    test('when calling root() | resp -> []', () => {
      expect(controller.root()).to.equals([])
    })
  })
})
