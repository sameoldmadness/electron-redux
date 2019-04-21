

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = exports.forwardToMainWithParams = void 0;

const _electron = require('electron');

const _validateAction = _interopRequireDefault(require('../helpers/validateAction'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// eslint-disable-next-line consistent-return, no-unused-vars
const forwardToMainWithParams = function forwardToMainWithParams() {
  const params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (store) {
    return function (next) {
      return function (action) {
        let _params$blacklist = params.blacklist,
          blacklist = _params$blacklist === void 0 ? [] : _params$blacklist;
        if (!(0, _validateAction.default)(action)) return next(action);
        if (action.meta && action.meta.scope === 'local') return next(action);

        if (
          blacklist.some(rule => rule.test(action.type))
        ) {
          return next(action);
        } // stop action in-flight

        _electron.ipcRenderer.send('redux-action', action);
      };
    };
  };
};

exports.forwardToMainWithParams = forwardToMainWithParams;
const forwardToMain = forwardToMainWithParams({
  blacklist: [/^@@/, /^redux-form/],
});
const _default = forwardToMain;
exports.default = _default;
