const express = require('express');
const path = require('path');
const fs = require('fs');
let notes = require('./db/db.json');
const uuid = require('./helpers/uuid.js');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET/api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  res.json(notes);
  console.log(notes);
});

//GET /notes should return the notes.html file.
app.get('/notes', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'public', 'notes.html'))
);

//GET * should return the index.html file.
app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
);

//POST/api/notes should receive a new note to save on the request body
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
  
    const { title, text } = req.body;
    if (title && text) {
      
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
    //add it to the db.json file
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            notes= JSON.parse(data);
            notes.push(newNote);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(notes, null, 4),
                (writeErr) =>
                  writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
            );
        }
    });
    //return the new note to the client
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
      return;
    } else {
      res.status(500).json('Error in posting note');
    }
  });


//DELETE/api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete('/api/notes/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  console.info(`${req.method} request received to delete note with id ${noteId}`);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
       console.error(err);
       res.status(500).json('Error reading notes from database');
       return;
    }

    let notes = JSON.parse(data);
    const index = notes.findIndex((note) => note.note_id === noteId);

    if (index !== -1) {
      notes.splice(index,1);
      fs.writeFile(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notes, null, 4),
        (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            res.status(500).json('Error updating notes in database');
          } else {
            console.info('Successfully updated notes');
            res.status(200).json('Successfully deleted note');
          }
        }
      );
    } else {
      res.status(404).json('Note not found');
    }
  });
});


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);