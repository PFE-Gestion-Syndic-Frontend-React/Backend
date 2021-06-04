const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const app = express();

const port = process.env.port || 5000;

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json())

// Database API mySql 
pool = mysql.createConnection({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_syndic'
})

app.get('', (req, res) =>{
    
    console.log(pool);
    pool.connect((err, con) =>{
        if(!err){
            res.send("cool")
        }
        else{
            res.send("errr")
        }
    })
});




app.listen(port, ()=> console.log(`App running on ${port}`));