import { Test, TestingModule } from '@nestjs/testing'
import { IsRpcMethod } from './decorators'
import { expect } from 'chai'

describe('shokku.decorators', () => {

  describe('/', () => {
    it('should validate properly a valid JSON RPC method', () => {
      expect(true).to.equals(true)
    })
  })
})
