require("dotenv").config()
const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors")
const app = express();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const fs = require('fs')
const fileupload = require('express-fileupload')


/*const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, "public/annonces pics"))
    },
    filename : (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
})
const upload = multer({ storage : storage })*/


//Routers of APIs
const users = require('./routes/users')
const annonces = require('./routes/annonces')
const logements = require('./routes/logements')
const depenses = require('./routes/depenses')
const reclamations = require('./routes/reclamations')
const cotisations = require('./routes/cotisations')
const statistiques = require('./routes/statistiques');
const path = require("path");

const port = process.env.PORT_SERVER 

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json())
app.use(express.json())
app.use(cors({origin : 'http://localhost:3000', credentials : true}))
app.use(fileupload())

app.use("/users", users)
app.use("/annonces", annonces)
app.use("/logements", logements)
app.use("/depenses", depenses)
app.use("/reclamations", reclamations)
app.use("/cotisations", cotisations)
app.use("/statistiques", statistiques)

// Database API mySql 
pool = mysql.createPool({
    connectionLimit : 100,
    host : "localhost",
    user : "root",
    password : '', 
    database : "db_syndicat"
})



////////////// ENREGISTRER ANNONCE AVEC SES DOCS ///////
app.post('/upload/reclamation/:log/:objet/:message/:pour', async (req, res) => {
    if(req.files === null){
        console.log('is NULL')
        res.send("No Image !")
    }
    else{
        const {log, objet, message, pour} = req.params
        if(log !== "" && objet !== "" && message !== "" && pour !== ""){
            const file = req.files.reclam 
            const NAMEFILE = Date.now() + "-" + file.name 
            file.mv(`${__dirname}/../Client/public/reclamation support/${NAMEFILE}`, err => {
                if(err){
                    if(err.code === "ENOENT" || err.syscall === "open"){
                        return res.send("Inserted")
                    }
                }
            })
            const sqlQuery = `call upload_reclamation('${log}' , '${objet}', '${message}', '${pour}', '${NAMEFILE}')`
            await pool.query(sqlQuery, (err, resolve) => {
                if(err){ 
                    if(err.code === "ERR_HTTP_HEADERS_SENT"){
                        return res.send("Headers Err")
                    }
                    else if(err.code === 'ERR_HTTP_INVALID_STATUS_CODE'){
                        return res.send("http status code")
                    }
                    
                }
                if(resolve){
                    if(resolve.affectedRows === "2"){
                        return res.send("Inserted and Uploaded")
                    }
                    else{
                        return res.send(resolve)
                    }
                }
                else{
                    console.log("hh")
                }
            }) 
        }
        else{
            console.log('Null')
        }
    }
})



////////////// ENREGISTRER ANNONCE AVEC SES DOCS ///////
app.post('/upload/annonce/:id/:sujet/:descripAnnonce', async (req, res) => {
    if(req.files === null){
        return res.send("No Image !")
    }
    else{
        const {id, sujet, descripAnnonce} = req.params
        if(id !== "" && sujet !== "" && descripAnnonce !== ""){
            const idParsed = parseInt(id)
            const file = req.files.anonce 
            const NAMEFILE = Date.now() + "-" + file.name
            file.mv(`${__dirname}/../Client/public/annonce doc/${NAMEFILE}`, err => {
                if(err){
                    if(err.code === "ENOENT" || err.syscall === "open"){
                        return res.send("Inserted")
                    }
                }
            })
            const sqlQuery = `call upload_annonce(${idParsed} , '${sujet}', '${descripAnnonce}', '${NAMEFILE}')`
            await pool.query(sqlQuery, (err, resolve) => {
                if(err){ 
                    if(err.code === "ER_BAD_NULL_ERROR"){
                        res.json({messageErr : "Bad One"})
                    }
                    else{
                        return res.send(err)
                    }
                }
                if(resolve){
                    if(resolve.affectedRows === "2"){
                        res.send("Inserted and Uploaded")
                    }
                    else{
                        res.send(resolve)
                    }
                }
                else{
                    console.log("hh")
                }
            })
        }
        else{
            console.log("NULL")
        }
    }
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
    const { email, tele } = req.body
    const SQLQuery = "select EmailCompte, telephone, NumCompte from compte where EmailCompte = ? and telephone = ? "
    pool.query(SQLQuery, [email, tele], async (err, result) => {
        if(err){
            res.send(err)
            console.log(err)
        }
        if(result){
            console.log(result[0])
            if(result.length > 0){
                console.log("Yayy")
                //res.send(result[0])
            }
            else{
                console.log('Nay')
                res.send("Unfounded User")
            }
        }
        let randomNumber = await Math.round(Math.random() * 999999)
        res.send(randomNumber)
        console.log(randomNumber)
    })
})



app.listen(port, ()=> console.log(`App running on ${port}` ));

