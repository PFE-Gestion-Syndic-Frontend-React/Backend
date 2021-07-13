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
        const caat = req.body.cat 
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
                            res.json({duplicate : "cette categorie déjà existe"})
                        }
                        else if(resolve.sqlMessage === "Column 'NomCategorie' cannot be null" || resolve.code === 'ER_BAD_NULL_ERROR'){
                            res.json({err : "NomCategorie is Null"})
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
        const {id, typeDepense, date, montant, fact, detail} = req.body
        //console.log(`id : ${id} et  dep : ${typeDepense}  et date  :  ${date}   et   montant :  ${montant}  et  ${fact}  et  detailllss :  ${detail}`)
        if(id !== "" && typeDepense !== "" && montant !== "" && fact !== "" && detail !== ""){
            if(date !== null && date !== undefined){
                sqlQuery = "insert into depense (NumCompte, NomCategorie, dateDepense, MontantDepense, facture, descriptionDepense) values (?, ?, ?, ?, ?, ?) ;"
                pool.query(sqlQuery, [id, typeDepense, date, montant, fact, detail], (err, resolve) => {
                    if(err){
                        if(err.sqlMessage === "Column 'NomCategorie' cannot be null" || err.code === 'ER_BAD_NULL_ERROR'){
                            res.json({err : "NomCategorie is Null"})
                        }
                        else{
                            console.log(err)
                            res.json({err : err})
                        }
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
                pool.query(sqlQuery, [id, typeDepense, montant, fact, detail], (err, resolve) => {
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
        const token = req.headers['authorization']
        if(token.length > 150){
            const sqlQuery = "select d.RefDepense, c.NomCompte, c.PrenomCompte, d.NomCategorie, d.dateDepense, d.MontantDepense, d.facture, d.descriptionDepense from compte c, depense d where c.NumCompte = d.NumCompte and c.Role = 'Administrateur' order by d.RefDepense desc ;"
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length !== 0){
                        //console.log(data)
                        res.json(data)
                    }
                }
                else{
                    console.log("No Dépense")
                    res.json( "No Dépense") 
                }
            })
        }
        else{
            res.json({msgErr : "No Token Set"})
        }
    })


//// Search dépense by ...
router.route("/:search")
    .get((req, res) => {
        const search = req.params.search
        if(search !== ""){
            const sqlQuery = `select d.RefDepense, c.NomCompte, c.PrenomCompte, d.NomCategorie, d.dateDepense, d.MontantDepense, d.facture, d.descriptionDepense from compte c, depense d where c.NumCompte = d.NumCompte and c.Role = 'Administrateur' and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}' or d.NomCategorie like '%${search}%' or d.dateDepense like '%${search}%' or d.facture like '%${search}%' or d.descriptionDepense like '%${search}%') order by d.RefDepense desc ;`
            pool.query(sqlQuery, (err, resolve) => {
                if(err){
                    return res.send(err)
                }
                if(resolve){
                    if(resolve.length > 0){
                        return res.json(resolve)
                    }
                    else{
                        return res.send("No Dépense")
                    }
                }
            })
        }
    })





///// Get Dépense by RefDépense 
router.route("/depense/:refDepense")
    .get((req, res) => {
        const refDepense = req.params.refDepense
        if(refDepense){
            const sqlQuery = `select c.NomCompte, c.PrenomCompte, c.fonc, d.MontantDepense, d.descriptionDepense, d.NomCategorie, d.facture from depense d, compte c where d.NumCompte = c.NumCompte and RefDepense = ${refDepense} ;`
            pool.query(sqlQuery, (err, resolve) => {
                if(err){
                    res.json({msgErr : "Err"})
                }
                if(resolve.length > 0){
                    res.json(resolve)
                }
                else{
                    res.json({msgErr : "Not Found"})
                }
            })
        }
    })

/////// UPDATE Dépense 
router.route("/edit/:refDepense")
    .put((req, res) => {
        const refDepense = req.params.refDepense
        const {montant, fac, desc} = req.body
        //console.log("montant  :  " + montant + "   fac :  " + fac + "   desc : " + desc)
        const sqlQuery = `update depense set MontantDepense = ?, facture = ?, descriptionDepense = ? where RefDepense = ${refDepense};`
        pool.query(sqlQuery, [montant, fac, desc], (err, resolve) => {
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
    })


/////// Delete Dépense
router.route("/delete/:refDepense")
    .delete((req, res, next) => {
        const refDepense = req.params.refDepense
        const sqlQuery = `delete from depense where RefDepense = ${refDepense} ;`
        pool.query(sqlQuery, async (err, resolve) => {
            if(err){
                console.log(err)
                res.json(err)
            }
            if(resolve){
                if(resolve.message){
                    res.json("Deleted ALL")
                    next()
                }
            }
            else{
                res.json("No Resolving")
            }
        })
    })







module.exports = router