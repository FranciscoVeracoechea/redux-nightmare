# redux-nightmare
Redux middleware for abortable ajax requests without side effects

## Get Start
    npm install --save redux-nightmare

## Usage
#### ExampleActions.js
the ajax object needs 2 properties "route" and "options" which must have the same characteristics as the constructor parameters of the [ajax-nightmare](https://www.npmjs.com/package/ajax-nightmare) interfaces
```js
export function fetchMovie() {
  return {
    type: 'FETCH_MOVIE',
    ajax: {
      route: 'http://www.omdbapi.com/?i=tt3896198&apikey=a95b5205',
    },
  }
}
```
#### ExampleReducer.js
Once the action is executed, it triggers 3 actions which allow you to manage 3 states of the request. These 3 actions have the same type of the specified action plus "/ START", "/ SUCCESS" and "/ ERROR" depending on the case.
```js
const initialState = { movie: {}, loading: true, error: {} };
const START = '/START';
const SUCCESS = '/SUCCESS';
const ERROR = '/ERROR';

export default function(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_MOVIE' + START:
      return {
        ...state,
        loading: true,
      };
    // the payload contains the result of the promise
    case 'FETCH_MOVIE' + SUCCESS:
      return {
        ...state,
        movie: action.payload,
        loading: false,
      };
    // the payload contains the result of the promise
    case 'FETCH_MOVIE' + ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}
```
#### ExampleComponent.jsx
When executing the action in the component, it returns an intance of [ajax-nightmare](https://www.npmjs.com/package/ajax-nightmare)
```js
// dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
// actions
import * as actions from './ExampleActions';

class ExampleComponent extends Component {
  constructor(props) {
    super(props);
    this.request = {};
  }

  componentDidMount() {
    const { fetchMovie } = this.props;
    this.request = fetchMovie();
    console.log(this.request);
    this.request.result()
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  componentWillUnmount() {
    this.request.abort();
  }

  render() {
    const { loading, movie } = this.props;
    if (loading) {
      return (
        <p>Loading...</p>
      );
    }
    return (
      <div>
        <h2>{movie.Title}</h2>
      </div> 
    );
  }
}

export default connect(state => ({
  loading: state.example.loading,
  movie: state.example.movie,
}), actions)(ExampleComponent);
```