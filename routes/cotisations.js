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


/////// EDIT PAIEMENT 
router.route('/edit/:RefPaiement')
    .put(async (req, res) => {
        const RefPaiement = req.params.RefPaiement
        const {mois, montant, methode, cheque, bnq} = req.body
        if(methode === "Espèce"){
            const sqlQuery = `call up_espece_paied('${RefPaiement}', ${mois}, ${montant}, '${methode}') ; `
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    console.log(err)
                    res.send(err)
                }
                if(data){
                    console.log(data)
                    res.send(data)
                }
            })
        }
        else{
            if(cheque !== undefined && bnq !== undefined){
                const sqlQuery = `call up_cheque_paied('${RefPaiement}', ${mois}, ${montant}, '${methode}', '${cheque}', '${bnq}') ; `
                pool.query(sqlQuery, (err, data) => {
                    if(err){
                        if(err.sqlMessage === 'Cannot add or update a child row: a foreign key constraint fails (`db_syndicat`.`cheque`, CONSTRAINT `fk_che_pai` FOREIGN KEY (`RefPaiement`) REFERENCES `paiement` (`RefPaiement`) ON DELETE CASCADE ON UPDATE CASCADE)'){
                            return res.send("Introuvable")
                        }
                    }
                    if(data){
                        console.log(data)
                        res.send(data)
                    }
                })
            }
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
                res.json({msgErr : "No Token"})
            }
        }
        else{
            res.json({msgErr : "No Token"})
        }
    })

/////////// LISTER MES COTISATIONS COPROPRIETAIRE :::::::::
router.route('/mesCotisations/:id')
    .get( async (req, res) => {
        const token = req.headers['authorization']
        if(token !== undefined && token !== ""){
            if(token.length > 150){
                const {id} = req.params 
                const sqlQuery = `call data_mes_cotisations('${id}')`   
                await pool.query(sqlQuery, (err, data) => {
                    if(err){
                        if(err.sqlMessage === "Unknown column 'NaN' in 'field list'"){
                            return res.send("TRY Later Oky")
                        }
                        else if(err.code === "ER_PARSE_ERROR"){
                            return res.send("It's Not YOU Damn")
                        }
                    }
                    if(data){
                        if(data[0].length !== 0){
                            return res.send(data[0])
                        }
                        else{
                            return res.send("No Cotisation")
                        }
                    }
                })

            }
            else{
                return res.send("Invalid Token")
            }
        }
        else{
            return res.send("No Token at all")
        }
    })

////////// SEARCH MES COTISATIONS BY :::::
router.route('/mesCotisations/:id/:search')
    .get((req, res) => {
        const {id, search} = req.params
        const token = req.headers['authorization']
        if(token !== undefined && token !== ""){
            if(token.length > 150){
                if(search !== "" && id !== ""){
                    const sqlQuery = `SELECT p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque from compte co, cheque c right JOIN paiement p on c.RefPaiement = p.RefPaiement INNER JOIN calendrier cal on cal.RefPaiement = p.RefPaiement WHERE co.NumCompte = ${id} and co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement ) and (p.RefPaiement LIKE '%${search}%' or co.NomCompte LIKE '%${search}%' OR co.PrenomCompte LIKE '%${search}%' OR p.MethodePaiement LIKE '%${search}%' OR p.datePaiement LIKE '%${search}%') ORDER by p.RefPaiement DESC;` 
                    pool.query(sqlQuery, (err, data) => {
                        if(err){
                            if(err.sqlMessage === "Unknown column 'NaN' in 'field list'"){
                                return res.send("TRY Later Oky")
                            }
                            else if(err.code === "ER_PARSE_ERROR"){
                                return res.send("It's Not YOU Damn")
                            }
                        }
                        if(data){
                            if(data.length !== 0){
                                return res.send(data)
                            }
                            else{
                                return res.send("No Cotisation")
                            }
                        }
                    })
                }
            }
            else{
                return res.send("Invalid Token")
            }
        }
        else{
            return res.send("No Token at all")
        }
    })

