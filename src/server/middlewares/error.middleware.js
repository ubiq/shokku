import _ from 'lodash'

export default (opts = {}, callback) => (req, res, next) => {
  const errorDefaults = _.extend({
    code: 400,
    message: ''
  }, opts)

  const buildErrors = err => {
    let error

    if (_.isString(err)) {
      error = _.extend({}, errorDefaults, {
        message: err
      })
    } else if (_.isPlainObject(err)) {
      error = _.extend({}, errorDefaults, err)
    } else if (_.isError(err)) {
      error = _.extend({}, errorDefaults, {
        code: err.code || 500
      })
    } else if (_.isArray(err)) {
      error = _.map(err, e => buildErrors(e, true))
    } else {
      error = _.extend({}, errorDefaults, {
        message: `Object type: ${typeof err} must strictly be a: String, Object, Error, Array.`
      })
    }

    return error
  }

  res.error = err => {
    const errors = buildErrors(err)
    const code = ((errors.length === 1) ? _.first(errors).code : 400) || 500

    res.status(code).json({
      code,
      message: ((errors.length === 1) ? _.first(errors).message : errors.message)
    })

    if (_.isFunction(callback)) {
      callback(err)
    }
  }

  next()
}
