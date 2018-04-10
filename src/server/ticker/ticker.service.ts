import { Component } from '@nestjs/common'
import axios from 'axios'

const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=UBQ&tsyms=BTC,USD,EUR,ETH,LTC'

@Component()
export default class TickerService {

  symbols() {
    return {
      symbols: [
        'ubqusd',
        'ubqeur',
        'ubqbtc',
        'ubqeth',
        'ubqltc',
      ],
    }
  }

  async symbol(symbol: string) {
    const res = await axios(CRYPTOCOMPARE_API)
    return this.toTickerJson(symbol, res.data)
  }

  private toTickerJson(symbol: string, json) {
    const currency = symbol.replace('ubq', '').toUpperCase()
    return {
      base: json.RAW.UBQ[currency].FROMSYMBOL,
      quote: json.RAW.UBQ[currency].TOSYMBOL,
      price: json.RAW.UBQ[currency].PRICE,
      open_24h: json.RAW.UBQ[currency].OPEN24HOUR,
      low_24h: json.RAW.UBQ[currency].LOW24HOUR,
      exchange: json.RAW.UBQ[currency].LASTMARKET,
      supply: json.RAW.UBQ[currency].SUPPLY,
      market_cap: json.RAW.UBQ[currency].MKTCAP,
      last_update: json.RAW.UBQ[currency].LASTUPDATE,
      total_volume_24h: json.RAW.UBQ[currency].TOTALVOLUME24H,
    }
  }
}
