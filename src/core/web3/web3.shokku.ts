import { errors } from 'web3-core-helpers'
import Method from 'web3-core-method'

/** Override basic web3 'Method' class to allow having better params validation */
export class Web3Method extends Method {
  constructor(options) {
    super(options)
    super.validate = options.validate || (() => true)
    super.schema = options.schema || {}
  }

  validateArgs(args: Array<any> = []) {
    if (args.length !== super.params) {
      throw errors.InvalidNumberOfParams(args.length, super.params, super.name)
    }

    const result = super.validate(args)
    if (!result) {
      throw errors.InvalidNumberOfParams(args.length, super.params, super.name)
    }
  }

  formatOutput(result) {
    if (super.outputFormatter) {
      return super.outputFormatter(result)
    }
    return result
  }
}
