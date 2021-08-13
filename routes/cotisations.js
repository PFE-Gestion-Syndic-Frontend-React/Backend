const express = require("express")
let router = express.Router()
require("dotenv").config()
const bodyparser = require("body-parser")
const cors = require("cors")
const pdf = require('html-pdf')
const pdfTemplate = require("./doc impaye/index.js");
const pdfTemplates = require("./doc mes cotisations/index.js");

router.use(bodyparser.urlencoded({extended: true}))
router.use(bodyparser.json())
router.use(express.json())
router.use(cors({origin : `http://localhost:3000`, credentials : true}))

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

///////// Cotisations par Periode : 
router.route('/periode')
    .post((req, res) => {
        const perd = req.body.perd
        if(perd === 1){
            const sqlQuery = "select p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque, a.NomCompte as NomAdmin, a.PrenomCompte as PrenomAdmin from compte co, compte a, calendrier cal, cheque c right join paiement p on c.RefPaiement = p.RefPaiement where a.NumCompte = p.NumCompte AND co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement) and cal.RefPaiement = p.RefPaiement and month(CURRENT_TIMESTAMP) = month(p.datePaiement) and year(CURRENT_TIMESTAMP) = year(p.datePaiement) ORDER BY cal.RefCalendrier DESC ;"   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length !== 0){  
                        res.json(data)
                    }
                }
                else{
                    res.json({msgErr : "No Paiements"})
                }
            })
        }
        else if(perd === 3){
            const sqlQuery = "select p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque, a.NomCompte as NomAdmin, a.PrenomCompte as PrenomAdmin from compte co, compte a, calendrier cal, cheque c right join paiement p on c.RefPaiement = p.RefPaiement where a.NumCompte = p.NumCompte AND co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement) and cal.RefPaiement = p.RefPaiement and datediff(CURRENT_TIMESTAMP, p.datePaiement) between 0 and 92 ORDER BY cal.RefCalendrier DESC ;"   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length !== 0){  
                        res.json(data)
                    }
                }
                else{
                    res.json({msgErr : "No Paiements"})
                }
            })
        }
        else if(perd === 6){
            const sqlQuery = "select p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque, a.NomCompte as NomAdmin, a.PrenomCompte as PrenomAdmin from compte co, compte a, calendrier cal, cheque c right join paiement p on c.RefPaiement = p.RefPaiement where a.NumCompte = p.NumCompte AND co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement) and cal.RefPaiement = p.RefPaiement and datediff(CURRENT_TIMESTAMP, p.datePaiement) between 0 and 183 ORDER BY cal.RefCalendrier DESC ;"   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length !== 0){  
                        res.json(data)
                    }
                }
                else{
                    res.json({msgErr : "No Paiements"})
                }
            })
        }
    })

/////// lister all Cotisations :
router.route('/all')
    .get((req, res) => {
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
    })

//////////////////////////////////////////////////
/////////// AJOUTER 2 APIS ID/RefLog /////////////
router.route('/mesCotisations/:RefLogement/:id')
    .get( async (req, res) => {
        const {id, RefLogement} = req.params 
        const sqlQuery = `call data_mes_cotisations_By_Log('${RefLogement}', '${id}')`   
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
    })


//////////////////////////////////////////////////    
/////////// LISTER MES COTISATIONS COPROPRIETAIRE :::::::::
router.route('/mesCotisations/:id')
    .get( async (req, res) => {
        const {id, RefLogement} = req.params 
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
    })

////////// SEARCH MES COTISATIONS BY :::::
router.route('/mesCotisations/:id/:search')
    .get((req, res) => {
        const {id, search} = req.params
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
    })

