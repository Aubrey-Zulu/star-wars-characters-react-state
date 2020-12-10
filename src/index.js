import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import endpoint from './endpoint';

import './styles.scss';
// fetch actions
const FETCHING = 'FETCHING';
const ERROR = 'ERROR';
const RESPONSE_COMPLETE = 'RESPONSE_COMPLETE';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCHING:
      return {
        characters: [],
        loading: true,
        error: null,
      };
    case ERROR:
      return {
        characters: [],
        loading: false,
        error: action.payload.error,
      };
    case RESPONSE_COMPLETE:
      return {
        characters: action.payload.characters,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  error: null,
  loading: false,
  characters: [],
};

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = (action) =>
    typeof action === 'function' ? action(dispatch) : dispatch(action);

  return [state, enhancedDispatch];
};

const fetchCharacters = (dispatch) => {
  dispatch({ type: FETCHING });
  fetch(endpoint + '/characters')
    .then((response) => response.json())
    .then((response) =>
      dispatch({
        type: RESPONSE_COMPLETE,
        payload: { characters: response.characters },
      }),
    )
    .catch((error) => dispatch({ type: ERROR, payload: { error } }));
};

const Application = () => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters } = state;

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button
            onClick={() => {
              dispatch(fetchCharacters);
            }}
          >
            Fetch Characters
          </button>
          <CharacterList characters={characters} />
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
