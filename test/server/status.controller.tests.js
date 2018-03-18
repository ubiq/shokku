import mocha from 'mocha'
import chai from 'chai'
import request from 'supertest'

const test = mocha.test
const expect = chai.expect

xdescribe('status.controller', () => {
  let server

  before(done => {
    /* eslint-disable global-require */
    require('../src/app').default.then(s => {
      server = s
      done()
    }).catch(e => done(new Error('App was not loaded correctly! Error: ', e)))
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
