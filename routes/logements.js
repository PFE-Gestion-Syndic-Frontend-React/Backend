const express = require("express")
let router = express.Router()
require("dotenv").config()
const bodyparser = require("body-parser");
const cors = require("cors")
//const pdf = require('html-pdf')
//const pdfTemplate = require("./documents situation coproprietaire")



router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(cors({origin : `http://localhost:3000`, credentials : true}))


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
                if(data){
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
                    if(err.sqlMessage === `Duplicate entry '${refLog}' for key 'PRIMARY'`){
                        res.json({messageErr : "le Logement est Déjà Inseré !"})
                    }
                }
                try{
                    if(resolve){
                        if(resolve.affectedRows != 0){
                            res.json({message : "Inserted"})
                        }
                        else{
                            res.json({messageErr : "bad"})
                        }
                    }
                }
                catch{
                    res.json({messageErr : "le Logement est Déjà Inseré !"})
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
                res.send(err)
            }
            if(resolve){
                if(resolve.length !== 0){
                    res.send(resolve)
                }
                else{
                    res.send("No Logement")
                }
            }
        })
    })

//// copropriétaire ByEmail     
router.route("/Coproprietaire/byEmail")
    .get((req, res) => {
        const sqlQuery = "select c.NumCompte, c.NomCompte, c.PrenomCompte, c.EmailCompte from compte c where c.Role = 'Copropriétaire' order by c.NumCompte desc ;"
        pool.query(sqlQuery, (err, resolve) => {
            if(err){
                res.json({err : err})
            }
            if(resolve){
                res.json(resolve)
            }
        })
    })


// Searching users By ... 
router.route("/:search")
    .get((req, res) => {
        const search = req.params.search
        if(search !== ""){
            const sqlQuery = `select c.NumCompte, c.NomCompte, c.PrenomCompte, c.EmailCompte, c.telephone, l.RefLogement from compte c, logement l where c.NumCompte = l.NumCompteCop and c.Role = 'Copropriétaire' and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or c.EmailCompte like '%${search}%' or c.telephone like '%${search}%' or l.RefLogement like '%${search}%') order by c.NumCompte desc ;`
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    res.send(err)
                }
                if(data){
                    if(data.length !== 0){
                        res.send( data )
                    }
                    else{
                        res.send("No Logement")
                    }
                }
            })
        }
    })

///// Copropriétaire INFO et Logement
router.route("/coproprietaire/:refLogement")
    .get((req, res) => {
        const refLogement = req.params.refLogement
        if(refLogement !== ""){
            const sqlQuery = `select c.NumCompte, c.NomCompte, c.PrenomCompte, c.EmailCompte, c.telephone, c.photo, l.RefLogement from compte c, logement l where c.NumCompte = l.NumCompteCop and c.Role = 'Copropriétaire' and l.RefLogement = ? order by c.NumCompte desc ;`
            pool.query(sqlQuery, refLogement, (err, data) => {
                if(err){
                    res.send(err)
                }
                if(data){
                    if(data.length !== 0){
                        res.send(data)
                    }
                    else{
                        res.send("No Logement")
                    }
                }
            })
        }
    })


////// Modifier Logement copropriétaire
router.route('/edit/:refLogement')
    .put((req, res) => {
        const refLogement = req.params.refLogement
        const coproprietaire = req.body.num
        if(refLogement !== "" && coproprietaire !== ""){
            const sqlQuery = `update logement set NumCompteCop = ? where RefLogement = '${refLogement}' ;`
            pool.query(sqlQuery, parseInt(coproprietaire), (err, resolve) =>{
                if(err){
                    res.json(err)
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
        }
    })


///// Details of cotisations of logement
router.route('/info/:refLogement')
    .get((req, res) => {
        const refLogement = req.params.refLogement
        const sqlQuery = `CALL data_Cotisation_Bylogement('${refLogement}') ;`  
        pool.query(sqlQuery, (err, response) => {
            if(!err){
                if(response.length !== 0){
                    console.log(response)
                    res.json(response)
                }
            }
            else{
                console.log("No Paiements")
                res.json({msgErr : "No Paiements"})
            }
        })
    })


//////// Find Log By NumCoproprietaire ///
router.route('/copro/NumCompte/:id')
    .get((req, res) => {
        const id = req.params.id
        if(id !== undefined && id !== null && id !== ""){
            const sqlQuery = `SELECT l.RefLogement FROM logement l, compte c WHERE l.NumCompteCop = c.NumCompte AND c.NumCompte = '${id}' ORDER BY l.RefLogement LIMIT 1`
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    return res.send(err)
                }
                if(data.length > 0) res.send(data[0].RefLogement)
                else{
                    res.send("Id Invalid")
                }
            })
        }
    })


/////// Create PDF File
/*router.route('/create-pdf')
    .post((req, res) => {
        const { compte } = req.body
        if(compte !== "" && compte !== undefined){
            const sqlQuery = `call data_mes_cotisations('${compte.NumCompte}')`
            pool.query(sqlQuery, (err, result) => {
                if(err){
                    return res.send(err)
                }
                if(result){
                    let nom = compte.NomCompte
                    let prenom = compte.PrenomCompte
                    let tele = compte.telephone
                    let email = compte.EmailCompte
                    let log = compte.RefLogement
                    let coti = result[0]
                    pdf.create(pdfTemplate(nom, prenom, tele, email, log, coti ), {}).toFile(`${__dirname}/documents situation coproprietaire/result1.pdf`, (err) => {    
                        if(err){
                            res.send(Promise.reject())
                            console.log(err)
                        }
                        res.send(Promise.resolve())
                    })
                }
            })
        }
    })

/////// Return the PDF 
router.route('/fetch-pdf')
    .get((req, res) => {
        try{
            res.sendFile(`${__dirname}/documents situation coproprietaire/result1.pdf`)
        }
        catch(err){
            console.log("No Way .... ", err)
        }
    })*/

module.exports = router