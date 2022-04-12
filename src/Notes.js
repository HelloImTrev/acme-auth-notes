import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Notes = () => {

  const auth = useSelector(state => state.auth);
  const notes = useSelector(state => state.notes);
  console.log('STATE:', notes);

  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        <h4>{auth.username}'s notes</h4>
        <ul>
          {notes.map(note => {
            return(
              <li key={note.id}>{note.txt}</li>
            )
          })}
        </ul>
      </div>
    </div>
  );
};

export default connect()(Notes);
