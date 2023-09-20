//const { DAO } = require('./lib/app/database/dao.js');
const express = require('express');
const app = express();
/*const cors = require('cors');

app.use(cors());*/

// set up database
const dbHost = "localhost"
const dbPort = 3306;
const dbUsername = "root"
const dbPassword = "root"

app.get('/', (req, res) => {
    res.send("Testing express app");
})

app.get('/all-users', (req, res) =>
{
    let dao = new DAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.listAllUsers(function(users)
    {
        res.json(users);
    });
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})