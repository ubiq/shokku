import { expect as chaiExpect } from 'chai'
import { NetworksRepository } from '../../networks/networks'
import { NetworkChainRequestEntity } from '../entities/network-chain-request.entity'
import { NetworkChainValidatorPipe } from '../pipes/network-chain-validator.pipe'
import { HttpInternalServerException } from '../exceptions/network.exceptions'

describe('network-chain-validator.pipe', () => {

  describe('NetworkChainValidatorPipe', () => {

    it('should transform(:value, :metadata) return the same value if it is not an NetworkChainRequestEntity instance', () => {
      const networkRepositoryMock = givenANetworkRepositoryMock()
      const networkChainValidatorPipe = new NetworkChainValidatorPipe(networkRepositoryMock)

      const fakeValue = {value: 1}

      const result = networkChainValidatorPipe.transform(fakeValue, null)

      expect(networkRepositoryMock.getNetworkChain).not.toHaveBeenCalled()
      expect(networkRepositoryMock.getNetworkProvider).not.toHaveBeenCalled()
      chaiExpect(result).to.be.eq(fakeValue)
    })

    it('should transform(:value, :metadata) validate the NetworkChainRequestEntity with the network provider as ignoreChain property is true', () => {
      const networkRepositoryMock = givenANetworkRepositoryMock()
      const networkChainValidatorPipe = new NetworkChainValidatorPipe(networkRepositoryMock)

      const networkChainRequestEntity = new NetworkChainRequestEntity('fake-network', 'fake-chain', true, null)
      const result = networkChainValidatorPipe.transform(networkChainRequestEntity, null)

      expect(networkRepositoryMock.getNetworkProvider).toHaveBeenCalled()
      expect(networkRepositoryMock.getNetworkChain).not.toHaveBeenCalled()
      chaiExpect(result).to.be.eq(networkChainRequestEntity)
    })

    it('should transform(:value, :metadata) validate the NetworkChainRequestEntity with the network chain as ignoreChain property is false',() => {
      const networkRepositoryMock = givenANetworkRepositoryMock()
      const networkChainValidatorPipe = new NetworkChainValidatorPipe(networkRepositoryMock)

      const networkChainRequestEntity = new NetworkChainRequestEntity('fake-network', 'fake-chain', false, null)
      const result = networkChainValidatorPipe.transform(networkChainRequestEntity, null)

      expect(networkRepositoryMock.getNetworkProvider).not.toHaveBeenCalled()
      expect(networkRepositoryMock.getNetworkChain).toHaveBeenCalled()
      chaiExpect(result).to.be.eq(networkChainRequestEntity)
    })

    it('should transform(:value, :metadata) throw HttpInternalServerException if repository throw an error', () => {
      const getNetworkProviderFunctionSpy = jest.fn(() => {
        throw givenAFakeError()
      })

      const NetworkRepositoryMock = jest.fn<NetworksRepository>(() => ({
        getNetworkProvider: getNetworkProviderFunctionSpy,
      }))

      const networkRepositoryMock = new NetworkRepositoryMock()
      const networkChainValidatorPipe = new NetworkChainValidatorPipe(networkRepositoryMock)

      const networkChainRequestEntity = new NetworkChainRequestEntity('fake-network', 'fake-chain', true, null)

      const chainValidatorPipeTransformWrapper = () => {
        networkChainValidatorPipe.transform(networkChainRequestEntity, null)
      }

      expect(chainValidatorPipeTransformWrapper).toThrowError(HttpInternalServerException)
      expect(getNetworkProviderFunctionSpy).toHaveBeenCalledTimes(1)
    })

  })

  function givenAFakeError(): Error {
    return Error('Fake Error')
  }

  function givenANetworkRepositoryMock(): NetworksRepository {
    const NetworkRepositoryMock = jest.fn<NetworksRepository>(() => ({
      getAllNetworkProviders: jest.fn(),
      getNetworkProvider: jest.fn(),
      getNetworkChain: jest.fn()
    }))

    return new NetworkRepositoryMock()
  }
})
