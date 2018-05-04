import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ApplicationModule } from '../src/app.module'

xdescribe('main.controller e2e tests', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile()

    app = moduleFixture.createNestApplication();
    await app.init()
  })

  test('when GET req -> / | resp -> 204', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(204)
  })
})
