import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const notes = (state = [], action)=> {
  switch(action.type) {
    case 'GET_NOTES':
      return action.notes;
    case 'DELETE_NOTE':
      return [...state.filter((note) => note.id !== action.note.id)];
    case 'CREATE_NOTE':
      return [...state, action.newNote];
    default:
      return state;
  }
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

const logout = ()=> {
  window.localStorage.removeItem('token');
  return {
    type: 'SET_AUTH',
    auth: {}
  };
};

const deleteNote = (note) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');

    if(token) {
        await axios.delete(`/api/notes/${note.id}`, {
          headers: {
            authorization: token
          }
        });
        dispatch({type:'DELETE_NOTE', note: note})
    }
  }
}

const createNote = (note) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');

    if(token) {
      const newNote = (await axios.post('/api/notes', note, {
        headers: {
          authorization: token
        }
      })).data;

      console.log(newNote);
      dispatch({type:'CREATE_NOTE', newNote})
    }
  }
}

const getNotes =  () => {
  return async(dispatch) => {
    const token = window.localStorage.getItem('token');
    if(token) {
      const res = await axios.get('/api/notes', {
        headers: {
          authorization: token
        }
      });

      console.log('RES:', res);
      dispatch({type: 'GET_NOTES', notes: res.data});
    }
  }
}

const signIn = (credentials)=> {
  return async(dispatch)=> {
    let response = await axios.post('/api/auth', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    return dispatch(attemptLogin());
  }
};

const attemptLogin = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get('/api/auth', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'SET_AUTH', auth: response.data });
    }
  }
};


const store = createStore(
  combineReducers({
    auth,
    notes
  }),
  applyMiddleware(thunk, logger)
);

export { 
  attemptLogin, 
  signIn, 
  logout, 
  getNotes, 
  deleteNote, 
  createNote };

export default store;
