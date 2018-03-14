import mocha from 'mocha'
import request from 'supertest'

const test = mocha.test

xdescribe('main.controller', () => {
  let server

  before(done => {
    /* eslint-disable global-require */
    require('../src/app').default.then(s => {
      server = s
      done()
    }).catch(e => done(e))
  })

  test('when req -> / | resp -> 204', () => {
    request(server)
      .get('/')
      .expect(204)
  })
})