///////// GetLastPaiement ::::
router.route('/getLastPaiement/:log')
    .get((req, res) => {
        const log = req.params.log
        if(log !== "" && log !== undefined){
            const sqlQuery = `select p.RefPaiement, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.DU, cal.AU, ceil(datediff(CURRENT_DATE, cal.Au)/ 30) as difs from paiement p, calendrier cal WHERE cal.RefPaiement = p.RefPaiement AND p.RefLogement = '${log}' ORDER BY cal.RefCalendrier DESC LIMIT 1`
            pool.query(sqlQuery, (err, result) => {
                if(err) return res.send(err)
                else if(result){
                    return res.send(result)
                }
            })
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
                res.json({res1 : resolve[0], res2 : resolve[1]})
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
        const sqlQuery1 = `SELECT c.NumCompte, c.NomCompte, c.PrenomCompte, c.EmailCompte, c.telephone, cal.Au as du, ceil(datediff(CURRENT_TIMESTAMP, cal.Au) / 30) as periode, date_add(cal.Au, INTERVAL ceil(datediff(CURRENT_TIMESTAMP, cal.Au) / 30) month) as todate, l.RefLogement, p.datePaiement, p.MethodePaiement, ch.NumeroCheque, ch.Banque FROM compte c, calendrier cal, logement l, paiement p LEFT JOIN cheque ch ON p.RefPaiement = ch.RefPaiement WHERE c.NumCompte = l.NumCompteCop AND p.RefLogement = l.RefLogement AND cal.RefPaiement = p.RefPaiement AND (c.NomCompte LIKE '%${search}%' OR c.PrenomCompte LIKE '%${search}%' OR c.EmailCompte LIKE '%${search}%' OR c.telephone LIKE '%${search}%' OR cal.Au LIKE '%${search}%' OR l.RefLogement LIKE '%${search}%' OR ch.NumeroCheque LIKE '%${search}%' OR ch.Banque LIKE '%${search}%') GROUP BY c.NumCompte HAVING cal.Au < CURRENT_TIMESTAMP() AND COUNT(l.RefLogement) < 2 ORDER BY cal.RefCalendrier DESC ;`
        const sqlQuery = `call Get_Les_Imapayes_By('${search}')`
        pool.query(sqlQuery, (err, data) => {
            if(err){
                console.log(err)
                res.send(err)
            }
            if(data){
                if(data.length !== 0){
                    res.json({res1 : data[0], res2 : data[1]})
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

//////// Create PDF Modele pour les IMPAYES
router.route('/impaye/create-pdf')
    .post((req, res) => {
        const sqlQuery = `call Get_All_Les_Impayes()`
        pool.query(sqlQuery, (er, result) => {
            if(er) return res.send(er)
            if(result){
                let impaye = result[0]
                let never = result[1]
                pdf.create(pdfTemplate(impaye, never), {}).toFile(`${__dirname}/doc impaye/impaye.pdf`, (err) => {
                    if(err){
                        res.send(Promise.reject())
                    }
                    res.send(Promise.resolve())
                })
            }
        })
    })

////// Get The File 
router.route('/impaye/fetch-pdf')
    .get((req, res) =>{
        try{
            res.sendFile(`${__dirname}/doc impaye/impaye.pdf`)
        }
        catch(err){
            console.log("No Way .... ", err)
        }
    })

//////// Generate File PDF Ma Situation Financière en tant que Copropriétaire
router.route('/maSituation/create-pdf')
    .post((req, res) => {
        const situation = req.body.data
        if(situation !== "" && situation !== undefined){
            pdf.create(pdfTemplates(situation), {}).toFile(`${__dirname}/doc mes cotisations/MaSituation.pdf`, err => {
                if(err){
                    res.send(Promise.reject())
                }
                res.send(Promise.resolve())
            })
        }
    })

//////// Get The File PDF Ma Situation Financière 
router.route('/maSituation/fetch-pdf')
    .get((req, res) =>{
        try{
            res.sendFile(`${__dirname}/doc mes cotisations/MaSituation.pdf`)
        }
        catch(err){
            console.log("No Way .... ", err)
        }
    })



/////// Search by :
router.route('/:search')
    .get((req, res) => {
        const search = req.params.search
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
    })



module.exports = router