require("dotenv").config()
const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors")
const app = express();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const fs = require('fs')
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, "public/annonces pics"))
    },
    filename : (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
})
const upload = multer({ storage : storage })


//Routers of APIs
const users = require('./routes/users')
const annonces = require('./routes/annonces')
const logements = require('./routes/logements')
const depenses = require('./routes/depenses')
const reclamations = require('./routes/reclamations')
const cotisations = require('./routes/cotisations')


const port = process.env.PORT_SERVER 

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json())
app.use(express.json())
app.use(cors({origin : 'http://localhost:3000', credentials : true}))
app.use(express.static("public/annonces pics"))

app.use("/users", users)
app.use("/annonces", annonces)
app.use("/logements", logements)
app.use("/depenses", depenses)
app.use("/reclamations", reclamations)
app.use("/cotisations", cotisations)

// Database API mySql 
pool = mysql.createPool({
    connectionLimit : 100,
    host : "localhost",
    user : "root",
    password : '', 
    database : "db_syndicat"
})

app.post('/upload/annonce', upload.single('anonce'), (req, res) => {
    const file = req.file
    if(!file){
        return res.send("No Image !")
    }
    res.send("Yayy")
})


////// For Logging
app.post('/', (req, res) => {
    const {email, pwd} = req.body
    if(email !== "" && pwd !== ""){
        const SQLQuery = "select NumCompte, NomCompte, PrenomCompte, photo, EmailCompte, Role, PasswordCompte from compte where EmailCompte = ? ;"
        pool.query(SQLQuery, email, (err, result) => {
            if(err){
                return res.json({err : "Bad 0"})
            }
            if(result){
                if(result.length > 0){
                    bcrypt.compare(pwd, result[0].PasswordCompte, (error, response )=>{
                        if(error){ return res.json({messageErr : "BAD"}) }
                        if(response){
                            if(result.length > 0){
                                const NumCompte = result[0].NumCompte
                                const EmailCompte = result[0].EmailCompte
                                const Role = result[0].Role
                                const PayLoad = {Num : NumCompte, Email : EmailCompte, Role : Role}
                                const accessToken = jwt.sign(PayLoad, process.env.SECRETTOKEN, {expiresIn : 60 * 60 * 10})

                                req.headers['authorization'] = accessToken
                                return res.json({auth : true, data : result, token : accessToken})
                            }
                            else{
                                //return res.json({messageExp : "User"})
                            }
                        }
                        else{
                            return res.send({msgErr : "Password or Email is incorrect !"})
                        }
                    })
                }
                else{
                    return res.send({msgErr : "Password or Email is incorrect !"})
                }
            }
            else{
                return res.json({messageErr : "User does not Exist"})
            }
        })
    }
});


const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization']
    const Totoken = token.replace("Bearer ", "")
    if(!Totoken){
        res.json("NO TOKEN")
    }
    else{
        jwt.verify(Totoken, process.env.SECRETTOKEN, (err, decoded) => {
            if(err){
                res.json({auth : false, msg : "Incorrect token !"})
            }
            else{
                req.NumCompte = decoded.NumCompte
                req.Email = decoded.EmailCompte 
                req.Role = decoded.Role
                res.json({role : req.Role})
                next()
            }
        })
    }
}


app.get("/isAuth", verifyJWT, (req, res) => {
    if(res){

    }
})


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



app.listen(port, ()=> console.log(`App running on ${port}` ));