////////// GETDATA By Paiement ::
router.route('/getData/:RefPaiement')
    .get((req, res) => {
        const RefPaiement = req.params.RefPaiement 
        const sqlQuery = `call getData_Paiement_by_RefPaiement('${RefPaiement}')`
        pool.query(sqlQuery, (err, resolve) => {
            if(err){
                return res.send("err")
            }
            if(resolve){
                if(resolve.length != 0){
                    res.send(resolve[0])
                }
            }
        })
    })

/////// READ les IMPAYES //// 
router.route('/getImpayes') 
    .get((req, res) => {
        const sqlQuery = "call Get_All_Les_Impayes()"
        pool.query(sqlQuery, (err, resolve) => {
            if(err){
                return res.send(err)
            }
            if(resolve.length !== 0){
                res.send(resolve[0])
            }
            else{
                res.send("Not Found")
            }
        })
    })


//////// Consulter Les IMPAYES ///
router.route('/getImpayes/:searchBy')
    .get((req, res) => {
        const search = req.params.searchBy 
        const sqlQuery = `SELECT c.NumCompte, c.NomCompte, c.PrenomCompte, c.EmailCompte, c.telephone, cal.Au as du, ceil(datediff(CURRENT_TIMESTAMP, cal.Au) / 30) as periode, date_add(cal.Au, INTERVAL ceil(datediff(CURRENT_TIMESTAMP, cal.Au) / 30) month) as todate, l.RefLogement, p.datePaiement, p.MethodePaiement, ch.NumeroCheque, ch.Banque FROM compte c, calendrier cal, logement l, paiement p LEFT JOIN cheque ch ON p.RefPaiement = ch.RefPaiement WHERE c.NumCompte = l.NumCompteCop AND p.RefLogement = l.RefLogement AND cal.RefPaiement = p.RefPaiement AND (c.NomCompte LIKE '%${search}%' OR c.PrenomCompte LIKE '%${search}%' OR c.EmailCompte LIKE '%${search}%' OR c.telephone LIKE '%${search}%' OR cal.Au LIKE '%${search}%' OR l.RefLogement LIKE '%${search}%' OR ch.NumeroCheque LIKE '%${search}%' OR ch.Banque LIKE '%${search}%') GROUP BY c.NumCompte HAVING cal.Au < CURRENT_TIMESTAMP() AND COUNT(l.RefLogement) < 2 ORDER BY cal.RefCalendrier DESC ;`
        pool.query(sqlQuery, (err, data) => {
            if(err){
                console.log(err)
                res.send(err)
            }
            if(data){
                if(data.length > 0){
                    res.send(data)
                }
                else{
                    res.send("Not Found")
                }
            }
        })
    })


///////// DELETE Cotisation 
router.route('/delete/:RefPaiement')
    .delete((req, res) => {
        const RefPaiement = req.params.RefPaiement
        if(RefPaiement !== "" && RefPaiement !== undefined){
            const sqlQuery = `delete from paiement where RefPaiement = '${RefPaiement}' ;`
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    res.send(err)
                    console.log(err)
                }
                if(data){
                    if(data.affectedRows === 0){
                        res.send("No Cotisation")
                    }
                    else if(data.affectedRows !== 0){
                        res.send("Deleted")
                    }
                }
            })
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
                    const sqlQuery = `SELECT p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque from compte co, cheque c right JOIN paiement p on c.RefPaiement = p.RefPaiement INNER JOIN calendrier cal on cal.RefPaiement = p.RefPaiement WHERE co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement ) and (p.RefPaiement LIKE '%${search}%' or co.NomCompte LIKE '%${search}%' OR co.PrenomCompte LIKE '%${search}%' OR p.MethodePaiement LIKE '%${search}%') ORDER by cal.RefCalendrier DESC;` 
                    pool.query(sqlQuery, (err, data) => {
                        if(err){
                            return res.send(err)
                        }
                        if(data){
                            if(data.length !== 0){
                                return res.send(data)
                            }
                            else{
                                return res.send("No Paiements")
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