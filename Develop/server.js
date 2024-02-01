const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('./db/db.json');
const uuid = require('./helpers/uuid.js');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

//GET /notes should return the notes.html file.
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET * should return the index.html file.
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET/api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => res.json(noteData));

//POST/api/notes should receive a new note to save on the request body
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
  
    const { title, textarea } = req.body;
    if (title && textarea) {
      
      const newNoteData = {
        title,
        textarea,
        note_id: uuid(),
      };
    //add it to the db.json file
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes= JSON.parse(data);
            parsedNotes.push(newNoteData);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
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
        body: newNoteData,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });


//DELETE/api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete('/api/notes/:note_id', (req, res) => {
    if (req.params.note_if) {
        console.info(`${req.method} request received to delete a note`);
        const noteId = req.params.note_id;
        for (let i=0; i<noteData.length; i++) {
            const currentNote= noteData[i];
            if (currentNote.note_id === noteId){
                noteData.splice(i, 1);
            }
        }
        res.status(200).send('Note deleted');
    } else {
        res.status(404).send('Note not found');
    }
});

app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);