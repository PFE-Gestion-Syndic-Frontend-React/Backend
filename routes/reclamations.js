const express = require("express")
let router = express.Router()
require("dotenv").config()
const bodyparser = require("body-parser");
const cors = require("cors")


router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(cors({origin : `http://localhost:3000`, credentials : true}))


router.route('/new')
    .post((req, res) => {
        const {log, objet, message, pour} = req.body
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
                }
            })
        }
    })

//// Lister All Réclamations :
router.route('/all')
    .get((req, res) => {
        const sqlQuery = "select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement order by r.RefReclamation desc"   
        pool.query(sqlQuery, (err, data) => {
            if(!err){
                if(data.length > 0){
                    res.json(data)
                }
            }
            else{
                res.json({msgErr : "No Réclamations"})
            }
        })
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
                }
                if(data){
                    if(data.length > 0){
                        res.send(data)
                    }
                    else{
                        res.send("No Réclamation")
                    }
                }
            })
        }
    })


////////////// Réclamations serach POUR LES COPROPRIETAIRES //////// 
router.route('/cops/all/:id/:search')
    .get((req, res) => {
        const {id, search} = req.params
        if(id !== undefined && search !== undefined && id !== "" && search !== ""){
            const sqlQuery = `select r.RefReclamation, c.NumCompte, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement AND ( c.NumCompte = ${id} OR r.pour = 'Public' ) AND (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or r.Objet like '%${search}%' or r.Message like '%${search}%' or r.statut like '%${search}%' or r.pour like '%${search}%') order by r.RefReclamation desc ;`
            pool.query(sqlQuery, id, (err, data) => {
                if(err){
                    res.send(err)
                }
                if(data){
                    if(data.length > 0){
                        res.send(data)
                    }
                    else{
                        res.send("No Réclamation")
                    }
                }
            })
        }
    })

/////// Mes Réclamations 
router.route("/mesReclamations/all/:id")  
    .get((req, res) => {
        const id = req.params.id 
        if(id !== undefined){
            const sqlQuery = "call mes_Reclamations(?)"
            pool.query(sqlQuery, id, (err, data) => {
                if(err){
                    res.send(err)
                }
                if(data){
                    if(data.length > 0){
                        res.send(data[0])
                    }
                    else{
                        res.send("No Réclamation")
                    }
                }
            })
        }
    })

/////// Search in ::: Mes Réclamations 
router.route("/mesReclamations/all/:id/:searchBy")  
    .get((req, res) => {
        const id = req.params.id 
        const searchBy = req.params.searchBy
        if(id !== undefined && searchBy !== undefined && id !== "" && searchBy !== ""){
            const sqlQuery = `select r.RefReclamation, c.NumCompte, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement AND c.NumCompte = ${id} AND (c.NomCompte like '%${searchBy}%' or c.PrenomCompte like '%${searchBy}%' or r.Objet like '%${searchBy}%' or r.Message like '%${searchBy}%' or r.statut like '%${searchBy}%' or r.pour like '%${searchBy}%') order by r.RefReclamation desc`
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    res.send(err)
                }
                if(data){
                    if(data.length > 0){
                        res.send(data)
                    }
                    else{
                        res.send("No Réclamation")
                    }
                }
            })
        }
    })

