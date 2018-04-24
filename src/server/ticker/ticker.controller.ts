import TickerService from '@/server/ticker/ticker.service'
import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common'

@Controller('ticker')
export default class TickerController {
  constructor(private readonly tickerService: TickerService) {
  }

  @Get('symbols')
  symbols() {
    return this.tickerService.symbols()
  }

  @Get(':symbol')
  async symbol(@Param() params) {
    const symbol = params.symbol
    try {
      return await this.tickerService.symbol(symbol)
    } catch (e) {
      throw new HttpException('Can\'t retrieve ticker information from original server. Please, try again later.', HttpStatus.BAD_GATEWAY)
    }
  }
}
