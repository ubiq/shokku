import mocha from 'mocha'
import chai from 'chai'
import request from 'supertest'
import Ganache from 'ganache-core'
import dotenv from 'dotenv'
import _ from 'lodash'

dotenv.config({
  path: `${__dirname}/.env.tests`
})

const test = mocha.test
const expect = chai.expect

const networks = ['mainnet', 'testnet']

const expectStandardErrorResponse = r => {
  expect(r.body).to.be.an('object')
  expect(r.body.code).to.be.a('number').that.equal(400)
  expect(r.body.errors).to.be.a('array')
}

describe('jsonrpc.controller', () => {
  let server
  let rpcServer

  /* eslint-disable func-names */
  before(function (done) {
    this.timeout(15000)

    /* eslint-disable global-require */
    require('../src/app').default.then(s => {
      server = s
      if (process.env.API_ENABLE_GANACHE === 'true') {
        rpcServer = Ganache.server({
          port: 8588,
          network_id: 88,
          hdPath: "m/44'/108'/0'/0/"
        })
        rpcServer.listen(err => {
          if (err) {
            done(err)
            return
          }
          done()
        })
      } else {
        done()
      }
    }).catch(e => done(e))
  })

  after(() => {
    if (rpcServer) {
      rpcServer.close()
    }
  })

  xdescribe('rpc listing methods calls', () => {
    test('when req -> /v1/jsonrpc/{network}/methods | no params | resp -> 200', async () => {
      for (const network of networks) {
        const r = await request(server)
          .get(`/v1/jsonrpc/${network}/methods`)
          .expect('Content-Type', /json/)
          .expect(200)

        expect(r.body).to.be.an('object')
        expect(r.body.get).to.be.an('array').to.have.lengthOf(31)
        expect(r.body.post).to.be.an('array').to.have.lengthOf(4)
      }
    })
  })

  describe('rpc GET calls', () => {
    // web3_clientVersion
    xdescribe('when req -> /v1/jsonrpc/{network}/web3_clientVersion', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/web3_clientVersion`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('string')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/web3_clientVersion?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('string')
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/web3_clientVersion?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)
          expectStandardErrorResponse(r)
        }
      })
    })

    // net_version
    xdescribe('when req -> /v1/jsonrpc/{network}/net_version', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_version`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('string')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_version?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('string')
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_version?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // net_listening
    xdescribe('when req -> /v1/jsonrpc/{network}/net_listening', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_listening`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('boolean')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_listening?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('boolean')
        }
      })

      test('params[invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_listening?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // web3_clientVersion
    xdescribe('when req -> /v1/jsonrpc/{network}/web3_clientVersion', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/web3_clientVersion`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('string')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/web3_clientVersion?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('string')
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/web3_clientVersion?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // net_peerCount
    xdescribe('when req -> /v1/jsonrpc/{network}/net_peerCount', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_peerCount`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_peerCount?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/net_peerCount?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_protocolVersion
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_protocolVersion', () => {
      test('resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_protocolVersion`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('string')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_protocolVersion?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('string')
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_protocolVersion?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_syncing
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_syncing', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_syncing`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(e => _.isObject(e) || _.isBoolean(e))
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_syncing?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(e => _.isObject(e) || _.isBoolean(e))
        }
      })

      test('params ["invalid"] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_syncing?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_mining
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_mining', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_mining`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('boolean')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_mining?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('boolean')
        }
      })

      test('params ["invalid"] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_mining?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_hashrate
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_hashrate', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_hashrate`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_hashrate?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params ["invalid"] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_hashrate?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_gasPrice
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_gasPrice', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_gasPrice`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_gasPrice?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params ["invalid"] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_gasPrice?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_accounts
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_accounts', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_accounts`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('array')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_accounts?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.be.a('array')
        }
      })

      test('params ["invalid"] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_accounts?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_blockNumber
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_blockNumber', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_blockNumber`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_blockNumber?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params ["params"] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_blockNumber?params=["params"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_getBalance
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getBalance', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0x407] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x407"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [latest, 0x407d73d8a49eeb85d32cf465507dd71d507100c1] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["latest", "0x407d73d8a49eeb85d32cf465507dd71d507100c1"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [test] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["test"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [test, 0x0] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["test", "10"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [test, 0x0, other] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["test", "0x0", "other"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1, latest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "latest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1, earliest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "earliest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1, pending] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "pending"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1, 0x10] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "0x10"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })
    })

    // eth_getStorageAt
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getStorageAt', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getStorageAt`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getStorageAt?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid, 121, 0x121212] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getStorageAt?params=["invalid", 121, "0x12121212"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0x295a70b2de5e3953354a6a8344e616ed314d7251, 0x0, latest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getStorageAt?params=["0x295a70b2de5e3953354a6a8344e616ed314d7251", "0x0", "latest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })
    })

    // eth_getTransactionCount
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getTransactionCount', () => {
      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0x407] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x407"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [latest, 0x407d73d8a49eeb85d32cf465507dd71d507100c1] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["latest", "0x407d73d8a49eeb85d32cf465507dd71d507100c1"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [test] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["test"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [test, 0x0] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["test", "10"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [test, 0x0, other] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["test", "0x0", "other"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1, 0x0] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "0x0"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1, latest] | rresp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "latest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1, earliest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "earliest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [0x407d73d8a49eeb85d32cf465507dd71d507100c1, pending] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "pending"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })
    })

    // eth_getBlockTransactionCountByHash
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getBlockTransactionCountByHash', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByHash`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByHash?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByHash?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByHash?params=["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })
    })

    // eth_getBlockTransactionCountByNumber
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getBlockTransactionCountByNumber ', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0xe8] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["0xe8"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })

      test('params [earliest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["earliest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })

      test('params [latest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["latest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })

      test('params [pending] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["pending"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })
    })

    // eth_getUncleCountByBlockHash
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getUncleCountByBlockHash', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockHash`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockHash?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockHash?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockHash?params=["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })
    })

    // eth_getUncleCountByBlockNumber
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getUncleCountByBlockNumber', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockNumber`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockNumber?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockNumber?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0xe8] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockNumber?params=["0xe8"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })
    })

    // eth_getCode
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getCode', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCode`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCode?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid, another] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCode?params=["invalid", "another"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b, earliest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCode?params=["0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b", "earliest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })

      test('params [0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b, latest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCode?params=["0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b", "latest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })

      test('params [0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b, pending] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCode?params=["0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b", "pending"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })

      test('params [0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b, 0x2] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCode?params=["0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b", "0x2"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
        }
      })
    })

    // eth_call
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_call', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_call`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_call?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_call?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [{to: 0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b}] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_call?params=[{"to": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b"}]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test(
        'params' +
        '  [{to: 0xb60e8dd61c5d32be8058bb8eb970870f07233155, invalidkey: 0xb60e8dd61c5d32be8058bb8eb970870f07233155}, earliest]  ' +
        'resp -> 400',
        async () => {
          for (const network of networks) {
            const url1 = `/v1/jsonrpc/${network}/eth_call?params=`
            const url2 = '[{"to": "0xb60e8dd61c5d32be8058bb8eb970870f07233155", "invalidkey": "0xb60e8dd61c5d32be8058bb8eb970870f07233155"}, "earliest"]'
            const r = await request(server)
              .get(url1 + url2)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        }
      )

      test('params [{to: 0xb60e8dd61c5d32be8058bb8eb970870f07233155}, earliest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_call?params=[{"to": "0xb60e8dd61c5d32be8058bb8eb970870f07233155"}, "earliest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [{to: 0xb60e8dd61c5d32be8058bb8eb970870f07233155}, latest] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_call?params=[{"to": "0xb60e8dd61c5d32be8058bb8eb970870f07233155"}, "latest"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })

      test('params [{to: 0xb60e8dd61c5d32be8058bb8eb970870f07233155}, pending] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_call?params=[{"to": "0xb60e8dd61c5d32be8058bb8eb970870f07233155"}, "pending"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
        }
      })
    })

    // eth_getBlockByHash
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getBlockByHash', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByHash`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByHash?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByHash?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid, invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByHash?params=["invalid", "invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [0x8caa96b7468ef0afd04a34e13facbc17e3258f80993f8eff1c229a711d6327ed, true] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByHash?params=["0x8caa96b7468ef0afd04a34e13facbc17e3258f80993f8eff1c229a711d6327ed", true]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('object')
        }
      })

      test('params [0x8caa96b7468ef0afd04a34e13facbc17e3258f80993f8eff1c229a711d6327ed, false] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByHash?params=["0x8caa96b7468ef0afd04a34e13facbc17e3258f80993f8eff1c229a711d6327ed", false]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('object')
        }
      })
    })

    // eth_getBlockByNumber
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getBlockByNumber', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [earliest, true] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["earliest", "true"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })

      test('params [earliest, false] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["earliest", "false"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })

      test('params [latest, true] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["latest", "true"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })

      test('params [latest, false] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["latest", "false"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })

      test('params [pending, true] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["pending", "true"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })

      test('params [pending, false] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["pending", "false"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })
    })

    // eth_getTransactionByHash
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByHash', () => {
      test('when req -> /v1/jsonrpc/{network}/eth_getTransactionByHash', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionByHash`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })
    })

    // eth_getTransactionByBlockHashAndIndex
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByBlockHashAndIndex', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockHashAndIndex`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })
    })

    // eth_getTransactionByBlockNumberAndIndex
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByBlockNumberAndIndex', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockNumberAndIndex`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })
    })

    // eth_getTransactionReceipt
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getTransactionReceipt', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getTransactionReceipt`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })
    })

    // eth_getUncleByBlockHashAndIndex
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getUncleByBlockHashAndIndex', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleByBlockHashAndIndex`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('number')
        }
      })
    })

    // eth_getUncleByBlockNumberAndIndex
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getUncleByBlockNumberAndIndex', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getUncleByBlockNumberAndIndex`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_getCompilers
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getCompilers', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCompilers`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('array')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCompilers?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('array')
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getCompilers?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_getLogs
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getLogs', () => {
      test('no params | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getLogs`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getLogs?params=[]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [invalid] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getLogs?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(400)

          expectStandardErrorResponse(r)
        }
      })

      test('params [{"topics": ["0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b"]}] | resp -> 400', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getLogs?params=[{"topics": ["0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b"]}]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expectStandardErrorResponse(r)
        }
      })
    })

    // eth_getWork
    xdescribe('when req -> /v1/jsonrpc/{network}/eth_getWork', () => {
      test('no params | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getWork`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('array')
        }
      })

      test('params [] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getWork?params=[]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('array')
        }
      })

      test('params [invalid] | resp -> 200', async () => {
        for (const network of networks) {
          const r = await request(server)
            .get(`/v1/jsonrpc/${network}/eth_getWork?params=["invalid"]`)
            .expect('Content-Type', /json/)
            .expect(200)

          expect(r.body).to.be.an('object')
          expect(r.body.id).to.be.a('number')
          expect(r.body.jsonrpc).to.be.a('string')
          expect(r.body.result).to.be.a('array')
        }
      })
    })
  })

  xdescribe('rpc POST calls', () => {
    // eth_sendRawTransaction
    describe('when req -> /v1/jsonrpc/{network}/eth_sendRawTransaction', () => {})

    // eth_estimateGas
    describe('when req -> /v1/jsonrpc/{network}/eth_estimateGas', () => {})

    // eth_submitWork
    describe('when req -> /v1/jsonrpc/{network}/eth_submitWork', () => {})

    // eth_submitHashrate
    describe('when req -> /v1/jsonrpc/{network}/eth_submitHashrate', () => {})
  })
})
