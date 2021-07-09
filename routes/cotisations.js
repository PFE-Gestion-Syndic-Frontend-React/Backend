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

////// Paiement espèce
router.route('/new/espece')
    .post(async (req, res) => {
        const {id, paied, log, mois, montant, methode} = req.body
        if(paied !== "" && log !== "" && id !== "" && mois !== "" && methode !== "" && montant !== ""){
            const sqlQuery = "insert into paiement (RefPaiement, RefLogement, NumCompte, NbrMois, MethodePaiement, Montant) values (?, ?, ?, ?, ?, ?)"
            pool.query(sqlQuery, [paied, log, id, mois, methode, montant], (err, resolve) => {
                if(err){ 
                    res.json({messageErr : err}) 
                    console.log(err) 
                }
                if(resolve){
                    if(resolve.affectedRows != 0){
                        //res.json({message : "Inserted"})
                    }
                    else{
                        res.json({messageErr : "bad"})
                    }
                }
            })
            
            const insertQuery = "CALL Calendrier(?, ?, ?) ;"
            await pool.query(insertQuery, [log, paied, mois], async (error, result)  => {
                if(error){ 
                    res.json({messageErr : error}) 
                    console.log(error) 
                }
                if(result){
                    if(result.affectedRows != 0){
                        res.json({message : "Inserted"})
                    }
                    else{
                        res.json({messageErr : "bad"})
                    }
                }
            })
        }
    })

//////// Paiement par Chèque
router.route('/new/cheque')  
    .post(async (req, res) => {
        const {id, paied, log, mois, montant, methode, cheque, bnq} = req.body
        if(paied !== "" && log !== "" && id !== "" && mois !== "" && methode !== "" && montant !== "" && cheque !== "" && bnq !== ""){
            const sqlQuery = "call inert_paiement_cheque(?, ?, ?, ?, ?, ?, ?, ?) ;"
            pool.query(sqlQuery, [paied, log, id, mois, methode, montant, cheque, bnq], async (err, resolve) => {
                if(err){ 
                    res.json({messageErr : err}) 
                    console.log(err) 
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

            const insertQuery = "CALL Calendrier(?, ?, ?) ;"
            await pool.query(insertQuery, [log, paied, mois], async (error, result)  => {
                if(error){ 
                    res.json({messageErr : error}) 
                    console.log(error) 
                }
                if(result){
                    if(result.affectedRows != 0){
                        res.json({message : "Inserted"})
                    }
                    else{
                        res.json({messageErr : "bad"})
                    }
                }
            })
        }
    })

/////// lister all Cotisations :
router.route('/all')
    .get((req, res) => {
        const token = req.headers['authorization']
        if(token !== undefined && token !== ""){
            if(token.length > 150){
                const sqlQuery = "call data_Cotisation()"   
                pool.query(sqlQuery, (err, data) => {
                    if(!err){
                        if(data.length !== 0){
                            console.log(data)
                            res.json(data)
                        }
                    }
                    else{
                        console.log("No Paiements")
                        res.json({msgErr : "No Paiements"})
                    }
                })
            }
            else{
                console.log("Invalid Token")
                res.json({msgErr : "Invalid Token"})
            }
        }
        else{
            console.log("No Token at all")
            res.json({msgErr : "No Token at all"})
        }
    })

/////////// LISTER MES COTISATIONS COPROPRIETAIRE :::::::::
router.route('/mesCotisations/:id')
    .get( async (req, res) => {
        const token = req.headers['authorization']
        if(token !== undefined && token !== ""){
            if(token.length > 150){
                const {id} = req.params 
                //if(coproprietaire !== undefined){
                    const sqlQuery = `call data_mes_cotisations('${id}')`   
                    await pool.query(sqlQuery, (err, data) => {
                        if(err){
                            //console.log("No Paiements")
                            if(err.sqlMessage === "Unknown column 'NaN' in 'field list'"){
                                return res.send("TRY Later Oky")
                            }
                            else if(err.code === "ER_PARSE_ERROR"){
                                return res.send("It's Not YOU Damn")
                            }
                            res.json({msgErr : err})
                        }
                        if(data){
                            //console.log(` DATA :: ${data} `)
                            if(data.length !== 0){
                                //console.log(data)
                                res.json(data)
                            }
                            else{
                                console.log("No Length")
                            }
                        }
                    })
                /*}
                else{
                    console.log("NO ID")
                }*/
            }
            else{
                console.log("Invalid Token")
                res.json({msgErr : "Invalid Token"})
            }
        }
        else{
            console.log("No Token at all")
            res.json({msgErr : "No Token at all"})
        }
    })

////////// SEARCH MES COTISATIONS BY :::::
router.route('/mesCotisations/:search')
    .get((req, res) => {
        const search = req.params.search
        const token = req.headers['authorization']
        if(token !== undefined && token !== ""){
            if(token.length > 150){
                if(search !== ""){
                    const sqlQuery = `SELECT p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque from compte co, cheque c right JOIN paiement p on c.RefPaiement = p.RefPaiement INNER JOIN calendrier cal on cal.RefPaiement = p.RefPaiement WHERE co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement ) and (p.RefPaiement LIKE '%${search}%' or co.NomCompte LIKE '%${search}%' OR co.PrenomCompte LIKE '%${search}%' OR p.MethodePaiement LIKE '%${search}%') ORDER by p.RefPaiement DESC;` 
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
                                res.json({msggg : "No Paiments"})
                            }
                        }
                    })
                }
            }
            else{
                console.log("Invalid Token")
                res.json({msgErr : "Invalid Token"})
            }
        }
        else{
            console.log("No Token at all")
            res.json({msgErr : "No Token at all"})
        }
    })


/////// Search by :
router.route('/:search')
    .get((req, res) => {
        const search = req.params.search
        const token = req.headers['authorization']
        if(token !== undefined && token !== ""){
            if(token.length > 150){
                if(search !== ""){
                    const sqlQuery = `SELECT p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque from compte co, cheque c right JOIN paiement p on c.RefPaiement = p.RefPaiement INNER JOIN calendrier cal on cal.RefPaiement = p.RefPaiement WHERE co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement ) and (p.RefPaiement LIKE '%${search}%' or co.NomCompte LIKE '%${search}%' OR co.PrenomCompte LIKE '%${search}%' OR p.MethodePaiement LIKE '%${search}%') ORDER by p.RefPaiement DESC;` 
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
                                res.json({msggg : "No Paiments"})
                            }
                        }
                    })
                }
            }
            else{
                console.log("Invalid Token")
                res.json({msgErr : "Invalid Token"})
            }
        }
        else{
            console.log("No Token at all")
            res.json({msgErr : "No Token at all"})
        }
    })



module.exports = router