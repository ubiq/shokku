import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import fs from 'fs'
import Ganache from 'ganache-core'
import _ from 'lodash'
import solc from 'solc'
import request from 'supertest'
import Web3 from 'web3'
import { formatters } from 'web3-core-helpers'
import { ApplicationModule } from './../src/app.module'

const xtest = xit

const networks = ['mainnet', 'testnet']

const expectStandardErrorResponse = r => {
  expect(r.body).to.be.an('object')
  expect(r.body.code).to.be.a('number').that.equal(400)
  expect(r.body.message).to.be.a('string')
}

const expectStandardErrorNotFoundResponse = r => {
  expect(r.body).to.be.an('object')
  expect(r.body.code).to.be.a('number').that.equal(404)
  expect(r.body.message).to.be.a('string').that.equals('Invalid URL requested')
}

const expectStandardResponse = r => {
  expect(r.body).to.be.an('object')
  expect(r.body.id).to.be.a('number')
  expect(r.body.jsonrpc).to.be.a('string').that.equals('2.0')
}

class Ganacher {

  private opts: object
  private server: any
  private contracts: object
  private blocks: object
  private web3: Web3

  constructor() {
    this.opts = {
      network_id: 88,
      hdPath: "m/44'/108'/0'/0/",
      nmemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      locked: false,
      gasPrice: '0x4A817C800',
      accounts: [{
        address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
        secretKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
        balance: formatters.toWei('100000', 'ether')
      },
      {
        address: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
        secretKey: '0xf9b2d466cfe82a6e9209bb87dd0de7e63fe893d7625160c9fc663452b52eaa06',
        balance: formatters.toWei('10000', 'ether')
      },
      {
        address: '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
        secretKey: '0x109d8195d7a1b7e00d3538bafc0f23af2c6e6482b8cc780a10264284779a7adb',
        balance: formatters.toWei('1000', 'ether')
      }
      ]
    }
    this.server = Ganache.server(this.opts)
    this.contracts = {}
    this.blocks = {}
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server.listen(process.env.API_TESTS_GANACHE_PORT || 8588, err => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  close() {
    this.server.close()
  }

  async setupBlockchain() {
    // Connect to Ganache
    const domain = `${process.env.API_TESTS_GANACHE_HOST}:${process.env.API_TESTS_GANACHE_PORT}`
    this.web3 = new Web3(new Web3.providers.HttpProvider(domain))

    const accounts = this.opts.accounts

    // Generate fake transactions of money to create at least three blocks
    const tx1 = {
      from: accounts[0].address,
      to: accounts[1].address,
      value: formatters.toWei('1', 'ether')
    }
    await this.web3.eth.sendTransaction(tx1).catch(e => e)

    const tx2 = {
      from: accounts[2].address,
      to: accounts[1].address,
      value: formatters.toWei('50', 'ether')
    }
    await this.web3.eth.sendTransaction(tx2).catch(e => e)

    const tx3 = {
      from: accounts[2].address,
      to: accounts[0].address,
      value: formatters.toWei('200', 'ether')
    }
    await this.web3.eth.sendTransaction(tx3).catch(e => e)

    if (process.env.API_TESTS_GANACHE_COMPILE_SC === 'true') {
      // Compile BeerToken smart contract
      const inputs = {}
      const contracts = ['BeerToken.sol', 'SafeMath.sol', 'StandardToken.sol', 'ERC20.sol', 'ERC20Basic.sol', 'BasicToken.sol']
      contracts.forEach(contract => {
        inputs[contract] = fs.readFileSync(`${__dirname}/contracts/${contract}`, 'utf8')
      })
      const out = solc.compile({
        sources: inputs
      }, 1)

      const bytecode = out.contracts['BeerToken.sol:BeerToken'].bytecode
      const abi = JSON.parse(out.contracts['BeerToken.sol:BeerToken'].interface)

      this.contracts = {
        beer: {
          bytecode,
          abi
        }
      }
    } else {
      this.contracts = JSON.parse(fs.readFileSync(`${__dirname}/contracts/beer-precompiled.json`, 'utf8'))
      this.contracts.beer.bytecode = this.contracts.beer.bytecode.join('')
    }

    // Deploy the smart contract to the blockchain
    await this.web3.eth.sendTransaction({
      from: accounts[0].address,
      data: this.contracts.beer.bytecode,
      gas: '0x47E7C4'
    })

    this.blocks = {
      latest: await this.web3.eth.getBlock('latest')
    }
  }

  mainAddress() {
    return this.opts.accounts[0].address
  }

  latestBlock() {
    return this.blocks.latest
  }
}

xdescribe('jsonrpc.controller e2e tests', () => {
  let app: INestApplication
  let server
  let ganacher: Ganacher

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile()

    app = moduleFixture.createNestApplication();
    await app.init()

    server = app.getHttpServer()

    if (process.env.API_ENABLE_GANACHE === 'true') {
      ganacher = new Ganacher()
      await ganacher.start()
      await ganacher.setupBlockchain()
    }
  })

  afterAll(() => {
    if (ganacher) {
      ganacher.close()
    }
  })

  describe('rpc listing methods calls', () => {
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
    describe('web3_clientVersion', () => {
      describe('when req -> /v1/jsonrpc/{network}/web3_clientVersion', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/web3_clientVersion`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('string')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/web3_clientVersion?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('net_version', () => {
      describe('when req -> /v1/jsonrpc/{network}/net_version', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/net_version`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('string')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/net_version?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('net_listening', () => {
      describe('when req -> /v1/jsonrpc/{network}/net_listening', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/net_listening`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('boolean')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/net_listening?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('web3_clientVersion', () => {
      describe('when req -> /v1/jsonrpc/{network}/web3_clientVersion', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/web3_clientVersion`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('string')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/web3_clientVersion?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('net_peerCount', () => {
      describe('when req -> /v1/jsonrpc/{network}/net_peerCount', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/net_peerCount`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/net_peerCount?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('eth_protocolVersion', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_protocolVersion', () => {
        test('resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_protocolVersion`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('string')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_protocolVersion?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('eth_syncing', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_syncing', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_syncing`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(e => _.isObject(e) || _.isBoolean(e))
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_syncing?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('eth_mining', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_mining', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_mining`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('boolean')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_mining?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('eth_hashrate', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_hashrate', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_hashrate`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_hashrate?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('eth_gasPrice', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_gasPrice', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_gasPrice`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('string').that.equals('0x4A817C800')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_gasPrice?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('string').that.equals('0x4A817C800')
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
    })

    describe('eth_accounts', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_accounts', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_accounts`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('array')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_accounts?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('eth_blockNumber', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_blockNumber', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_blockNumber`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_blockNumber?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('eth_getBalance', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getBalance', () => {
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

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57"]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [latest, 0x627306090abaB3A6e1400e9345bC60c78a8BEf57] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["latest", "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"]`)
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

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57, earliest] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "earliest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.an('string').that.equals('0x152d02c7e14af6800000')
          }
        })

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57, latest] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "latest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.an('string').that.equals('0x152cf4aec6e8c44e3000')
          }
        })

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57, pending] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "pending"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.an('string').that.equals('0x152cf4aec6e8c44e3000')
          }
        })

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57, 0x2] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBalance?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "0x2"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.an('string').that.equals('0x152cf4aec6e8c44e3000')
          }
        })
      })
    })

    describe('eth_getStorageAt', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getStorageAt', () => {
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

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })
      })
    })

    describe('eth_getTransactionCount', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getTransactionCount', () => {
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

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57"]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [latest, 0x627306090abaB3A6e1400e9345bC60c78a8BEf57] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["latest", "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"]`)
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

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57, 0x0] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "0x0"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57, latest] | rresp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "latest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57, earliest] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "earliest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })

        test('params [0x627306090abaB3A6e1400e9345bC60c78a8BEf57, pending] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionCount?params=["0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "pending"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })
      })
    })

    describe('eth_getBlockTransactionCountByHash', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getBlockTransactionCountByHash', () => {
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

        test('params [0xe626531b181a0c8279fe0a03081ed866fc647e4c893403e8d9671a43a6431a8f] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByHash?params=["0xe626531b181a0c8279fe0a03081ed866fc647e4c893403e8d9671a43a6431a8f"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })
      })
    })

    describe('eth_getBlockTransactionCountByNumber', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getBlockTransactionCountByNumber ', () => {
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

        test('params [0x2] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["0x2"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })

        test('params [earliest] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["earliest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })

        test('params [latest] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["latest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })

        test('params [pending] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockTransactionCountByNumber?params=["pending"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })
      })
    })

    describe('eth_getUncleCountByBlockHash', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getUncleCountByBlockHash', () => {
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

        // Ganache doesn't support this method
        xtest('params [latest block hash] | resp -> 200', async () => {
          for (const network of networks) {
            const hash = ganacher.latestBlock().hash
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockHash?params=["${hash}"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })
      })
    })

    describe('eth_getUncleCountByBlockNumber', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getUncleCountByBlockNumber', () => {
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

        // Ganache doesn't support this method yet
        xtest('params [0xe8] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getUncleCountByBlockNumber?params=["0xe8"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })
      })
    })

    describe('eth_getCode', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getCode', () => {
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

        // Ganache doesn't support this method with param earliest (but returns ok)
        test('params [0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef, earliest] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getCode?params=["0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef", "earliest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })

        test('params [0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef, latest] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getCode?params=["0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef", "latest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })

        // Ganache doesn't support this method with param earliest (but returns ok)
        test('params [0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef, pending] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getCode?params=["0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef", "pending"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })

        test('params [0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef, 0x2] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getCode?params=["0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef", "0x2"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x') || n === '')
          }
        })
      })
    })

    describe('eth_call', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_call', () => {
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

        test('params [{to: 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef}] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_call?params=[{"to": "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"}]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test(
          'params ' +
          '[{to: 0xb60e8dd61c5d32be8058bb8eb970870f07233155, invalidkey: 0xb60e8dd61c5d32be8058bb8eb970870f07233155}, earliest] | ' +
          'resp -> 400',
          async () => {
            for (const network of networks) {
              const url = [
                `/v1/jsonrpc/${network}/eth_call?params=`,
                '[{"to": "0xb60e8dd61c5d32be8058bb8eb970870f07233155", "invalidkey": "0xb60e8dd61c5d32be8058bb8eb970870f07233155"}, "earliest"]'
              ].join('')
              const r = await request(server)
                .get(url)
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

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })

        test('params [{to: 0xb60e8dd61c5d32be8058bb8eb970870f07233155}, latest] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_call?params=[{"to": "0xb60e8dd61c5d32be8058bb8eb970870f07233155"}, "latest"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })

        test('params [{to: 0xb60e8dd61c5d32be8058bb8eb970870f07233155}, pending] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_call?params=[{"to": "0xb60e8dd61c5d32be8058bb8eb970870f07233155"}, "pending"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.satisfy(n => _.isNumber(n) || _.startsWith(n, '0x'))
          }
        })
      })
    })

    describe('eth_getBlockByHash', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getBlockByHash', () => {
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

        test('params [latest block hash, true] | resp -> 200', async () => {
          const blockHash = ganacher.latestBlock().hash
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByHash?params=["${blockHash}", true]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
          }
        })

        test('params [latest block hash, false] | resp -> 200', async () => {
          const blockHash = ganacher.latestBlock().hash
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByHash?params=["${blockHash}", false]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
          }
        })
      })
    })

    describe('eth_getBlockByNumber', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getBlockByNumber', () => {
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

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
            expect(r.body.result.number).to.be.a('string').that.equals('0x0')
          }
        })

        test('params [earliest, false] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["earliest", "false"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
            expect(r.body.result.number).to.be.a('string').that.equals('0x0')
          }
        })

        test('params [latest, true] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["latest", "true"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
            expect(r.body.result.number).to.be.a('string').that.equals('0x2')
          }
        })

        test('params [latest, false] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["latest", "false"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
            expect(r.body.result.number).to.be.a('string').that.equals('0x2')
          }
        })

        test('params [pending, true] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["pending", "true"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
            expect(r.body.result.number).to.be.a('string').that.equals('0x2')
          }
        })

        test('params [pending, false] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["pending", "false"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
            expect(r.body.result.number).to.be.a('string').that.equals('0x2')
          }
        })

        test('params [0x2, false] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["0x2", "false"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
            expect(r.body.result.number).to.be.a('string').that.equals('0x2')
          }
        })

        test('params [0x2, true] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getBlockByNumber?params=["0x2", "true"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
            expect(r.body.result.number).to.be.a('string').that.equals('0x2')
          }
        })
      })
    })

    describe('eth_getTransactionByHash', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByHash', () => {
        test('no params | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByHash`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByHash?params=[]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [invalid] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByHash?params=["invalid"]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [block tx hash] | resp -> 200', async () => {
          const txHash = ganacher.latestBlock().hash
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByHash?params=["${txHash}"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
          }
        })
      })
    })

    describe('eth_getTransactionByBlockHashAndIndex', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByBlockHashAndIndex', () => {
        test('no params | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockHashAndIndex`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })
      })

      describe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByBlockHashAndIndex', () => {
        test('params [] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockHashAndIndex?params=[]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })
      })

      describe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByBlockHashAndIndex', () => {
        test('params [invalid] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockHashAndIndex?params=["invalid"]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })
      })

      describe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByBlockHashAndIndex', () => {
        test('params [block hash, 0x0] | resp -> 200', async () => {
          const txHash = ganacher.latestBlock().hash
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockHashAndIndex?params=["${txHash}", "0x0"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
          }
        })
      })
    })

    describe('eth_getTransactionByBlockNumberAndIndex', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getTransactionByBlockNumberAndIndex', () => {
        test('no params | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockNumberAndIndex`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockNumberAndIndex?params=[]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [invalid] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockNumberAndIndex?params=["invalid"]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        // Ganache doesn't support earliest
        xtest('params [earliest, 0x0] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockNumberAndIndex?params=["earliest", "0x0"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
          }
        })

        test('params [pending, 0x0] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockNumberAndIndex?params=["pending", "0x0"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.an('object')
            expect(r.body.result.blockNumber).to.be.a('string').that.equals('0x02')
          }
        })

        test('params [latest, 0x0] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockNumberAndIndex?params=["latest", "0x0"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.an('object')
            expect(r.body.result.blockNumber).to.be.a('string').that.equals('0x02')
          }
        })

        test('params [0x2, 0x0] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionByBlockNumberAndIndex?params=["0x2", "0x0"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.an('object')
            expect(r.body.result.blockNumber).to.be.a('string').that.equals('0x02')
          }
        })
      })
    })

    describe('eth_getTransactionReceipt', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getTransactionReceipt', () => {
        test('no params | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionReceipt`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionReceipt?params=[]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [invalid] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionReceipt?params=["invalid"]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [tx hash] | resp -> 200', async () => {
          const txHash = ganacher.latestBlock().hash
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getTransactionReceipt?params=["${txHash}"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('object')
          }
        })
      })
    })

    describe('eth_getUncleByBlockHashAndIndex', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getUncleByBlockHashAndIndex', () => {
        test('no params | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getUncleByBlockHashAndIndex`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getUncleByBlockHashAndIndex?params=[]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [invalid] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getUncleByBlockHashAndIndex?params=["invalid"]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        // Ganache doesn't support this method yet
        xtest('params [tx hash, 0x0] | resp -> 200', async () => {
          const hash = ganacher.latestBlock().hash
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getUncleByBlockHashAndIndex?params=["${hash}", "0x0"]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
          }
        })
      })
    })

    describe('eth_getUncleByBlockNumberAndIndex', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getUncleByBlockNumberAndIndex', () => {
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
    })

    describe('eth_getCompilers', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getCompilers', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getCompilers`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.a('array')
          }
        })

        test('params [] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getCompilers?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
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
    })

    describe('eth_getLogs', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getLogs', () => {
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

        test('params [{topics: [0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b], invalid: "0x0"}] | resp -> 400', async () => {
          for (const network of networks) {
            const url = [
              `/v1/jsonrpc/${network}/eth_getLogs?params=`,
              '[{"topics": ["0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b"], "invalid": "0x0"}]'
            ].join('')
            const r = await request(server)
              .get(url)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('params [{topics: [0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b]}] | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getLogs?params=[{"topics": ["0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b"]}]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
            expect(r.body.result).to.be.an('array')
          }
        })
      })
    })

    // Ganache doesn't support this method
    xdescribe('eth_getWork', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_getWork', () => {
        test('no params | resp -> 200', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getWork`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
          }
        })

        test('params [] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getWork?params=[]`)
              .expect('Content-Type', /json/)
              .expect(200)

            expectStandardResponse(r)
          }
        })

        test('params [invalid] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .get(`/v1/jsonrpc/${network}/eth_getWork?params=["invalid"]`)
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })
      })
    })
  })

  describe('rpc POST calls', () => {
    describe('eth_sendRawTransaction', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_sendRawTransaction', () => {
        test('no params | resp -> 404', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}/eth_sendRawTransaction`)
              .expect('Content-Type', /json/)
              .expect(404)

            expectStandardErrorNotFoundResponse(r)
          }
        })
      })

      describe('when req -> /v1/jsonrpc/{network}/ | body: eth_sendRawTransaction', () => {
        test('body [method] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}/`)
              .send({
                method: 'eth_sendRawTransaction'
              })
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('body [id, method] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}`)
              .send({
                id: 1,
                method: 'eth_sendRawTransaction'
              })
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('body [id, jsonrpc, method] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}`)
              .send({
                id: 1,
                jsonrpc: '2.0',
                method: 'eth_sendRawTransaction'
              })
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('body [id, jsonrpc, method, no params] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}`)
              .send({
                id: 1,
                jsonrpc: '2.0',
                method: 'eth_sendRawTransaction',
                params: []
              })
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })
      })
    })

    describe('eth_estimateGas', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_estimateGas', () => {
        test('no params | resp -> 404', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}/eth_estimateGas`)
              .expect('Content-Type', /json/)
              .expect(404)
            expectStandardErrorNotFoundResponse(r)
          }
        })
      })

      describe('when req -> /v1/jsonrpc/{network}/ | body: eth_estimateGas', () => {
        test('body [method] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}/`)
              .send({
                method: 'eth_estimateGas'
              })
              .expect('Content-Type', /json/)
              .expect(400)
            expectStandardErrorResponse(r)
          }
        })

        test('body [id, method] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}`)
              .send({
                id: 1,
                method: 'eth_estimateGas'
              })
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })
      })
    })

    describe('eth_submitWork', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_submitWork', () => {
        test('no params | resp -> 404', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}/eth_submitWork`)
              .expect('Content-Type', /json/)
              .expect(404)
            expectStandardErrorNotFoundResponse(r)
          }
        })

        describe('when req -> /v1/jsonrpc/{network}/ | body: eth_submitWork', () => {
          test('body [method] | resp -> 400', async () => {
            for (const network of networks) {
              const r = await request(server)
                .post(`/v1/jsonrpc/${network}/`)
                .send({
                  method: 'eth_submitWork'
                })
                .expect('Content-Type', /json/)
                .expect(400)

              expectStandardErrorResponse(r)
            }
          })

          test('body [id, method] | resp -> 400', async () => {
            for (const network of networks) {
              const r = await request(server)
                .post(`/v1/jsonrpc/${network}`)
                .send({
                  id: 1,
                  method: 'eth_submitWork'
                })
                .expect('Content-Type', /json/)
                .expect(400)

              expectStandardErrorResponse(r)
            }
          })
        })
      })
    })

    describe('eth_submitHashrate', () => {
      describe('when req -> /v1/jsonrpc/{network}/eth_submitHashrate', () => {
        test('no params | resp -> 404', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}/eth_submitHashrate`)
              .expect('Content-Type', /json/)
              .expect(404)

            expectStandardErrorNotFoundResponse(r)
          }
        })
      })

      describe('when req -> /v1/jsonrpc/{network}/ | body: eth_submitHashrate', () => {
        test('body [method] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}/`)
              .send({
                method: 'eth_submitHashrate'
              })
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })

        test('body [id, method] | resp -> 400', async () => {
          for (const network of networks) {
            const r = await request(server)
              .post(`/v1/jsonrpc/${network}`)
              .send({
                id: 1,
                method: 'eth_submitHashrate'
              })
              .expect('Content-Type', /json/)
              .expect(400)

            expectStandardErrorResponse(r)
          }
        })
      })
    })
  })
})
