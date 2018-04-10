import { Component } from '@nestjs/common'

@Component()
export default class StatusService {
  status() {
    return {
      mainnet: 'ok',
      testnet: 'ok',
    }
  }
}
