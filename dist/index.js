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

exports.default = function (store) {
  return function (next) {
    return function (action) {
      var dispatch = store.dispatch;

      if (!Object.prototype.hasOwnProperty.call(action, 'ajax')) {
        return next(action);
      }
      dispatch(start(action));
      var request = _ajaxNightmare2.default.make(action.ajax.route, action.ajax.options);
      var promise = request.result().then(function (response) {
        dispatch(success(action, response));
        return response;
      }, function (error) {
        dispatch(catchError(action, error));
        throw error;
      });
      request.result = function () {
        return promise;
      };
      return request;
    };
  };
};
