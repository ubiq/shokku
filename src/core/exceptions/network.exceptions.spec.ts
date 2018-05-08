import {expect} from 'chai'
import {HttpExceptionAdapter, HttpInternalServerException} from '.'
import {HttpNetworkChainNotFoundException, HttpNetworkNotFoundException, HttpTickerExchangeNotAvailableException} from './network.exceptions'
import {NetworkChainNotFound, NetworkProviderNotFound, TickerExchangeNotAvailable} from '../../networks'

describe('networks.exceptions', () => {

  describe('HttpExceptionsAdapter', () => {

    describe('toHttpException(:error)', () => {

      it('should return HttpInternalServerException if an error is not listed', () => {
        const error = HttpExceptionAdapter.toHttpException(null)

        expect(error).to.be.eq(HttpInternalServerException)
      })

      it('should return HttpNetworkNotFoundException exception if error is NetworkProviderNotFound', () => {
        const error = HttpExceptionAdapter.toHttpException(givenAFakeNetworkProviderNotFoundError())

        expect(error).to.be.eq(HttpNetworkNotFoundException)
      })

      it('should return HttpNetworkChainNotFoundException exception if error is NetworkChainNotFound', () => {
        const error = HttpExceptionAdapter.toHttpException(givenAFakeChainNotFoundError())

        expect(error).to.be.eq(HttpNetworkChainNotFoundException)
      })

      it('should return HttpTickerExchangeNotAvailableException exception if error is TickerExchangeNotAvailable', () => {
        const error = HttpExceptionAdapter.toHttpException(givenAFakeTickerNotAvailableError())

        expect(error).to.be.eq(HttpTickerExchangeNotAvailableException)
      })
    })
  })

  function givenAFakeNetworkProviderNotFoundError(): NetworkProviderNotFound {
    return new NetworkProviderNotFound()
  }

  function givenAFakeChainNotFoundError(): NetworkChainNotFound {
    return new NetworkChainNotFound()
  }

  function givenAFakeTickerNotAvailableError(): TickerExchangeNotAvailable {
    return new TickerExchangeNotAvailable()
  }

})
