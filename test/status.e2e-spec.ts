import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import request from 'supertest'
import { ApplicationModule } from './../src/app.module'

xdescribe('status.controller e2e tests', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile()

    app = moduleFixture.createNestApplication();
    await app.init()
  })

  test('when GET req -> "/v1/status" | resp -> 200', async () => {
    const r = await request(app.getHttpServer())
      .get('/v1/status')
      .expect(200)

    expect(r.body).to.be.an('object')
    expect(r.body.mainnet).to.be.a('string')
    expect(r.body.testnet).to.be.a('string')
  })
})
