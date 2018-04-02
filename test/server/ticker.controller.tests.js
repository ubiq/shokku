/* eslint-disable global-require */

import { describe, before, test } from 'mocha'
import { expect } from 'chai'
import request from 'supertest'

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
  let server

  before(async () => {
    server = await require('../../src/app').default
  })

  test('when req -> /v1/ticker/symbols | resp -> 200', async () => {
    const r = await request(server)
      .get('/v1/ticker/symbols')
      .expect(200)

    expect(r.body).to.be.an('object')
    expect(r.body.symbols).to.be.an('array')
  })

  test('when req -> /v1/ticker/ubqusd | resp -> 200', async () => {
    const r = await request(server)
      .get('/v1/ticker/ubqusd')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when req -> /v1/ticker/ubqeur | resp -> 200', async () => {
    const r = await request(server)
      .get('/v1/ticker/ubqeur')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when req -> /v1/ticker/ubqbtc | resp -> 200', async () => {
    const r = await request(server)
      .get('/v1/ticker/ubqeur')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when req -> /v1/ticker/ubqeth | resp -> 200', async () => {
    const r = await request(server)
      .get('/v1/ticker/ubqeur')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when req -> /v1/ticker/ubqltc | resp -> 200', async () => {
    const r = await request(server)
      .get('/v1/ticker/ubqeur')
      .expect(200)

    expectTickerResponse(r)
  })

  test('when req -> /v1/ticker/invalid | resp -> 400', async () =>
    await request(server)
      .get('/v1/ticker/invalid')
      .expect(404))
})
