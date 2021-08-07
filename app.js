require("dotenv").config()
const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors")
const app = express();
const bcrypt = require("bcrypt")
const saltRounds = 10 // used for Hashing length
const jwt = require("jsonwebtoken");
const fileupload = require('express-fileupload')
const nodemailer = require('nodemailer')

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
const releves = require('./routes/releves')
const path = require("path");

const port = process.env.PORT_SERVER
const client = process.env.PORT_CLIENT

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json())
app.use(express.json())
app.use(cors({origin : `http://localhost:${client}`, credentials : true}))
app.use(fileupload())
app.use(express.static('public'))

app.use("/users", users)
app.use("/annonces", annonces)
app.use("/logements", logements)
app.use("/depenses", depenses)
app.use("/reclamations", reclamations)
app.use("/cotisations", cotisations)
app.use("/statistiques", statistiques)
app.use("/releves", releves)


let transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : "gsc.noreplay@gmail.com", //process.env.USER_GMAIL,
        pass : "Azerty19971121" //process.env.PWD_GMAIL
    },
    tls : {
        rejectUnauthorized : false
    }
})

// Database API mySql
const host = process.env.HOST_DB
const userDB = process.env.HOST_USER
const DB = process.env.DATA

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
            file.mv(`${__dirname}/public/reclamation support/${NAMEFILE}`, err => {
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
            file.mv(`${__dirname}/public/annonce doc/${NAMEFILE}`, err => {
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
                    if(resolve.affectedRows === 2){
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
app.post('/login', (req, res) => {
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


////// Verify Token MIDDLEWARE
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

////// Verification Auth
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
app.get('/resetpwd/:email/:tele', (req, res) => {
    const { email, tele } = req.params
    if(email !== "" && email !== undefined && tele !== "" && tele !== undefined){
        const SQLQuery = "select EmailCompte, telephone, NumCompte from compte where EmailCompte = ? and telephone = ? "
        pool.query(SQLQuery, [email, tele], async (err, result) => {
            if(err){
                res.send(err)
                console.log(err)
            }
            if(result){
                if(result.length > 0){
                    let mailOptions = {
                        from : "gsc.noreplay@gmail.com", //process.env.USER_GMAIL,
                        to : email,
                        subject : "Reset Password",
                        text : `G.S.C à votre Service ! Bonjour ! Pour Changer Récuperer Votre Mot de Passe : Cliquer sur le Lien : http://localhost:3000/newPassword/${email}/${tele}/${result[0].NumCompte}  Attention : le lien sera expiré dans 10 min`
                    }
                    
                    transporter.sendMail(mailOptions, function(err, success){
                        if(err) {
                            console.log(err)
                        }
                        else{
                            res.send("Verify Your Email")
                        }
                    })
                }
                else{
                    res.send("Unfounded User")
                }
            }
        })
    }
})


/////// Edit Pic Photo
app.put('/upload/profile/:id', async (req, res) => {
    const id = req.params.id
    if(req.files === null || req.files === undefined){
        return res.send("No Image !")
    }
    else{
        const idParsed = parseInt(id)
        const file = req.files.profile
        const NAMEFILE = Date.now() + "-" + file.name
        file.mv(`${__dirname}/public/profile img/${NAMEFILE}`, err => {
            if(err){
                if(err.code === "ENOENT" || err.syscall === "open"){
                    return res.send("Inserted")
                }
            }
        })
        const sqlUpload = `update Compte set photo = '${NAMEFILE}' where NumCompte = ${idParsed} ;`
        await pool.query(sqlUpload, (er, data) => {
            if(er) return res.send(er)
            if(data){
                if(data){
                    if(data.affectedRows !== 0){
                        console.log("Inserted and Uploaded")
                    }
                    else{
                        console.log(resolve)
                    }
                }
                else{
                    console.log("hh")
                }
            }
        })
    }
})



////// Edit My Account
app.put('/monCompte/edit/:id', (req, res) => {
    const id = req.params.id 
    const { nom, prenom, tele, pwd, newPwd } = req.body
    if(id !== ""){
        const idParsed = parseInt(id)
        if(nom !== "" && nom !== undefined && prenom !== "" && prenom !== undefined && tele !== "" && tele !== undefined && pwd !== "" && newPwd !== "" && pwd !== undefined && newPwd !== undefined){
            const sqlQuery = `update compte set NomCompte = '${nom}', PrenomCompte = '${prenom}', telephone = '${tele}' where NumCompte = ${idParsed} ;`
            pool.query(sqlQuery, async (err, result) => {
                if(err){
                    return res.send(err)
                }
                if(result){
                    if(result.affectedRows !== 0){
                        const sqlSelect = `select PasswordCompte from Compte where NumCompte = ${idParsed} ;`
                        await pool.query(sqlSelect, (err, result) => {
                            if(result){
                                if(result.length > 0){
                                    bcrypt.compare(pwd, result[0].PasswordCompte, async (error, response) => {
                                        if(error) return res.json("1 Mot de Passe Incorrect")
                                        if(response){
                                            if(result.length > 0){
                                                await bcrypt.hash(newPwd, saltRounds, async (er, hash) => {
                                                    if(err){
                                                        return res.json(er)
                                                    }
                                                    const sqlUpdatePWD = `update compte set PasswordCompte = '${hash}' where NumCompte = ${idParsed} ;`
                                                    await pool.query(sqlUpdatePWD, (errr, data) => {
                                                        if(errr){
                                                            return res.json(errr)
                                                        }
                                                        if(data){
                                                            if(data.affectedRows !== 0){
                                                                return res.json("Yaaay")
                                                            }
                                                            else{
                                                                return res.json("Naay")
                                                            }
                                                        }
                                                    })
                                                })
                                            }
                                        }
                                        else{
                                            return res.json("INCORRECT")
                                        }
                                    })
                                }
                                else{
                                    return res.json("3 Mot de Passe Incorrect")
                                }
                            }
                        })
                    }
                    else{
                        return res.json("Not Updated")
                    }
                }
            })
        }
        else if(nom !== "" && nom !== undefined && prenom !== "" && prenom !== undefined && tele !== "" && tele !== undefined){
            const sqlQuery = `update compte set NomCompte = '${nom}', PrenomCompte = '${prenom}', telephone = '${tele}' where NumCompte = ${idParsed} ;`
            pool.query(sqlQuery, (err, result) => {
                if(err){
                    return res.send(err)
                }
                if(result){
                    if(result.affectedRows !== 0){
                        return res.json("Updated")
                    }
                    else{
                        return res.json("Not Updated")
                    }
                }
            })
        }
        else if(pwd !== "" && newPwd !== "" && pwd !== undefined && newPwd !== undefined){
            const sqlSelect = `select PasswordCompte from Compte where NumCompte = ${idParsed} ;`
            pool.query(sqlSelect, (err, result) => {
                if(result){
                    if(result.length > 0){
                        bcrypt.compare(pwd, result[0].PasswordCompte, async (error, response) => {
                            if(error) return res.json("1 Mot de Passe Incorrect")
                            if(response){
                                if(result.length > 0){
                                    await bcrypt.hash(newPwd, saltRounds, async (er, hash) => {
                                        if(err){
                                            return res.json(er)
                                        }
                                        const sqlUpdatePWD = `update compte set PasswordCompte = '${hash}' where NumCompte = ${idParsed} ;`
                                        await pool.query(sqlUpdatePWD, (errr, data) => {
                                            if(errr){
                                                return res.json(errr)
                                            }
                                            if(data){
                                                if(data.affectedRows !== 0){
                                                    return res.json("Yaaay")
                                                }
                                                else{
                                                    return res.json("Naay")
                                                }
                                            }
                                        })
                                    })
                                }
                            }
                            else{
                                return res.json("INCORRECT")
                            }
                        })
                    }
                    else{
                        return res.json("3 Mot de Passe Incorrect")
                    }
                }
            })
        }
    }
})

////// Get My Data 
app.get('/me/:id', (req, res) => {
    const id = req.params.id
    const sqlQuery = `select NomCompte, PrenomCompte, photo from compte where NumCompte = ${id};`
    pool.query(sqlQuery, (err, data) => {
        if(err){
            res.json({msgErr : "Err"})
        }
        if(data.length > 0){
            res.json(data)
        }
        else{
            res.json({msgErr : "Not Found"})
        }
    })
})




app.listen(port, ()=> console.log(`App running on ${port}` ));
