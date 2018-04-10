import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ApplicationModule } from './../src/app.module'

describe('e2e tests', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile()

    app = moduleFixture.createNestApplication();
    await app.init();
  })

  it('/GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(204)
  })
})
