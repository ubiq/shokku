import { HttpStatus, HttpException } from '@nestjs/common'
import { NetworkProviderNotFound, NetworkChainNotFound } from '@/networks'

// HttpExceptions
export const HttpNetworkNotFoundException = new HttpException('Invalid network requested', HttpStatus.NOT_FOUND)
export const HttpNetworkChainNotFoundException = new HttpException('Invalid chain requested', HttpStatus.NOT_FOUND)
export const HttpInternalServerException = new HttpException('The server can\'t process this request. Please, try again later.', HttpStatus.INTERNAL_SERVER_ERROR)

export class HttpExceptionAdapter {
  static toHttpException(error: Error): Error {
    if ((error instanceof NetworkProviderNotFound)) {
      return HttpNetworkNotFoundException
    }

    if (error instanceof NetworkChainNotFound) {
      return HttpNetworkChainNotFoundException
    }

    return HttpInternalServerException
  }
}
