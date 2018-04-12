import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import request from 'supertest'
import { ApplicationModule } from './../src/app.module'

const expectTickerResponse = r => {
  expect(r.body).to.be.an('object')
  expect(r.body.base).to.be.an('string')
  expect(r.body.quote).to.be.an('string')
  expect(r.body.price).to.be.an('string')
  expect(r.body.open_24h).to.be.an('string')
  expect(r.body.low_24h).to.be.an('string')
  expect(r.body.exchange).to.be.an('string')
  expect(r.body.supply).to.be.an('number')
  expect(r.body.market_cap).to.be.an('number')
  expect(r.body.last_update).to.be.an('number')
  expect(r.body.total_volume_24h).to.be.an('number')
}

describe('symbols.controller', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile()

    app = moduleFixture.createNestApplication();
    await app.init()
  })

  test('when GET req -> /v1/ticker/symbols | resp -> 200', async () => {
    const r = await request(app.getHttpServer())
      .get('/v1/ticker/symbols')
      .expect(200)

    expect(r.body).to.be.an('object')
    expect(r.body.symbols).to.be.an('array')
  })

  test('when GET req -> /v1/ticker/ubqusd | resp -> 200', async () => {
    const r = await request(app.getHttpServer())
      .get('/v1/ticker/ubqusd')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when req -> /v1/ticker/ubqeur | resp -> 200', async () => {
    const r = await request(app.getHttpServer())
      .get('/v1/ticker/ubqeur')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when GET req -> /v1/ticker/ubqbtc | resp -> 200', async () => {
    const r = await request(app.getHttpServer())
      .get('/v1/ticker/ubqeur')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when GET req -> /v1/ticker/ubqeth | resp -> 200', async () => {
    const r = await request(app.getHttpServer())
      .get('/v1/ticker/ubqeur')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when GET req -> /v1/ticker/ubqltc | resp -> 200', async () => {
    const r = await request(app.getHttpServer())
      .get('/v1/ticker/ubqeur')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when GET req -> /v1/ticker/invalid | resp -> 400', async () =>
    await request(app.getHttpServer())
      .get('/v1/ticker/invalid')
      .expect(404))
})
