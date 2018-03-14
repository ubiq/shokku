'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createProvider;

var _jsonRpcEngine = require('json-rpc-engine');

var _jsonRpcEngine2 = _interopRequireDefault(_jsonRpcEngine);

var _providerFromEngine = require('eth-json-rpc-middleware/providerFromEngine');

var _providerFromEngine2 = _interopRequireDefault(_providerFromEngine);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createProvider(opts) {
  var engine = new _jsonRpcEngine2.default();
  engine.push((0, _index2.default)(opts));
  return (0, _providerFromEngine2.default)(engine);
}