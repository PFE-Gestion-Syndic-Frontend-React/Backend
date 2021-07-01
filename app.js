require("dotenv").config()
const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors")
const app = express();
const bcrypt = require("bcrypt")
const saltRounds = 10 // used for Hashing length
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload")

//Routers of APIs
const users = require('./routes/users')
const annonces = require('./routes/annonces')
const logements = require('./routes/logements')
const depenses = require('./routes/depenses')
const reclamations = require('./routes/reclamations')


const port = 5001

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json())
app.use(express.json())
app.use(fileUpload())
app.use(cors({origin : 'http://localhost:3000', credentials : true}))


app.use("/users", users)
app.use("/annonces", annonces)
app.use("/logements", logements)
app.use("/depenses", depenses)
app.use("/reclamations", reclamations)

// Database API mySql 
pool = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_syndicat'
})


////// For Logging
app.post('/', (req, res) => {
    const email = req.body.email
    const pwd = req.body.pwd
    if(email !== "" && pwd !== ""){
        const SQLQuery = "select NumCompte, NomCompte, photo, EmailCompte, Role, PasswordCompte from compte where EmailCompte = ? ;"
        pool.query(SQLQuery, email, (err, result) => {
            if(err){
                res.json({err : err})
                console.log("errreurr")
            }
            if(result){
                if(result.length > 0){
                    bcrypt.compare(pwd, result[0].PasswordCompte, (error, response )=>{
                        if(error){ res.json({messageErr : error}) }
                        if(response){
                            if(result.length > 0){
                                const NumCompte = result[0].NumCompte
                                const EmailCompte = result[0].EmailCompte
                                const Role = result[0].Role
                                const PayLoad = {Num : NumCompte, Email : EmailCompte, Role : Role}
                                const accessToken = jwt.sign(PayLoad, process.env.SECRETTOKEN, {expiresIn : 60 * 60})

                                req.headers['authorization'] = accessToken
                                res.json({auth : true, data : result, token : accessToken})
                            }
                            else{
                                res.json({messageExp : "User"})
                            }
                        }
                        else{
                            res.send({msgErr : "Password or Email is incorrect !"})
                            //console.log("Password or Email is incorrect !")
                        }
                    })
                }
                else{
                    res.send({msgErr : "Password or Email is incorrect !"})
                    //console.log("Password or Email is incorrect !")
                }
            }
            else{
                res.json({messageErr : "User does not Exist"})
                console.log("User does not Exist")
            }
        })
    }
});


app.get("/getData/", (req, res) => {
    let token = req.headers['authorization']
    if(!token){
        try{
            let decoded = jwt.verify(token, process.env.SECRETTOKEN)
            console.log(decoded)
            res.json({msg : "Valid Token"})
        }
        catch{
            console.log("Not Authorized")
            res.sendStatus(401)
        }
    }
    else{
        console.log("NULL")
    }
})



////// To RESET The PASSWORD 
app.post('/resetpwd', (req, res) => {
    const email = req.body.email 
    const tele = req.body.tele
    const SQLQuery = "select * from compte where EmailCompte = ? and telephone = ? "
    pool.query(SQLQuery, [email, tele], (err, result) => {

    })
})



app.listen(port, ()=> console.log(`App running on ${port}`));

