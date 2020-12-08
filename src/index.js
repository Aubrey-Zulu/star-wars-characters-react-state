import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import dummyData from './dummy-data';
import endpoint from './endpoint';

import './styles.scss';

const LOADING = 'LOADING';
const RESPONSE_COMPLETE = 'RESPONSE_COMPLETE';
const ERROR = 'ERROR';

const initialState = {
  response: null,
  loading: true,
  error: null,
};

const fetchReducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        response: null,
        loading: true,
        error: null,
      };
    case RESPONSE_COMPLETE:
      return {
        response: action.payload.response,
        loading: false,
        error: null,
      };
    case ERROR:
      return {
        response: null,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

const useFetch = (url) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    dispatch({ type: LOADING });
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        dispatch({
          type: RESPONSE_COMPLETE,
          payload: {
            response: response,
          },
        });
      })
      .catch((error) => {
        dispatch({ type: ERROR, payload: { error } });
      });
  }, [url]);

  return [state.response, state.loading, state.error];
};

const Application = () => {
  const [response, loading, error] = useFetch(endpoint + '/characters');
  const characters = (response && response.characters) || [];

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading ? (
            <p className="loading">Loading…</p>
          ) : (
            <CharacterList characters={characters} />
          )}
          {error && <p className="error">{error.message}</p>}
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
