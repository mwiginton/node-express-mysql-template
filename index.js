const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());
const port = process.env.port || 8080;

app.listen(port, () => {
    console.log(`PT Assistant API listening on port ${port}`);
});

const pool = mysql.createPool({
    // insert db info here
});


app.get('/', async(req, res) => {
    res.json({status: 'App is up and running'})
});

app.get('/list', async(req, res) => {
    const query = `SELECT * FROM EXERCISE`;
    pool.query(query, (error, results) => {
        if (error) {
            console.log('ERROR');
            console.log(error);
        }
        if (!results[0]) {
            res.json({status: 'No Results Found'});
        } else {
            res.json(results);
        }
    });
});

app.get('/:id', async(req, res) => {
    const query = `SELECT * FROM EXERCISE WHERE ID = ?`;
    pool.query(query, [req.params.id], (error, results) => {
        if (error) {
            console.log('ERROR');
            console.log(error);
        }
        if (!results[0]) {
            res.json({status: 'No Results Found'});
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/', async(req, res) => {
    const body = {
        id: req.body.id, // will delete this later and handle pk generation from db
        name: req.body.name,
        description: req.body.description
    }

    const query = `INSERT INTO EXERCISE VALUES (?, ?, ?)`;

    pool.query(query, Object.values(body), (error) => {
        if (error) {
            res.json({status: 'failure', reason: error.code});
            console.log(error);
        } else {
            res.json({status: 'success', data: body})
        }
    })
});

app.put('/', async(req, res) => {
    const body = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description
    }

    const query = `UPDATE EXERCISE SET NAME = '${req.body.name}', DESCRIPTION = '${req.body.description}' WHERE ID = ${req.body.id}`;

    pool.query(query, Object.values(body), (error) => {
        if (error) {
            res.json({status: 'failure', reason: error.code});
            console.log(error);
        } else {
            res.json({status: 'success', data: body})
        }
    })
});