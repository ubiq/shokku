import mocha from 'mocha'
import chai from 'chai'
import request from 'supertest'

const test = mocha.test
const expect = chai.expect

xdescribe('blacklist.controller', () => {
  let server

  before(done => {
    /* eslint-disable global-require */
    require('../src/app').default.then(s => {
      server = s
      done()
    }).catch(e => done(e))
  })

  test('when req -> /v1/blacklist | resp -> 200', () => {
    const r = request(server)
      .get('/')
      .expect(200)

    expect(r.body).to.be.an('array')
  })
})
