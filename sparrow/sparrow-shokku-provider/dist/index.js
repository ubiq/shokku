'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchConfigFromReq = undefined;

var _createAsyncMiddleware = require('json-rpc-engine/src/createAsyncMiddleware');

var _createAsyncMiddleware2 = _interopRequireDefault(_createAsyncMiddleware);

var _jsonRpcError = require('json-rpc-error');

var _jsonRpcError2 = _interopRequireDefault(_jsonRpcError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global fetch */

function createInfuraMiddleware(_ref) {
  var _this = this;

  var _ref$network = _ref.network,
      network = _ref$network === undefined ? 'mainnet' : _ref$network;

  return (0, _createAsyncMiddleware2.default)(function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var _fetchConfigFromReq, fetchUrl, fetchParams, response, rawData, msg, error, _msg, _error, _error2, data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _fetchConfigFromReq = fetchConfigFromReq({
                network: network,
                req: req
              }), fetchUrl = _fetchConfigFromReq.fetchUrl, fetchParams = _fetchConfigFromReq.fetchParams;
              _context.next = 3;
              return fetch(fetchUrl, fetchParams);

            case 3:
              response = _context.sent;
              _context.next = 6;
              return response.text();

            case 6:
              rawData = _context.sent;

              if (response.ok) {
                _context.next = 20;
                break;
              }

              _context.t0 = response.status;
              _context.next = _context.t0 === 405 ? 11 : _context.t0 === 418 ? 12 : _context.t0 === 503 ? 15 : _context.t0 === 504 ? 15 : 18;
              break;

            case 11:
              throw new _jsonRpcError2.default.MethodNotFound();

            case 12:
              msg = 'Request is being rate limited.';
              error = new Error(msg);
              throw new _jsonRpcError2.default.InternalError(error);

            case 15:
              _msg = 'Gateway timeout. The request took too long to process.';
              _error = new Error(_msg);
              throw new _jsonRpcError2.default.InternalError(_error);

            case 18:
              _error2 = new Error(rawData);
              throw new _jsonRpcError2.default.InternalError(_error2);

            case 20:
              if (!(req.method === 'eth_getBlockByNumber' && rawData === 'Not Found')) {
                _context.next = 23;
                break;
              }

              res.result = null;
              return _context.abrupt('return');

            case 23:
              data = JSON.parse(rawData);

              res.result = data.result;
              res.error = data.error;

            case 26:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
}

function fetchConfigFromReq(_ref3) {
  var network = _ref3.network,
      req = _ref3.req;
  var method = req.method,
      params = req.params;


  var fetchParams = {};
  var fetchUrl = 'https://api.shokku.com/v1/jsonrpc/' + network;

  var isPostMethod = ['eth_sendRawTransaction'].includes(req.method);
  if (isPostMethod) {
    fetchParams.method = 'POST';
    fetchParams.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    fetchParams.body = JSON.stringify(req);
  } else {
    fetchParams.method = 'GET';
    var paramsString = encodeURIComponent(JSON.stringify(params));
    fetchUrl += '/' + method + '?params=' + paramsString;
  }

  return {
    fetchUrl: fetchUrl,
    fetchParams: fetchParams
  };
}

exports.default = createInfuraMiddleware;
exports.fetchConfigFromReq = fetchConfigFromReq;