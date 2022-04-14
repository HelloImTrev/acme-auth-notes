import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteNote } from './store';

const Notes = () => {

  const auth = useSelector(state => state.auth);
  const notes = useSelector(state => state.notes);
  const dispatch = useDispatch();

  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        <h4>{auth.username}'s notes</h4>
        <ul>
          {notes.map(note => {
            return(
              <li key={note.id}>{note.txt} <button onClick={() => {dispatch(deleteNote(note))}}>Delete</button></li>
            )
          })}
        </ul>
      </div>
    </div>
  );
};

export default connect()(Notes);
