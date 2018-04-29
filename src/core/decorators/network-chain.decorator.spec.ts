import { Test, TestingModule } from '@nestjs/testing'
import { IsRpcMethod } from './decorators'
import { expect } from 'chai'

describe('network-chain.decorator', () => {

  describe('/', () => {
    it('should validate properly a valid JSON RPC method', () => {
      expect(true).to.equals(true)
    })
  })
})
