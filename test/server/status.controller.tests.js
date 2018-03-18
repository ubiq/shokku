/* eslint-disable global-require */

import mocha from 'mocha'
import chai from 'chai'
import request from 'supertest'

const test = mocha.test
const expect = chai.expect

xdescribe('status.controller', () => {
  let server

  before(async () => {
    server = await require('../../src/app').default
  })

  test('when req -> "/v1/status" | resp -> 200', () => {
    const r = request(server)
      .get('/v1/status')
      .expect(200)

    expect(r.body).to.be.an('object')
    expect(r.body.mainnet).to.be.a('string')
    expect(r.body.testnet).to.be.a('string')
  })
})
