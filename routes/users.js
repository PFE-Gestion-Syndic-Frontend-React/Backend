const express = require("express")
let router = express.Router()
const bcrypt = require("bcrypt")
const saltRounds = 10 // used for Hashing length
const fileUpload = require("express-fileupload")
require("dotenv").config()
const bodyparser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors")
const jwt = require("jsonwebtoken");
const {authToken, authRole} = require('./../middleware')

const multer = require('multer')



router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(fileUpload())
router.use(cors({origin : 'http://localhost:3000', credentials : true}))




router.route("/up/image")
    .post((req, res) => {
        if(req.files === null){
            console.log("No Photos Okey then")
        }

        console.log(req.files)
        /*const file = req.files.file 
        console.log(file)
        file.mv(`${__dirname}/../../Client/public/profile img/${file.name}`, (err) => {
            if(err){
                console.log(err)
            }
            console.log( "Nom du Fichier est : " + file.name)
        })*/

    })


// Create New Account
router.route("/new", authRole("Administrateur"))
    .post((req, res, next) => {
        const nom = req.body.nom 
        const prenom = req.body.prenom
        const email = req.body.email
        const tele = req.body.tele 
        const role = req.body.role
        const fonc = req.body.fonc
        const pwd = nom + "@" + prenom 


        if(!req.files || Object.keys(req.files).length === 0 || req.files === null){
            bcrypt.hash(pwd, saltRounds, (err, hash) => {
                if(err){
                    console.log(" errrrrrrrr : ")
                }
                const SQLQuery = "insert into compte (NomCompte, PrenomCompte, Role, fonc, EmailCompte, telephone, PasswordCompte) values (?, ?, ?, ?, ?, ?, ?)"
                pool.query(SQLQuery, [nom, prenom, role, fonc, email, tele, hash], (err, resolve) => {
                    if(err){ 
                        res.json({messageErr : err}) 
                        console.log(err) 
                    }
                    
                    if(resolve){
                        console.log(resolve)
                        if(resolve.affectedRows != 0){
                            res.json({message : "Inserted"})
                        }
                    }
                    
                })
            })
        }
        else{ 
            let sampleFile = req.file.filename
            console.log(sampleFile) 
            let path = `${__dirname}/../../../Client/public/profile img/${sampleFile.name}`
            
            sampleFile.mv(path, (err) => {
                console.log(path)
                if(!err){
                    const SQLQuery = "insert into compte (NomCompte, PrenomCompte, Role, fonc, EmailCompte, telephone, PasswordCompte, photo) values (?, ?, ?, ?, ?, ?, ?, ?)"
                    pool.query(SQLQuery, [nom, prenom, role, fonc, email, tele, hash, sampleFile], (err, resolve) => {
                        if(err){ 
                            res.json({messageErr : err}) 
                            console.log(err) 
                        }
                        if(resolve){
                            console.log(resolve)
                            if(resolve.affectedRows != 0){
                                res.json({message : "Inserted"})
                            }
                        }
                    })
                }
                else{
                    console.log("errrrr")
                }
            })
        }        
    })
    

// Listing Users
router.route("/all", authRole(["Administrateur"]))
    .get((req, res) => {
        const token = req.headers['authorization']
        //if(token.length > 150){
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
        /*}
        else{
            res.json({authorization : false})
        }*/
        
    })


// Searching users By ... 
router.route("/:search")
    .get((req, res) => {
        const search = req.params.search
        if(search !== ""){
            const sqlQuery = `select NumCompte, NomCompte, PrenomCompte, Role, EmailCompte, telephone, fonc, photo from compte where NomCompte like '%${search}%' or PrenomCompte like '%${search}%' or Role like '%${search}%' or fonc like '%${search}%' or EmailCompte like '%${search}%' or telephone like '%${search}%' order by NumCompte desc ;`
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    res.json("Failed to load Data")
                }
                if(data){
                    if(data.length !== 0){
                        res.json( data )
                        //console.log(data[0])
                    }
                    else{
                        res.json({msggg : "No Users"})
                    }
                }
            })
        }
    })

// Find User by His Email :
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


// User By Id 
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


// Edit User 
router.route("/edit/:id")
    .put((req, res) => {
        const id = req.params.id
        const nom = req.body.nom 
        const prenom = req.body.prenom 
        const fon = req.body.fon 
        const tele = req.body.tele 
        const role = req.body.role 

        if(id !== "" && nom !== "" && prenom !== "" && fon !== "" && tele !== "" && role !== ""){
            const sqlQuery = `update compte set NomCompte = ?, PrenomCompte = ?, fonc = ?, telephone = ?, Role = ? where NumCompte = ${id} ;`
            pool.query(sqlQuery, [nom, prenom, fon, tele, role], (err, resolve) => {
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


// Delete User 
router.route("/delete/:id")
    .delete((req, res, next) => {
        const id = req.params.id
        const sqlQuery = "delete from compte where NumCompte = ? ;"
        pool.query(sqlQuery, id, (err, resolve) => {
            if(err) res.json({err : err})
            if(resolve){
                res.json({data : resolve})
                next()
            }
        })
    })

module.exports = router