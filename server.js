// 'use strict';

// // application dependencies
// const express = require('express');
// const pg = require('pg');
// const superagent = require('superagent');
// const methodoverride = require('method-override');

// // enviromental variables
// require('dotenv').config();
// const PORT = process.env.PORT;
// const DATABASE_URL = process.env.DATABASE_URL;

// // application setup
// const app = express();
// const client = new pg.Client(DATABASE_URL);

// // express middleware
// app.use(express.urlencoded({ extended: true }))
// app.use(methodoverride('_method'))
// app.use(express.static('./public'))
// app.set('view engine', 'ejs');

// app.get('/home', getAllCharacters);
// app.get('/character/create', renderCreatePage)
// app.get('/character/my-fav-character', getAllFavCharacters);
// app.get('/character/my-characters', getAllCreatedCharacters)
// app.get('/character/:character_id', getCharacterDetails)
// app.post('/favorite-character', saveCharacter);
// app.post('/character/create', createCharacter);
// app.put('/character/:character_id', updateCharacter);
// app.delete('/character/:character_id', deleteCharacter)


// function getAllCharacters(req, res) {
//     const url = 'http://hp-api.herokuapp.com/api/characters';

//     superagent.get(url).then(results => {
//         const characters = results.body.map(data => {
//             return new Character(data)
//         })
//         res.render('index', { character: characters })
//     })
// }

// function renderCreatePage(req, res) {
//     res.render('create-character')
// }

// function getAllFavCharacters(req, res) {
//     const sql = `SELECT * FROM characters WHERE created_by=$1;`;
//     const safeValues = ['api'];

//     client.query(sql, safeValues).then(results => {
//         res.render('display-characters', { characters: results.rows })
//     }).catch(error => console.log(error))
// }

// function getAllCreatedCharacters(req, res) {
//     const sql = `SELECT * FROM characters WHERE created_by=$1;`;
//     const safeValues = ['user']
//     client.query(sql, safeValues).then(results => {
//         res.render('display-characters', { characters: results.rows })
//     }).catch(error => console.log(error))
// }

// function getCharacterDetails(req, res) {
//     const characterId = req.params.character_id;
//     console.log(req.params);
//     const sql = `SELECT * FROM characters WHERE id=$1`;
//     const safeValues = [characterId];
//     // res.send('all good')
//     client.query(sql, safeValues).then(results => {
//         res.render('character-details', { characterInfo: results.rows })
//     })
// }

// function saveCharacter(req, res) {
//     const data = req.body;
//     console.log(data);
//     const { name, house, patronus, alive } = req.body

//     const sql = `INSERT INTO characters(name, house, patronus, is_alive, created_by) VALUES($1, $2, $3, $4, $5);`;
//     const safeValues = [name, house, patronus, alive, 'api'];

//     client.query(sql, safeValues).then(() => {
//             res.redirect('/character/my-fav-character')
//         })
//         // res.send('all good')
// }

// function updateCharacter(req, res) {
//     const characterId = req.params.character_id
//     const { name, house, patronus, status } = req.body
//     const sql = `UPDATE characters SET name=$1, house=$2, patronus=$3, is_alive=$4 WHERE id=$5`;
//     const safeValues = [name, house, patronus, status, characterId];

//     client.query(sql, safeValues).then(() => {
//         res.redirect(`/character/${characterId}`)
//     })
// }

// function deleteCharacter(req, res) {
//     const characterId = req.params.character_id
//     const sql = `DELETE FROM characters WHERE id=$1`;
//     const safeValues = [characterId];
//     client.query(sql, safeValues).then(() => {
//         res.redirect(`/character/my-fav-character`)
//     })
// }

// function createCharacter(req, res) {
//     const { name, house, patronus, status } = req.body;
//     const sql = `INSERT INTO characters(name, house, patronus, is_alive, created_by) VALUES($1, $2, $3, $4, $5); `;
//     const safeValues = [name, house, patronus, status, 'user'];

//     client.query(sql, safeValues).then(() => {
//         res.redirect('/character/my-characters')
//     })
// }

// function Character(charInfo) {
//     this.name = charInfo.name;
//     this.house = charInfo.house;
//     this.patronus = charInfo.patronus;
//     this.alive = charInfo.alive
// }
// client.connect().then(() => {
//     app.listen(PORT, () => console.log(`listening to PORT ${PORT}`))
// }).catch(error => console.log(error))








// application dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodoverride = require('method-override');
const cors = require('cors');

// enviromental variables
require('dotenv').config();
const PORT = process.env.PORT;
DATABASE_URL = process.env.DATABASE_URL;

// application setup
const app = express();
const client = new pg.Client(DATABASE_URL);
// express middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(cors());

// routes
app.get('/home', homePage);
app.post('/favorite-character', addToDatabase);
app.get('/favorite-character', renderFromDatabase);
app.get('/character/:character_id', viewDetails);
app.put('/character/:character_id', updateCharacter);
app.delete('/character/:character_id', deleteCharacter);


function deleteCharacter(req, res) {
    const id = req.params.character_id;
    const sql = `DELETE FROM characters WHERE id=$1`;
    const safeValues = [id];

    client.query(sql, safeValues).then(() => {
        res.redirect('/favorite-character');
    })
}



function updateCharacter(req, res) {
    const id = req.params.character_id;
    const { name, image, house, patronus, is_alive } = req.body;
    const sql = `UPDATE characters SET name=$1, house=$2, image=$3, patronus=$4, is_alive=$5 WHERE id=$6`;
    const safeValues = [name, image, house, patronus, is_alive, id];

    client.query(sql, safeValues).then(() => {
        res.redirect(`/character/${id}`)
    })

}


function viewDetails(req, res) {
    const id = req.params.character_id;
    const sql = `SELECT * FROM characters WHERE id=$1;`;
    const safeValues = [id];

    client.query(sql, safeValues).then(results => {
        res.render('character-details', { char: results.rows })
    })

}


function renderFromDatabase(req, res) {
    const sql = `SELECT * FROM characters;`;

    client.query(sql).then(results => {
        res.render('display-characters', { char: results.rows })
    })
}

function addToDatabase(req, res) {
    const { name, image, house, patronus, alive } = req.body;
    const sql = `INSERT INTO characters(name, image, house, patronus, is_alive, created_by) VALUES($1, $2, $3, $4, $5, $6)`;
    const safeValues = [name, image, house, patronus, alive, 'api'];

    client.query(sql, safeValues).then(() => {
        res.redirect('/favorite-character')
    })
}

function homePage(req, res) {
    const url = `http://hp-api.herokuapp.com/api/characters`;
    superagent.get(url).then(results => {
        const harry = results.body.map(data => {
            return new Character(data)
        })
        res.render('index', { char: harry })
    })
}

function Character(data) {
    this.name = data.name;
    this.image = data.image;
    this.house = data.house;
    this.patronus = data.patronus;
    this.alive = data.alive
}










client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
})