const express = require('express');
const app = express();
app.use(express.json());
const { models: { User, Note }} = require('./db');
const path = require('path');

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.delete('/api/notes/:id', async(req, res, next) => {
  try {
    const user = await User.byToken(req.headers.authorization);
    if(user) {
      const noteToDelete = await Note.findByPk(req.params.id);
      await noteToDelete.destroy();
  
      res.sendStatus(204);
    }
  } catch(e) {
    next(e);
  }
});

app.post('/api/auth', async(req, res, next)=> {
  try {
    res.send({ token: await User.authenticate(req.body)});
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/notes', async (req, res, next) => {
  try {
    const user = await User.byToken(req.headers.authorization);

    if(user) {
      const newNote = await Note.create(req.body);
      res.status(201).send(newNote);
    }
  } catch(e) {
    next(e);
  }
});

app.get('/api/auth', async(req, res, next)=> {
  try {
    res.send(await User.byToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/purchases', async(req, res, next)=> {
  try {
    const user = await User.byToken(req.headers.authorization);
    res.send('TODO Send the purchases for this user');
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/notes', async(req, res, next) => {
  try {
    const user = await User.byToken(req.headers.authorization);

    const notes = await Note.findAll({
      where: {
        userId: user.id
      }
    })
    res.send(notes);
  } catch(e) {
    next(e);
  }
  
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
