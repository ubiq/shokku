import { Test } from '@nestjs/testing'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { expect } from 'chai'
import { NetworkChainRequestEntity } from '../../core/entities/network-chain-request.entity'
import { NetworkChainNotFound, NetworkProviderNotFound, NetworksRepository } from '../../networks/networks'
import TickerService from './ticker.service'

describe('blacklist.service', () => {
  let service: TickerService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      components: [NetworksRepository, TickerService]
    }).compile()

    service = module.get<TickerService>(TickerService)
  })

  describe('symbols() method', () => {
    it('should return a list of blacklisted domains if networkId and chainId are correct', () => {
      // Correct NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'mainnet')

      // Call service
      const result = service.symbols(req)

      // Assert
      expect(result).to.not.be.empty
      expect(result).to.be.an('object')
      expect(result.symbols).to.be.an('array')
    })

    it('should throw a NetworkProviderNotFound exception if networkId does not exist', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('wrongNetworkId', 'wrongChainId')

      // Throw
      const toTest = function() {
        service.symbols(req)
      }

      // Call service and assert
      expect(toTest).to.throw(NetworkProviderNotFound)
    })

    it('should throw a NetworkChainNotFound exception if networkId exists but chainId does not', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'wrongChainId')

      // Throw
      const toTest = function() {
        service.symbols(req)
      }

      // Call service and assert
      expect(toTest).to.throw(NetworkChainNotFound)
    })
  })

  describe('symbol() method', () => {
    it('should return a ticker exchange informationlist if networkId, chainId and symbol are all correct', async () => {
      // Fake response from server
      const mock = new MockAdapter(axios)
      mock.onGet('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=UBQ&tsyms=USD').reply(200, {
        RAW: {
          UBQ: {
            USD: {
              TYPE: '5',
              MARKET: 'CCCAGG',
              FROMSYMBOL: 'UBQ',
              TOSYMBOL: 'USD',
              FLAGS: '4',
              PRICE: 2.268891325,
              LASTUPDATE: 1525452433,
              LASTVOLUME: 0,
              LASTVOLUMETO: 0,
              LASTTRADEID: 0,
              VOLUMEDAY: 0,
              VOLUMEDAYTO: 0,
              VOLUME24HOUR: 0,
              VOLUME24HOURTO: 0,
              OPENDAY: 2.317145075,
              HIGHDAY: 2.3702242,
              LOWDAY: 2.201336075,
              OPEN24HOUR: 2.45322065,
              HIGH24HOUR: 2.46094125,
              LOW24HOUR: 2.201336075,
              LASTMARKET: 'Upbit',
              CHANGE24HOUR: -0.1843293250000002,
              CHANGEPCT24HOUR: -7.513768686073965,
              CHANGEDAY: -0.048253750000000206,
              CHANGEPCTDAY: -2.0824656393169603,
              SUPPLY: 37986668.6977163,
              MKTCAP: 86187623.07389756,
              TOTALVOLUME24H: 853796.6790689481,
              TOTALVOLUME24HTO: 1937171.8784533453
            }
          }
        }
      })

      // Correct NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'mainnet')

      // Call service
      const result = await service.symbol(req, 'ubqusd')

      // Assert
      expect(result).to.not.be.empty
      expect(result).to.be.an('object')
      expect(result.base)
        .to.be.a('string')
        .that.equals('UBQ')
      expect(result.quote)
        .to.be.a('string')
        .that.equals('USD')
      expect(result.price)
        .to.be.a('number')
        .that.equals(2.268891325)
      expect(result.open_24h)
        .to.be.a('number')
        .that.equals(2.45322065)
      expect(result.low_24h)
        .to.be.a('number')
        .that.equals(2.201336075)
      expect(result.exchange)
        .to.be.a('string')
        .that.equals('Upbit')
      expect(result.supply)
        .to.be.a('number')
        .that.equals(37986668.6977163)
      expect(result.market_cap)
        .to.be.a('number')
        .that.equals(86187623.07389756)
      expect(result.last_update)
        .to.be.a('number')
        .that.equals(1525452433)
      expect(result.total_volume_24h)
        .to.be.a('number')
        .that.equals(853796.6790689481)
    })

    it('should throw a HttpTickerInvalidExchangeSymbolException exception if value is not correct', () => {

    })

    it('should throw a NetworkProviderNotFound exception if networkId does not exist', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('wrongNetworkId', 'wrongChainId')

      // Throw
      const toTest = function() {
        service.symbols(req)
      }

      // Call service and assert
      expect(toTest).to.throw(NetworkProviderNotFound)
    })

    it('should throw a NetworkChainNotFound exception if networkId exists but chainId does not', () => {
      // Incorrect NetworkChainRequest
      const req = new NetworkChainRequestEntity<any>('ubiq', 'wrongChainId')

      // Throw
      const toTest = function() {
        service.symbols(req)
      }

      // Call service and assert
      expect(toTest).to.throw(NetworkChainNotFound)
    })
  })
})
