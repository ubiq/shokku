import axios from 'axios'
import errors from 'common-errors'

import l from '@/helpers/logger'

const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=UBQ&tsyms=BTC,USD,EUR,ETH,LTC'

class TickerService {
  async symbols() {
    l.info('TickerService - symbols() / Returning list of supported tickers')
    return {
      symbols: [
        'ubqusd',
        'ubqeur',
        'ubqbtc',
        'ubqeth',
        'ubqltc'
      ]
    }
  }

  async symbol(symbol) {
    l.info(`TickerService - symbols() / Fetching request for current symbol: ${symbol}`)
    try {
      const res = await axios(CRYPTOCOMPARE_API)
      return this.toTickerJson(symbol, res.data)
    } catch (err) {
      l.error(`TickerService - symbols() / Error fetching request for current symbol: ${symbol} | ${err}`)
      throw errors.Http502Error({
        message: "Can't retrieve ticker list from original server. Please, try again later."
      })
    }
  }

  toTickerJson(symbol, json) {
    l.info('TickerService - symbols() / Converting information to ticker...')
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
      total_volume_24h: json.RAW.UBQ[currency].TOTALVOLUME24H
    }
  }
}

export default new TickerService()
