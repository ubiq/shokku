class StatusService {
  async status() {
    return {
      mainnet: 'ok',
      testnet: 'ok'
    }
  }
}

export default new StatusService()