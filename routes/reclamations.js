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


router.route('/new')
    .post((req, res) => {
        const {log, objet, message, pour} = req.body
        //console.log("id : ", typeof(id), "  Objet : ", objet, "  mes : ", message, " Pour : ", pour)
        if(log !== "" && objet !== "" && message !== ""){
            const sqlQuery = "call insert_Rec(?, ?, ?, ?)"
            pool.query(sqlQuery, [log, objet, message, pour], (err, data) => {
                if(err){
                    if(err.sqlMessage === 'CONSTRAINT `pour_val` failed for `db_syndicat`.`reclamation`'){
                        res.send('No Pour')
                    }
                    else{
                        res.send(err)
                    }
                }
                if(data){
                    if(data.affectedRows !== 0){
                        res.send("Inserted")
                    }
                    else{
                        res.send(data)
                    }
                    console.log(data)
                }
            })
        }
    })

//// Lister All Réclamations :
router.route('/all')
    .get((req, res) => {
        const token = req.headers['authorization']
        //if(token.length > 150){
            const sqlQuery = "select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement order by r.RefReclamation desc"   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length > 0){
                        //console.log(data)
                        res.json(data)
                    }
                }
                else{
                    console.log("No Réclamation for U")
                    res.json({msgErr : "No Réclamations"})
                    
                }
            })
        /*}
        else{
            console.log("No token !!")
            res.json({msgErr : "No Token Set"})
        }*/
    })

////////////// Réclamations pour les COPROPRIETAIRES ////////
router.route('/cops/all/:id')
    .get((req, res) => {
        const id = req.params.id
        if(id !== undefined){
            const sqlQuery = "call recla_public(?)"
            pool.query(sqlQuery, id, (err, data) => {
                if(err){
                    res.send(err)
                    console.log(err)
                }
                if(data){
                    if(data.length > 0){
                        res.send(data)
                        //console.log(data)
                    }
                    else{
                        res.send("data : ", data)
                    }
                }
            })
        }
    })


//// Réclamation by RefReclamation
router.route("/reclamation/:refReclamation")
    .get((req, res) => {
        const refReclamation = req.params.refReclamation
        const sqlQuery = `select r.RefReclamation, c.NomCompte, c.PrenomCompte, c.photo, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour from compte c, logement l, reclamation r where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement and r.RefReclamation = ${refReclamation};`
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


/////// UPDATE réclamation 
router.route("/edit/:refReclamation")
    .put((req, res) => {
        const refReclamation = req.params.refReclamation
        const etat = req.body.etat
        const sqlQuery = `update reclamation set statut = ? where RefReclamation = ${refReclamation};`
        if(etat !== undefined && etat !== ""){
            pool.query(sqlQuery, [etat], (err, resolve) => {
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
        else{
            res.json({empty : "Champs Obligatoires !"})
        }
    })

/////// RECLAMATION BY REFLOGEMENT 
router.route('/logement/:refLogement')
    .get((req, res) => {
        const token = req.headers['authorization']
        //if(token.length > 150){
            const refLogement = req.params.refLogement
            const sqlQuery = `select r.RefReclamation, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where l.RefLogement = r.RefLogement and l.RefLogement = '${refLogement}' order by r.RefReclamation desc ;`   
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    console.log("No Réclamation for U")
                    res.json({msgErr : err})
                }
                else{
                    if(data.length > 0){
                        res.json(data)
                    }
                    else{
                        res.json("No Reclamation")
                    }
                    
                }
            })
        /*}
        else{
            console.log("No token !!")
            res.json({msgErr : "No Token Set"})
        }*/
    })


// Searching réclamations By ... 
router.route("/:search")
.get((req, res) => {
    const search = req.params.search
    if(search !== ""){
        const sqlQuery = `select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour from compte c, logement l, reclamation r where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or r.Objet like '%${search}%' or r.Message like '%${search}%' or r.pour like '%${search}%' or r.statut like '%${search}%' ) order by r.RefReclamation desc ;`
        pool.query(sqlQuery, (err, data) => {
            if(err){
                res.send(err)
            }
            if(data){
                if(data.length !== 0){
                    res.send( data )
                }
                else{
                    res.json({msggg : "No Réclamation"})
                }
            }
        })
    }
})


module.exports = router