const express = require("express")
let router = express.Router()
const bcrypt = require("bcrypt")
const saltRounds = 10 // used for Hashing length
const fileUpload = require("express-fileupload")
require("dotenv").config()
const bodyparser = require("body-parser");
const cors = require("cors")



router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(fileUpload())
router.use(cors({origin : `http://localhost:3000`, credentials : true}))




router.route("/up/image")
    .post((req, res) => {
        if(req.files === null){
            console.log("No Photos Okey then")
        }
        //console.log(req.files)
        /*const file = req.files.file 
        console.log(file)
        file.mv(`${__dirname}/../../Client/public/profile img/${file.name}`, (err) => {
            if(err){
                console.log(err)
            }
            console.log( "Nom du Fichier est : " + file.name)
        })*/

    })


////// Create New Account
router.route("/new")
    .post((req, res) => {
        const { nom, prenom, email, tele, role, fonc } = req.body
        if(nom !== "" && prenom !== "" && email !== "" && tele !== "" && role !== "" && fonc !== ""){
            const pwd = nom + "@" + prenom 
            bcrypt.hash(pwd, saltRounds, (err, hash) => {
                if(err){
                    return res.json(" errrrrrrrr : ")
                }
                const SQLQuery = "insert into compte (NomCompte, PrenomCompte, Role, fonc, EmailCompte, telephone, PasswordCompte) values (?, ?, ?, ?, ?, ?, ?)"
                pool.query(SQLQuery, [nom, prenom, role, fonc, email, tele, hash], (err, resolve) => {
                    if(err){ 
                        if(err.sqlMessage === `Duplicate entry '${email}' for key 'EmailCompte'`){
                            return res.json({msgErr : "Duplicate Email"})
                        }
                    }
                    if(resolve){
                        if(resolve.affectedRows != 0){
                            res.json({message : "Inserted"})
                        }
                    }
                    
                })
            })
        }
    })
    

////// Listing Users
router.route("/all")
    .get((req, res) => {
        const sqlQuery = "select NumCompte, NomCompte, PrenomCompte, Role, EmailCompte, telephone, fonc, photo from compte order by NumCompte desc ;"   
        pool.query(sqlQuery, (err, data) => {
            if(!err){
                if(data.length !== 0){
                    res.json(data)
                }
            }
            else{
                res.json({msgErr : "No Users"})
                
            }
        })
    })


///// Searching users By ... 
router.route("/:search")
    .get((req, res) => {
        const search = req.params.search
        if(search !== ""){
            const sqlQuery = `select NumCompte, NomCompte, PrenomCompte, Role, EmailCompte, telephone, fonc, photo from compte where NomCompte like '%${search}%' or PrenomCompte like '%${search}%' or Role like '%${search}%' or fonc like '%${search}%' or EmailCompte like '%${search}%' or telephone like '%${search}%' order by NumCompte desc ;`
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    return res.send("Failed to load Data")
                }
                if(data){
                    if(data.length !== 0){
                        return res.send(data)
                        //console.log(data[0])
                    }
                    else{
                        return res.json({msggg : "No Users"})
                    }
                }
            })
        }
    })

////// Find User by His Email :
router.route("/byEmail/:email")
    .get((req, res) => {
        const email = req.params.email
        const sqlQuery = "select EmailCompte from Compte where EmailCompte = ? ;"
        pool.query(sqlQuery, email, (err, data) => {
            if(err){
                res.send({msg : "err"})
            }
            if(data.length > 0){
                res.send({msg : "Déjà Utilisé !"})
            }
            else{
                res.send({msg : "Cooool"})
            }
        })
    })


/////// User By Id 
router.route("/user/:id")
    .get((req, res) => {
        const id = req.params.id
        const sqlQuery = `select NumCompte, NomCompte, PrenomCompte, Role, EmailCompte, telephone, fonc, photo from compte where NumCompte = ${id};`
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


///// Edit User 
router.route("/edit/:id")
    .put((req, res) => {
        const id = req.params.id
        const { nom, prenom, tele } = req.body 
        if(id !== "" && nom !== "" && prenom !== ""  && tele !== "" ){
            const sqlQuery = `update compte set NomCompte = ?, PrenomCompte = ?, telephone = ? where NumCompte = ${id} ;`
            pool.query(sqlQuery, [nom, prenom, tele], (err, resolve) => {
                if(err) {
                    res.json({err : "Not Updated"})
                }
                if(resolve){
                    if(resolve.affectedRows != 0){
                        res.json({message : "Updated Successfully"})
                    }
                    else{
                        res.json({messageErr : "Update Failed"})
                    }
                }
                else{
                    res.json({messageErr : "err"})
                }
            })
            
        }
    })

///// Reset the Password To the default value 
router.route('/reset/password/:id')
    .put((req, res) => {
        const id = req.params.id
        const {nom, prenom} = req.body
        if(nom !== undefined && prenom !== undefined && id !== undefined){
            const pwd = nom + "@" + prenom 
            bcrypt.hash(pwd, saltRounds, (er, hash) => {
                if(er){
                    return console.log(" errrrrrrrr : ", er)
                }
                const SQLQuery = "update compte set PasswordCompte = ? where NumCompte = ? ;"
                pool.query(SQLQuery, [hash, id], (err, resolve) => {
                    if(err){ 
                        return res.json({messageErr : err})
                    }
                    if(resolve){
                        if(resolve.affectedRows != 0){
                            return res.send("Updated")
                        }
                    }
                    
                })
            })
        }
    })


// Delete User 
router.route("/delete/:id")
    .delete((req, res) => {
        const id = req.params.id
        const sqlQuery = "delete from compte where NumCompte = ? ;"
        pool.query(sqlQuery, id, (err, resolve) => {
            if(err) {
                if(err.sqlMessage === "Cannot delete or update a parent row: a foreign key constraint fails (`db_syndicat`.`logement`, CONSTRAINT `fk_log_compte` FOREIGN KEY (`NumCompteCop`) REFERENCES `compte` (`NumCompte`))"){
                    return res.json("Ce Compte est Liée à un Logement !")
                }
                res.json({err : err})
            }
            if(resolve){
                if(resolve.affectedRows === 0){
                    return res.json("Compte Introuvable")
                }
                else{
                    return res.json("Deleted")
                }
            }
        })
    })


///////// Mes Settings
router.route('/monCompte/edit/:id')
    .put((req, res) => {
        const id = req.params.id
        const {nom, prenom, tele, pwd, newPwd} = req.body
        if(id !== "" && nom !== "" && prenom !== "" && tele !== ""){
            if(pwd !== "" && newPwd !== ""){

            }
            else{
                const sqlQuery = "update compte set NomCompte = ?, PrenomCompte = ?, telephone = ? where NumCompte = ? ;"
                pool.query(sqlQuery, [ nom, prenom, tele, id], (err, resolve) => {
                    if(err) res.json({err : err})
                    if(resolve){
                        res.json({data : resolve})
                    }
                    else{
                        console.log("bad request")
                    }
                })
            }
        }
    })


//// Logement et Copropriétaire
router.route('/logement/cop')
    .get((req, res) => {
        const sqlQuery = "select c.NumCompte, c.NomCompte, c.PrenomCompte, l.RefLogement from compte c, logement l where c.NumCompte = l.NumCompteCop ;"
        pool.query(sqlQuery, (err, data) => {
            if(!err){
                if(data.length !== 0){
                    res.json(data)
                }
            }
            else{
                res.json({msgErr : "No Users"})
            }
        })
    })


module.exports = router