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


router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(fileUpload())
router.use(cors({origin : 'http://localhost:3000', credentials : true}))


///// ENREGISTRER CATEGORIE
router.route("/categorie/new")
    .post((req, res) => {
        const caat = req.body.caat 
        if(caat != ""){
            try{
                const sqlQuery = "insert into categorie (NomCategorie) values (?) ;"
                pool.query(sqlQuery, caat, (err, resolve)=> {
                    if(err) 
                    {
                        if(err.sqlMessage === `Duplicate entry '${caat}' for key 'PRIMARY'`){
                            //console.log(err)
                            res.json({duplicate : "cette categorie déjà existe"})
                        }
                    }
                    if(resolve){
                        if(resolve.affectedRows != 0){
                            res.json({message : "Inserted"})
                        }
                        else if(resolve.sqlMessage === `Duplicate entry '${caat}' for key 'PRIMARY'`){
                            //console.log(err)
                            res.json({duplicate : "cette categorie déjà existe"})
                        }
                        else{
                            res.json({messageErr : "bad"})
                        }
                    }
                })
            }
            catch{
                console.log("catched")
            }
        }
    })

///// Lister Les Categories :
router.route("/categorie/all")
    .get((req, res) => {
        const sqlQuery = "select * from categorie order by NomCategorie ;"
        pool.query(sqlQuery, (err, resolve) => {
            if(err){
                res.json({err : "Failed to load Cat"})
            }
            if(resolve){
                res.json(resolve)
            }
        })
    })



//// ENREGISTRER UNE Dépense 
router.route("/new")
    .post((req, res) => {
        const id = req.body.id
        const cate = req.body.typeDep
        const date = req.body.selectedDate
        const montant = req.body.montant
        const fac = req.body.fact 
        const desc = req.body.detail 
        console.log(id)
        if(id !== "" && cate !== "" && montant !== "" && fac !== "" && desc !== ""){
            if(date !== null){
                sqlQuery = "insert into depense (NumCompte, NomCategorie, dateDepense, MontantDepense, facture, descriptionDepense) values (?, ?, ?, ?, ?, ?) ;"
                pool.query(sqlQuery, [id, cate, date, montant, fac, desc], (err, resolve) => {
                    if(err){
                        console.log(err)
                        res.json({err : err})
                    }
                    if(resolve){
                        if(resolve.affectedRows != 0){
                            res.json({message : "Inserted"})
                        }
                        else{
                            res.json({messageErr : "bad"})
                        }
                    }
                })
            }
            else{
                sqlQuery = "insert into depense (NumCompte, NomCategorie, MontantDepense, facture, descriptionDepense) values (?, ?, ?, ?, ?) ;"
                pool.query(sqlQuery, [id, cate, montant, fac, desc], (err, resolve) => {
                    if(err){
                        console.log(err)
                        res.json({err : err})
                    }
                    if(resolve){
                        if(resolve.affectedRows != 0){
                            res.json({message : "Inserted"})
                        }
                        else{
                            res.json({messageErr : "bad"})
                        }
                    }
                })
            }
        }
    })


//// Lister All Dépenses
router.route("/all")
    .get((req, res) => {

    })

module.exports = router