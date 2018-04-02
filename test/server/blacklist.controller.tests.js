/* eslint-disable func-names */
/* eslint-disable global-require */

import { describe, before, test } from 'mocha'
import { expect } from 'chai'
import request from 'supertest'

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
