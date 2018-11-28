'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ajaxNightmare = require('ajax-nightmare');

var _ajaxNightmare2 = _interopRequireDefault(_ajaxNightmare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var START = '/START';
var SUCCESS = '/SUCCESS';
var ERROR = '/ERROR';

var start = function start(action) {
  return {
    type: '' + action.type + START,
    data: action.ajax.data
  };
};

var success = function success(action, payload) {
  return {
    type: '' + action.type + SUCCESS,
    payload: payload,
    data: action.ajax.data
  };
};

var catchError = function catchError(action, payload) {
  return {
    type: '' + action.type + ERROR,
    payload: payload,
    data: action.ajax.data
  };
};

var reduxNightmare = function reduxNightmare(_ref) {
  var dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      if (!Object.prototype.hasOwnProperty.call(action, 'ajax')) {
        return next(action);
      }
      dispatch(start(action));
      var request = _ajaxNightmare2.default.make(action.ajax.route, action.ajax.options);
      request.result().then(function (response) {
        return dispatch(success(action, response));
      }).catch(function (error) {
        return dispatch(catchError(action, error));
      });
      return request;
    };
  };
};

exports.default = reduxNightmare;