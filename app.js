const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const app = express();

const port = process.env.port || 5000;

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json())

// Database API mySql 
pool = mysql.createConnection({
    connectionLimit : 100,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_syndic'
})

app.get('', (req, res) =>{
    pool.getConnection((err, con) => {
        if(err) throw err;

        res.send("Connected");
    });
});




app.listen(port, ()=> console.log(`App running on ${port}`));