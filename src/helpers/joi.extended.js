/* eslint-disable import/no-named-default */

import { default as J } from 'joi'
import _ from 'helpers/lodash.mixins'

const Joi = J.extend({
  name: 'eth',
  base: J.string().trim(),
  language: {
    isAddress: 'needs to be a correct ethereum address or tx hash or block tag'
  },
  rules: [{
    name: 'isAddress',
    validate(params, value, state, options) {
      if (!_.isAddress(value)) {
        return this.createError('invalid ethereum address passed', {
          v: value
        }, state, options)
      }
      return value
    }
  }, {
    name: 'isTxHash',
    validate(params, value, state, options) {
      if (!_.isTxHash(value)) {
        return this.createError('invalid ethereum tx hash passed', {
          v: value
        }, state, options)
      }
      return value
    }
  }, {
    name: 'isBlockTagOrHex',
    validate(params, value, state, options) {
      if (!_.isBlockTagOrHex(value)) {
        return this.createError('invalid ethereum block tag or hexadecimal passed', {
          v: value
        }, state, options)
      }
      return value
    }
  }, {
    name: 'isHex',
    validate(params, value, state, options) {
      if (!_.isHex(value)) {
        return this.createError('invalid hexadecimal passed', {
          v: value
        }, state, options)
      }
      return value
    }
  }]
})

const Schemas = {
  Filter: Joi.object().keys({
    fromBlock: Joi.eth().isBlockTagOrHex(),
    toBlock: Joi.eth().isBlockTagOrHex(),
    address: [Joi.eth().isAddress(), Joi.array().items(Joi.eth().isAddress())],
    topics: Joi.array().items(Joi.eth().isTxHash(), Joi.allow(null))
  }),

  SendTx: Joi.object().keys({
    from: Joi.eth().isAddress(),
    to: Joi.eth().isAddress().required(),
    gas: Joi.eth().isHex(),
    gasPrice: Joi.eth().isHex(),
    value: Joi.eth().isHex(),
    data: Joi.string()
  })
}

export {
  Joi,
  Schemas
}
