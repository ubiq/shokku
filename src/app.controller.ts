import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller()
export default class AppController {
  @Get()
  @HttpCode(204)
  root() {
    return []
  }
}
