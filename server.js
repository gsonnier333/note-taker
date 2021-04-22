// Dependencies

const express = require('express');
const path = require('path');
const fs = require("fs");

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//routes

app.get("/", (req, res) => {res.sendFile(path.join(__dirname, "./public/index.html"))});
app.get("/notes", (req, res) => {res.sendFile(path.join(__dirname, "./public/notes.html"))});

app.get("/api/notes", (req, res) =>{
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if(err){
            console.error(err);
            return;
        }
        res.json(data);
    })
});
app.delete("/api/notes/:id", (req, res)=>{
    const delId = parseInt(req.params.id);
    fs.readFile("./db/db.json", "utf8", (err, data)=>{
        if(err){
            console.error(err);
            return;
        }
        const notes = JSON.parse(data);
        let updated = notes; //create a mutable array to write after deleting the correct element
        let delIndex = 0;
        for(let i = 0; i<notes.length; i++){
            if(notes[i].id === delId){
                delIndex = i;
                console.log("found at " + delIndex);
                break; //we found the index of our item, break out of the loop
            }
            else{
                console.log("searching");
            }
        }
        
        updated.splice(delIndex, 1); //remove the appropriate item
        
        fs.writeFile("./db/db.json", JSON.stringify(updated), er => {
            if(er){
                console.error(er);
                return;
            }
            console.log("Deleted id " + delId + " at index " + delIndex);
            res.json(updated);
        })
    })
})
app.post("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if(err){
            console.error(err);
            return;
        }
        const notes = JSON.parse(data);
        let newNote = req.body;
        if(notes.length > 0){
            let lastId = notes[notes.length-1].id;
            newNote.id = lastId + 1; //give a new id, +1
        }
        else{
            newNote.id = 1; //start at 1 instead of 0 or the index.js code won't recognize it when trying to display it individually
        }
        notes.push(req.body);
        fs.writeFile("./db/db.json", JSON.stringify(notes), er => {
            if(er){
                console.error(er);
                return;
            }
            console.log("Success!");
            res.json(notes);
        })
    })
})

//start listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));