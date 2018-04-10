import { IsString, IsInt, IsNumberString, Contains } from 'class-validator'

export default class JsonRpcModel {
  @IsInt()
  readonly id: string

  @IsNumberString()
  @Contains('2.0')
  readonly jsonrpc: string

  readonly method: string
}
