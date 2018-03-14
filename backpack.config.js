const path = require('path')
const _ = require('lodash')

module.exports = {
  webpack: config => {
    const c = _.clone(config)
    c.entry.main = [
      path.resolve('./src/app.js')
    ]
    c.resolve.modules = [
      path.resolve('./node_modules'),
      path.resolve('./node_modules/backpack-core/node_modules')
    ]
    return c
  }
}
