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
const { requireAdmin, requireAuth } = require("../app")

const multer = require('multer')



router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(fileUpload())
router.use(cors({origin : 'http://localhost:3000', credentials : true}))


//// Find Account by Email
router.route("/byEmail/:email")
    .get((req, res) => {
        const email = req.params.email
        const sqlQuery = "select NumCompte, NomCompte, PrenomCompte, telephone, EmailCompte from Compte where EmailCompte = ? and Role = 'Copropriétaire' ;"
        pool.query(sqlQuery, email, (err, data) => {
            if(err){
                res.send({msg : "err"})
            }
            if(data){
                //console.log(data)
                if(data){
                    //console.log(data)
                    res.json(data)
                }
                else{
                    res.send({msg : "Cooool"})
                }
            }
        })
    })

/////// New Logement 
router.route("/new")
    .post((req, res) => {
        const refLog = req.body.refLog
        const type = req.body.type
        const user = req.body.user 
        if(refLog !== "" && type !== "" && user !== ""){
            const sqlQuery = "insert into logement (RefLogement, type, NumCompteCop) values (?, ?, ?)"
            pool.query(sqlQuery, [refLog, type, user], (err, resolve) => {
                if(err){ 
                    res.json({messageErr : err}) 
                    console.log(err) 
                }
                try{
                    if(resolve){
                        //console.log(resolve)
                        if(resolve.affectedRows != 0){
                            res.json({message : "Inserted"})
                        }
                        else{
                            res.json({messageErr : "bad"})
                        }
                    }
                }
                catch{
                    res.json({mssg : "le Logement est Déjà Inseré !"})
                }
            })
        }
    })

//// All Logements 
router.route("/all")
    .get((req, res) => {
        const sqlQuery = "select c.NumCompte, c.NomCompte, c.PrenomCompte, c.EmailCompte, c.telephone, l.RefLogement from compte c, logement l where c.NumCompte = l.NumCompteCop and c.Role = 'Copropriétaire' order by l.RefLogement desc ;"
        pool.query(sqlQuery, (err, resolve) => {
            if(err){
                res.json({err : err})
            }
            if(resolve){
                //console.log(resolve)
                res.json(resolve)
            }
        })
    })

// Searching users By ... 
router.route("/:search")
    .get((req, res) => {
        const search = req.params.search
        if(search !== ""){
            const sqlQuery = `select c.NumCompte, c.NomCompte, c.PrenomCompte, c.EmailCompte, c.telephone, l.RefLogement from compte c, logement l where c.NumCompte = l.NumCompteCop and c.Role = 'Copropriétaire'and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or c.EmailCompte like '%${search}%' or c.telephone like '%${search}%' or l.RefLog like '%${search}%') order by c.NumCompte desc ;`
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
                        res.json({msggg : "No Logements"})
                    }
                }
            })
        }
    })

module.exports = router