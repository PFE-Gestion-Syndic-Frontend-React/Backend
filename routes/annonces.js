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
router.route("/new")
    .post((req, res) => {
        const {id, sujet, descripAnnonce} = req.body
        if(id !== "" && sujet !== "" && descripAnnonce !== ""){
            const sqlQuery = "insert into annonce (NumCompte, Sujet, DescripAnnonce) values (?, ?, ?)"
            pool.query(sqlQuery, [id, sujet, descripAnnonce], (err, resolve) => {
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
        }
    })


//// Read all Announcements
router.route('/all')
    .get((req, res) => {
        const token = req.headers['authorization']
        if(token.length > 150){
            const sqlQuery = "select c.NomCompte, c.PrenomCompte, a.RefAnnonce, a.dateAnnonce, a.Sujet, a.DescripAnnonce from compte c, annonce a where a.NumCompte = c.NumCompte order by a.RefAnnonce desc"   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length !== 0){
                        //console.log(data)
                        res.json(data)
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
            const sqlQuery = `select c.NomCompte, c.PrenomCompte, a.RefAnnonce, a.dateAnnonce, a.Sujet, a.DescripAnnonce from compte c, annonce a where a.NumCompte = c.NumCompte and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or a.Sujet like '%${search}%' or a.DescripAnnonce like '%${search}%' ) order by a.RefAnnonce desc ;`
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
            const sqlQuery = "select c.NomCompte, c.PrenomCompte, a.RefAnnonce, a.dateAnnonce, a.Sujet, a.DescripAnnonce from compte c, annonce a where a.NumCompte = c.NumCompte  and a.statut = 1 order by a.RefAnnonce desc"   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length !== 0){
                        //console.log(data)
                        res.json(data)
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

/////// Chercher les Annonces qui ont statut 1 et BY ......
router.route('/all/statut/true/:search')
    .get((req, res) => {
        const token = req.headers['authorization']
        if(token.length > 150){
            const search = req.params.search
            const sqlQuery = `select c.NomCompte, c.PrenomCompte, a.RefAnnonce, a.dateAnnonce, a.Sujet, a.DescripAnnonce from compte c, annonce a where a.NumCompte = c.NumCompte  and a.statut = 1 and (c.NomCompte like '%${search}%' or c.PrenomCompte like '%${search}%' or a.Sujet like '%${search}%' or a.DescripAnnonce like '%${search}%' ) order by a.RefAnnonce desc ;`   
            pool.query(sqlQuery, (err, data) => {
                if(!err){
                    if(data.length !== 0){
                        //console.log(data)
                        res.json(data)
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
        const sjt = req.body.sujet 
        const descrip = req.body.descrip
        const sqlQuery = `update annonce set Sujet = ?, DescripAnnonce = ? where RefAnnonce = ${refAnnonce};`
        pool.query(sqlQuery, [sjt, descrip], (err, resolve) => {
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


////// Delete Annonce 
router.route("/delete/:refAnnonce")
    .delete((req, res, next) => {
        const refAnnonce = req.params.refAnnonce
        const sqlQuery = `delete from annonce where RefAnnonce = ${refAnnonce} ;`
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