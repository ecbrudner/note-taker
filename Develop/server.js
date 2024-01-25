const fs = require ('fs');
const express = require ('express');
const path = require ('path');

const PORT = 3001;
const app = express();


//GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//GET * should return the index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//GET/api/notes should read the db.json file and return all saved notes as JSON.

//POST/api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
//give each note a unique id when it's saved

//DELETE/api/notes/:id should receive a query parameter containing the id of a note to delete.