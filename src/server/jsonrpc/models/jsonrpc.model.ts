import { IsString, IsInt, IsPositive, IsNumberString, Contains, IsArray } from 'class-validator'
import { IsRpcMethod } from '@/core/decorators/shokku.decorators'

export default class JsonRpcModel {
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
