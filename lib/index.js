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

export default store => next => (action) => {
  const { dispatch } = store;
  if (!Object.prototype.hasOwnProperty.call(action, 'ajax')) {
    return next(action);
  }
  dispatch(start(action));
  const request = Ajax.make(action.ajax.route, action.ajax.options);
  const promise = request.result().then(
    (response) => {
      dispatch(success(action, response));
      return response;
    },
    (error) => {
      dispatch(catchError(action, error));
      throw error;
    },
  );
  request.result = () => promise;
  return request;
};
