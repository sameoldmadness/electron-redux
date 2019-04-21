

const _electron = require('electron');

const _forwardToMain = _interopRequireWildcard(require('../forwardToMain'));

const _validateAction = _interopRequireDefault(require('../../helpers/validateAction'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  const newObj = {};
  if (obj != null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {};
        if (desc.get || desc.set) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
  }
  newObj.default = obj;
  return newObj;
}

jest.unmock('../forwardToMain');
describe('forwardToMain', () => {
  beforeEach(() => {
    _validateAction.default.mockReturnValue(true);
  });
  it("should pass an action through if it doesn't pass validation (FSA)", () => {
    const next = jest.fn(); // thunk action

    const action = function action() {};

    _validateAction.default.mockReturnValue(false);

    (0, _forwardToMain.default)()(next)(action);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
  it('should pass an action through if it starts with @@', () => {
    const next = jest.fn();
    const action = {
      type: '@@SOMETHING',
    };
    (0, _forwardToMain.default)()(next)(action);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
  it('should pass an action through if it starts with redux-form', () => {
    const next = jest.fn();
    const action = {
      type: 'redux-form',
    };
    (0, _forwardToMain.default)()(next)(action);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
  it('should pass an action through if the scope is local', () => {
    const next = jest.fn();
    const action = {
      type: 'MY_ACTION',
      meta: {
        scope: 'local',
      },
    };
    (0, _forwardToMain.default)()(next)(action);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
  it('should forward any actions to the main process', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
      },
    };
    (0, _forwardToMain.default)()(next)(action);
    expect(_electron.ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(_electron.ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);
    expect(next).toHaveBeenCalledTimes(0);
  });
});
describe('forwardToMainWithParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    _validateAction.default.mockReturnValue(true);
  });
  it('should forward an action through if it starts with @@', () => {
    const next = jest.fn();
    const action = {
      type: '@@SOMETHING',
    };
    (0, _forwardToMain.forwardToMainWithParams)()()(next)(action);
    expect(_electron.ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(_electron.ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);
    expect(next).toHaveBeenCalledTimes(0);
  });
  it('should forward an action through if it starts with redux-form', () => {
    const next = jest.fn();
    const action = {
      type: 'redux-form',
    };
    (0, _forwardToMain.forwardToMainWithParams)()()(next)(action);
    expect(_electron.ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(_electron.ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);
    expect(next).toHaveBeenCalledTimes(0);
  });
  it('should pass an action through if it is blacklisted', () => {
    const next = jest.fn();
    const action = {
      type: '@@SOMETHING',
    };
    (0, _forwardToMain.forwardToMainWithParams)({
      blacklist: [/^@@/],
    })()(next)(action);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
});
