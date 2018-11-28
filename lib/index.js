import Ajax from 'ajax-nightmare';

const START = '/START';
const SUCCESS = '/SUCCESS';
const ERROR = '/ERROR';

const start = action => ({
  type: `${action.type}${START}`,
  data: action.ajax.data,
});

const success = (action, payload) => ({
  type: `${action.type}${SUCCESS}`,
  payload,
  data: action.ajax.data,
});

const catchError = (action, payload) => ({
  type: `${action.type}${ERROR}`,
  payload,
  data: action.ajax.data,
});

const reduxNightmare = ({ dispatch }) => next => (action) => {
  if (!Object.prototype.hasOwnProperty.call(action, 'ajax')) {
    return next(action);
  }
  dispatch(start(action));
  const request = Ajax.make(action.ajax.route, action.ajax.options);
  request.result()
    .then(response => dispatch(success(action, response)))
    .catch(error => dispatch(catchError(action, error)));
  return request;
};

export default reduxNightmare;
