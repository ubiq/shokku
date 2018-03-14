import mocha from 'mocha'
import chai from 'chai'
import request from 'supertest'

const test = mocha.test
const expect = chai.expect

xdescribe('symbols.controller', () => {
  let server

  before(done => {
    /* eslint-disable global-require */
    require('../src/app').default.then(s => {
      server = s
      done()
    }).catch(e => done(new Error('App was not loaded correctly! Error: ', e)))
  })

  test('when req -> /v1/ticker/symbols | resp -> 200', () => {
    const r = request(server)
      .get('/v1/ticker/symbols')
      .expect(200)

    expect(r.body).to.be.an('object')
    expect(r.body.symbols).to.be.an('array')
  })

  test('when req -> /v1/ticker/ubqusd | resp -> 200', () => {
    const r = request(server)
      .get('/v1/ticker/ubqusd')
      .expect(200)

    expect(r.body).to.be.an('object')
    expect(r.body.symbols).to.be.an('array')
  })

  test('when req -> /v1/ticker/ubqeur | resp -> 200', () => {})

  test('when req -> /v1/ticker/ubqbtc | resp -> 200', () => {})

  test('when req -> /v1/ticker/ubqeth | resp -> 200', () => {})

  test('when req -> /v1/ticker/ubqltc | resp -> 200', () => {})

  test('when req -> /v1/ticker/invalid | resp -> 400', () =>
    request(server)
      .get('/v1/ticker/ubqusd')
      .expect(404))
})
