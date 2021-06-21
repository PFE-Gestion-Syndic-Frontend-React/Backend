const express = require("express")
let router = express.Router()
const bcrypt = require("bcrypt")
const saltRounds = 10 // used for Hashing length
const fileUpload = require("express-fileupload")
require("dotenv").config()
const bodyparser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const fs = require("fs");


router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(fileUpload())
router.use(cors({origin : 'http://localhost:3000', credentials : true}))

// Create New Account
router.route("/new")
    .post((req, res, next) => {
        const nom = req.body.nom 
        const prenom = req.body.prenom
        const email = req.body.email
        const tele = req.body.tele 
        const role = req.body.role
        const photo = req.files
        const fonc = req.body.fonc
        const pwd = nom + "@" + prenom 

        if(photo !== null){
            const file = req.files.file
            file.mv(`${__dirname}/../Client/public/profile img/${file.name}`, (err) => {
                if(err){
                    console.log(err)
                    return res.status(500)
                }
                res.json("Uploaded")
            })
        }


        if(nom !== "" && prenom !== "" && email !== "" && tele !== "" && role !== "" && fonc !== "" ){
            bcrypt.hash(pwd, saltRounds, (err, hash) => {
                if(err){
                    console.log(err)
                }
                /*if(photo !== ""){
                

                    const SQLQuery = "insert into compte (NomCompte, PrenomCompte, Role, fonc, EmailCompte, telephone, PasswordCompte, photo) values (?, ?, ?, ?, ?, ?, ?, ?)"
                    pool.query(SQLQuery, [nom, prenom, role, fonc, email, tele, hash, photo], (err, resolve) => {
                        if(err){ res.json({messageErr : err}) }
                        else{
                            if(resolve){
                                if(resolve.affectedRows != 0){
                                    res.json({message : "Inserted"})
                                }
                            }
                        }
                    })
                }
                else{*/
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
                //}
            })
        }
        else{
            console.log("Required")
        }
    })
    

// Listing Users
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
        const { nom, prenom, fon, tele, role, photo } = req.body
        if(photo === ""){
            const sqlQuery = `update compte set NomCompte = ?, PrenomCompte = ?, Role = ?, fonc = ?, telephone = ? where NumCompte = ${id} ;`
            pool.query(sqlQuery, [nom, prenom, fon, tele, role, id], (err, resolve) => {
                if(err) console.log(err)
                if(resolve){
                    console.log(resolve)
                    if(resolve.changedRows != 0){
                        res.json({message : "Updated Successfully"})
                        console.log("Updated")
                    }
                    else{
                        res.json({messageErr : "Update Failed"})
                        console.log("Failed")
                    }
                }
                else{
                    res.json({message : "err"})
                    console.log("err")
                }
            })
        }
        else{
            const sqlQuery = "update compte set NomCompte = ?, PrenomCompte = ?, Role = ?, fonc = ?, telephone = ?, photo = ? where NumCompte = ? ;"
            pool.query(sqlQuery, [nom, prenom, fon, tele, role, id], (err, resolve) => {
                if(err) console.log(err)
                if(resolve){
                    if(resolve.changedRows != 0){
                        res.json({message : "Updated Successfully"})
                        console.log("Upda")
                    }
                    else{
                        res.json({messageErr : "Update Failed"})
                        console.log("fai")
                    }
                }
                else{
                    console.log("error")
                }
            })
        }
    })


// Delete User 
router.route("/delete/:id")
    .delete((req, res) => {
        const id = req.params.id
        const sqlQuery = "delete from compte where NumCompte = ? ;"
        pool.query(sqlQuery, id, (err, resolve) => {
            if(err) res.json({err : err})
            if(resolve){
                console.log(resolve)
                res.json({data : resolve})
            }
        })
    })

module.exports = router