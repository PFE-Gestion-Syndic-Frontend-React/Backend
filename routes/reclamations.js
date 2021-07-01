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

    })

router.route('/all')
    .get((req, res) => {
        const token = req.headers['authorization']
        //if(token.length > 150){
            const sqlQuery = "select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour from compte c, logement l, reclamation r where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement order by r.RefReclamation desc"   
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

// Searching réclamations By ... 
router.route("/:search")
.get((req, res) => {
    const search = req.params.search
    if(search !== ""){
        const sqlQuery = `select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour from compte c, logement l, reclamation r where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or r.Objet like '%${search}%' or r.Message like '%${search}%' or r.pour like '%${search}%' or r.statut like '%${search}%' ) order by a.RefAnnonce desc ;`
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
                    res.json({msggg : "No Annonce"})
                }
            }
        })
    }
})


module.exports = router