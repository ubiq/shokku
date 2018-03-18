/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */

import mocha from 'mocha'
import chai from 'chai'
import request from 'supertest'

const test = mocha.test
const expect = chai.expect

describe('main.controller', () => {
  let server

  before(done => {
    require('../src/app').default.then(s => {
      server = s
      done()
    }).catch(e => done(e))
  })

  test('when req -> / | resp -> 204', async () => {
    const r = await request(server)
      .get('/')
      .expect(204)

    expect(r.body).to.be.empty
  })
})
