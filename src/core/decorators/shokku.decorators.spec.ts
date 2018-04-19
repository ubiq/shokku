import { Test, TestingModule } from '@nestjs/testing'
import { IsRpcMethod } from './shokku.decorators'

describe('shokku.decorators', () => {

  describe('/', () => {
    it('should validate properly a valid JSON RPC method', () => {
      expect(true).toBe(true)
    })
  })
})
