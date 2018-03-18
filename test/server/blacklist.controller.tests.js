/* eslint-disable func-names */
/* eslint-disable global-require */

import mocha from 'mocha'
import chai from 'chai'
import request from 'supertest'

const test = mocha.test
const expect = chai.expect

describe('blacklist.controller', () => {
  let server

  before(async () => {
    server = await require('../../src/app').default
  })

  test('when req -> /v1/blacklist | resp -> 200', async () => {
    const r = await request(server)
      .get('/v1/blacklist')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(r.body).to.be.an('object')
    expect(r.body.blacklist).to.be.an('array')
  })
})
