import { default as J } from 'joi'
import e from '@/core/validation/eth.fn/eth.fn'

const Joi = J.extend({
  name: 'eth',
  base: J.string().trim(),
  language: {
    isAddress: 'needs to be a correct ethereum address or tx hash or block tag',
  },
  rules: [{
    name: 'isAddress',
    validate(params, value, state, options) {
      if (!e.isAddress(value)) {
        return this.createError('invalid ethereum address passed', {
          v: value,
        }, state, options)
      }
      return value
    },
  }, {
    name: 'isTxHash',
    validate(params, value, state, options) {
      if (!e.isTxHash(value)) {
        return this.createError('invalid ethereum tx hash passed', {
          v: value,
        }, state, options)
      }
      return value
    },
  }, {
    name: 'isBlockTag',
    validate(params, value, state, options) {
      if (!e.isBlockTag(value)) {
        return this.createError('invalid ethereum block tag passed', {
          v: value,
        }, state, options)
      }
      return value
    },
  }, {
    name: 'isHex',
    validate(params, value, state, options) {
      if (!e.isHex(value)) {
        return this.createError('invalid hexadecimal passed', {
          v: value,
        }, state, options)
      }
      return value
    },
  }],
})

const JoiRpcSchemas = {
  Filter: Joi.object().keys({
    fromBlock: [Joi.eth().isBlockTag, Joi.eth().isHex() ],
    toBlock: [Joi.eth().isBlockTag, Joi.eth().isHex() ],
    address: [Joi.eth().isAddress(), Joi.array().items(Joi.eth().isAddress())],
    topics: Joi.array().items(Joi.eth().isTxHash(), Joi.allow(null)),
  }),

  SendTx: Joi.object().keys({
    from: Joi.eth().isAddress(),
    to: Joi.eth().isAddress().required(),
    gas: Joi.eth().isHex(),
    gasPrice: Joi.eth().isHex(),
    value: Joi.eth().isHex(),
    data: Joi.string(),
  }),
}

export default { Joi, JoiRpcSchemas }
