const express = require("express")
let router = express.Router()
require("dotenv").config()
const bodyparser = require("body-parser");
const cors = require("cors")


router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(cors({origin : 'http://localhost:3000', credentials : true}))




///// ENREGISTRER UNE ANNONCE
router.route("/new/:id")
    .post((req, res) => {
        const { sujet, descripAnnonce} = req.body
        const id = req.params.id
        if(id !== "" && sujet !== "" && descripAnnonce !== ""){
            const sqlQuery = `insert into annonce (NumCompte, Sujet, DescripAnnonce) values (${id} , ?, ?)`
            pool.query(sqlQuery, [sujet, descripAnnonce], (err, resolve) => {
                if(err){ 
                    return res.send("Failed") 
                }
                if(resolve){
                    if(resolve.affectedRows != 0){
                        res.send("Inserted")
                    }
                    else{
                        res.send("bad")
                    }
                }
            })
        }
    })


//// Read all Announcements
router.route('/all')
    .get((req, res) => {
        const token = req.headers['authorization']
        if(token.length > 150){
            const sqlQuery = "select c.NomCompte, c.PrenomCompte, a.RefAnnonce, a.dateAnnonce, a.Sujet, a.statut, a.DescripAnnonce, d.contenuDocument from compte c, document d right JOIN annonce a on d.RefAnnonce = a.RefAnnonce where a.NumCompte = c.NumCompte order by a.RefAnnonce desc"   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length !== 0){
                        res.json(data)
                    }
                    else{
                        res.json({msgErr : "No Announcement"})
                    }
                }
                else{
                    console.log("No Announcement for U")
                    res.json({msgErr : "No Announcement"}) 
                }
            })
        }
        else{
            console.log("No token !!")
            res.json({msgErr : "No Token Set"})
        }
    })



//// Searching Annonces By ... 
router.route("/:search")
    .get((req, res) => {
        const search = req.params.search
        const token = req.headers['authorization']
        if(token.length > 150){
            if(search !== ""){
                const sqlQuery = `select c.NomCompte, c.PrenomCompte, a.RefAnnonce, a.dateAnnonce, a.Sujet, a.statut, a.DescripAnnonce, d.contenuDocument from compte c, document d right JOIN annonce a on d.RefAnnonce = a.RefAnnonce where a.NumCompte = c.NumCompte and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or a.Sujet like '%${search}%' or a.DescripAnnonce like '%${search}%' ) order by a.RefAnnonce desc ;`
                pool.query(sqlQuery, (err, data) => {
                    if(err){
                        res.json("Failed to load Data")
                    }
                    if(data){
                        if(data.length !== 0){
                            res.json(data)
                        }
                        else{
                            res.json({msggg : "No Annonce"})
                        }
                    }
                })
            }
        }
        else{
            res.json({msgErr : "No Token Set"})
        }
    })

////// lister les annonces qui ont statut 1 
router.route('/all/statut/true')
    .get((req, res) => {
        const token = req.headers['authorization']
        if(token.length > 150){
            const sqlQuery = "select c.NomCompte, c.PrenomCompte, a.RefAnnonce, a.dateAnnonce, a.Sujet, a.statut, a.DescripAnnonce, d.contenuDocument from compte c, document d RIGHT JOIN annonce a ON a.RefAnnonce = d.RefAnnonce where a.NumCompte = c.NumCompte  and a.statut = 1 order by a.RefAnnonce desc"   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length > 0){
                        res.send(data)
                    }
                    else{
                        res.send("No Annonce")
                    }
                }
                else{
                    res.send("No Annonce")
                }
            })
        }
        else{
            console.log("No token !!")
            res.json({msgErr : "No Token Set"})
        }
    })

/////// Chercher les Annonces qui ont statut 1 et BY ......
router.route('/all/statut/true/:search')
    .get((req, res) => {
        const token = req.headers['authorization']
        if(token.length > 150){
            const search = req.params.search
            if(search !== "" && search !== undefined){
                const sqlQuery = `select c.NomCompte, c.PrenomCompte, a.RefAnnonce, a.dateAnnonce, a.Sujet, a.DescripAnnonce, d.contenuDocument from compte c, document d right join annonce a on a.RefAnnonce = d.RefAnnonce where a.NumCompte = c.NumCompte  and a.statut = 1 and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or a.Sujet like '%${search}%' or a.DescripAnnonce like '%${search}%' ) order by a.RefAnnonce desc ;`   
                pool.query(sqlQuery, (err, data) => {
                    if(!err){
                        if(data.length > 0){
                            res.json(data)
                        }
                        else{
                            res.send("No Annonce")
                        }
                    }
                    else{
                        res.send("No Annonce")
                    }
                })
            }
        }
        else{
            console.log("No token !!")
            res.json({msgErr : "No Token Set"})
        }
    })




/////// ANNONCE BY RefAnnonce
router.route("/annonce/:refAnnonce")
    .get((req, res) => {
        const refAnnonce = req.params.refAnnonce
        const sqlQuery = `select * from annonce where RefAnnonce = ${refAnnonce};`
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



/////// UPDATE ANNONCE 
router.route("/edit/:refAnnonce")
    .put((req, res) => {
        const refAnnonce = req.params.refAnnonce
        const {sujet, descrip, statut } = req.body 
        if(sujet !== "" && descrip !== ""){
            const sqlQuery = `update annonce set Sujet = ?, DescripAnnonce = ?, statut = ?  where RefAnnonce = ${refAnnonce};`
            pool.query(sqlQuery, [sujet, descrip, parseInt(statut)], (err, resolve) => {
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
    })


////// Delete Annonce 
router.route("/delete/:refAnnonce")
    .delete((req, res) => {
        const refAnnonce = req.params.refAnnonce
        const sqlQuery = `delete from annonce where RefAnnonce = ${refAnnonce} ;`
        pool.query(sqlQuery, async (err, resolve) => {
            if(err){
                if(err.sqlMessage === `Unknown column '${refAnnonce}' in 'where clause'`){
                    return res.send("Err")
                }
            }
            if(resolve){
                if(resolve.message){
                    return res.json("Deleted ALL")
                }
            }
            else{
                return res.json("No Resolving")
            }
        })
    })

module.exports = router