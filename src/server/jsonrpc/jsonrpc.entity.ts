import { IsString, IsInt, IsPositive, IsNumberString, Contains, IsArray } from 'class-validator'
import { IsRpcMethod } from '@/server/jsonrpc/is-rpc-method.decorator'

export default class JsonRpcEntity {
  @IsInt()
  @IsPositive()
  readonly id?: number

  @IsNumberString()
  @Contains('2.0')
  readonly jsonrpc: string

  @IsRpcMethod()
  readonly method: string

  @IsArray()
  readonly params?: Array<any>
}
