/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */

import { describe, test, before } from 'mocha'
import { expect } from 'chai'
import request from 'supertest'

describe('main.controller', () => {
  let server

  before(async () => {
    server = await require('../../src/app').default
  })

  test('when req -> / | resp -> 204', async () => {
    const r = await request(server)
      .get('/')
      .expect(204)

    expect(r.body).to.be.empty
  })
})
