import { IsString, IsInt, IsPositive, IsNumberString, Contains } from 'class-validator'
import IsRpcMethod from '@/server/jsonrpc/helpers/class.validator.eth.decorators'

export default class JsonRpcModel {
  @IsInt()
  @IsPositive()
  readonly id: string

  @IsNumberString()
  @Contains('2.0')
  readonly jsonrpc: string

  @IsRpcMethod()
  readonly method: string
}
