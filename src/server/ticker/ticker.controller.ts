import { NetworkChain } from '@/core/decorators'
import { NetworkChainRequestEntity } from '@/core/entities'
import TickerService from '@/server/ticker/ticker.service'
import { Controller, Get, Param } from '@nestjs/common'
import { HttpExceptionAdapter } from 'core/exceptions'

@Controller('ticker')
export default class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get(':network/:chain/symbols')
  symbols(@NetworkChain() req: NetworkChainRequestEntity<any>) {
    try {
      return this.tickerService.symbols(req.network, req.chain)
    } catch (error) {
      throw HttpExceptionAdapter.toHttpException(error)
    }
  }

  @Get(':network/:chain/:symbol')
  async symbol(@NetworkChain() req: NetworkChainRequestEntity<any>, @Param('symbol') params) {
    const symbol = params.symbol
    try {
      return await this.tickerService.symbol(req.network, req.chain, symbol)
    } catch (error) {
      throw HttpExceptionAdapter.toHttpException(error)
    }
  }
}