//// Réclamation by RefReclamation
router.route("/reclamation/:refReclamation")
    .get((req, res) => {
        const refReclamation = req.params.refReclamation
        const sqlQuery = `select r.RefReclamation, c.NomCompte, c.PrenomCompte, c.photo, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour from compte c, logement l, reclamation r where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement and r.RefReclamation = ? ;`
        pool.query(sqlQuery, refReclamation, (err, data) => {
            if(err){
                res.json({msgErr : "Err"})
            }
            if(data){
                if(data.length > 0){
                    res.json(data)
                }
                else{
                    res.json({msgErr : "Not Found"})
                }
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

////// Modifier ma Réclamations 
router.route("/maReclamation/edit/:refReclamation")
    .put((req, res) => {
        const refReclamation = req.params.refReclamation
        if(refReclamation !== undefined && refReclamation !== ""){
            const {objet, message, pour} = req.body
            if(objet !== "" && message !== "" && pour !== ""){
                const sqlQuery = "update reclamation set Objet = ?, Message = ?, pour = ? where RefReclamation = ? ;"
                pool.query(sqlQuery, [objet, message, pour, refReclamation], (err, data) => {
                    if(err){
                        res.send(err)
                    }
                    if(data){
                        res.send(data)
                    }
                })
            }
        }
        else{
            console.log("UNRECEIVED")
        }
    })

/////// RECLAMATION BY REFLOGEMENT 
router.route('/logement/:refLogement')
    .get((req, res) => {
        const refLogement = req.params.refLogement
        if(refLogement !== "" && refLogement !== undefined){
            const sqlQuery = `select r.RefReclamation, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where l.RefLogement = r.RefLogement and l.RefLogement = '${refLogement}' order by r.RefReclamation desc ;`   
            pool.query(sqlQuery, (err, data) => {
                if(err){
                    res.send(err)
                }
                else{
                    if(data.length > 0){
                        res.send(data)
                    }
                    else{
                        res.send("No Réclamation")
                    }
                }
            })
        }
    })

/////// Delete Réclamation ///// 
router.route("/delete/:refReclamation")
    .delete((req, res) => {
        const refReclamation = req.params.refReclamation
        const sqlQuery = "delete from reclamation where RefReclamation = ?"
        pool.query(sqlQuery, refReclamation, (err, data) => {
            if(err){
                res.send(err)
                console.log(err)
            }
            if(data){
                if(data.affectedRows === 0){
                    res.send("No Réclamation")
                }
                else{
                    res.send("Deleted")
                }
            }
        })
    })

/////// Réclamations Admin Periode :
router.route("/admin/periode")
    .post((req, res) => {
        const perd = req.body.perd
        if(perd !== undefined){
            if(perd === 1){
                const sqlQuery = "select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement and month(r.dateReclamation) = month(CURRENT_TIMESTAMP) AND year(r.dateReclamation) = year(CURRENT_TIMESTAMP) order by r.RefReclamation desc ;"   
                pool.query(sqlQuery, (err, data) => {
                    if(!err){
                        if(data.length > 0){
                            res.json(data)
                        }
                        else{
                            res.send("No Réclamations")
                        }
                    }
                    else{
                        res.json({msgErr : "No Réclamations"})
                    }
                })
            }
            else if(perd === 3){
                const sqlQuery = "select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement and datediff(CURRENT_TIMESTAMP, r.dateReclamation) between 0 and 92 order by r.RefReclamation desc ;"   
                pool.query(sqlQuery, (err, data) => {
                    if(!err){
                        if(data.length > 0){
                            res.json(data)
                        }
                        else{
                            res.send("No Réclamations")
                        }
                    }
                    else{
                        res.json({msgErr : "No Réclamations"})
                    }
                })
            }
            else if(perd === 6){
                const sqlQuery = "select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement and datediff(CURRENT_TIMESTAMP, r.dateReclamation) between 0 and 183 order by r.RefReclamation desc ;"   
                pool.query(sqlQuery, (err, data) => {
                    if(!err){
                        if(data.length > 0){
                            res.json(data)
                        }
                        else{
                            res.send("No Réclamations")
                        }
                    }
                    else{
                        res.json({msgErr : "No Réclamations"})
                    }
                })
            }
        }
    })

/////// Réclamations Copropriétaire PERIODE
router.route("/copro/all/periode/:id")
    .post((req, res) => {
        const id = req.params.id
        const perd = req.body.perd 
        if(perd !== undefined){
            if(perd === 1){
                const sqlQuery = `select r.RefReclamation, c.NumCompte, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement AND ( c.NumCompte = ${id} OR r.pour = 'Public' ) AND month(r.dateReclamation) = month(CURRENT_TIMESTAMP) AND year(r.dateReclamation) = year(CURRENT_TIMESTAMP) order by r.RefReclamation desc ;`
                pool.query(sqlQuery, id, (err, data) => {
                    if(err){
                        res.send(err)
                    }
                    if(data){
                        if(data.length > 0){
                            res.send(data)
                        }
                        else{
                            res.send("No Réclamation")
                        }
                    }
                }) 
            }
            else if(perd === 3){
                const sqlQuery = `select r.RefReclamation, c.NumCompte, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement AND ( c.NumCompte = ${id} OR r.pour = 'Public' ) AND datediff(CURRENT_TIMESTAMP, r.dateReclamation) between 0 and 92 order by r.RefReclamation desc ;`
                pool.query(sqlQuery, id, (err, data) => {
                    if(err){
                        res.send(err)
                    }
                    if(data){
                        if(data.length > 0){
                            res.send(data)
                        }
                        else{
                            res.send("No Réclamation")
                        }
                    }
                }) 
            }
            else if(perd === 6){
                const sqlQuery = `select r.RefReclamation, c.NumCompte, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on s.RefReclamation = r.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement AND ( c.NumCompte = ${id} OR r.pour = 'Public' ) AND datediff(CURRENT_TIMESTAMP, r.dateReclamation) between 0 and 183 order by r.RefReclamation desc ;`
                pool.query(sqlQuery, id, (err, data) => {
                    if(err){
                        res.send(err)
                    }
                    if(data){
                        if(data.length > 0){
                            res.send(data)
                        }
                        else{
                            res.send("No Réclamation")
                        }
                    }
                }) 
            }
        }
    })






// Searching réclamations By ... 
router.route("/:search")
    .get((req, res) => {
        const search = req.params.search
        if(search !== ""){
            const sqlQuery = `select r.RefReclamation, c.NomCompte, c.PrenomCompte, r.Objet, r.Message, r.dateReclamation, r.statut, r.pour, s.contenu from compte c, logement l, support s right join reclamation r on r.RefReclamation = s.RefReclamation where c.NumCompte = l.NumCompteCop and l.RefLogement = r.RefLogement and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or r.Objet like '%${search}%' or r.Message like '%${search}%' or r.pour like '%${search}%' or r.statut like '%${search}%' ) order by r.RefReclamation desc ;`
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