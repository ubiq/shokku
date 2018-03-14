import TickerService from 'server/services/ticker'
import l from 'helpers/logger'

export class TickerController {
  async symbols(req, res) {
    l.info('TickerController - symbols() / Listing accepted ticker symbols')
    const symbols = await TickerService.symbols()
    return res.json(symbols)
  }

  async symbol(req, res) {
    l.info('TickerController - symbol() / Processing symbol')
    try {
      const resp = await TickerService.symbol(req.params.symbol || 'ubqusd')
      return res.json(resp)
    } catch (err) {
      return res.error(err)
    }
  }
}

export default new TickerController()
