const express = require("express")
let router = express.Router()
require("dotenv").config()
const bodyparser = require("body-parser");
const cors = require("cors");


router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(cors({origin : `http://localhost:3000`, credentials : true}))

router.route("/data")
    .get((req, res) =>  {
        pool.query("call statistiques()", (err, data) => {
            res.send(data)
        })
    })

router.route("/du")
    .get((req, res) => {
        const {moisDep, anneeDep} = req.body
        if(moisDep !== "" && moisDep !== undefined && anneeDep !== "" && anneeDep !== undefined){
            console.log(moisDep, " ", typeof(moisDep))
            pool.query("call stats_du(?, ?)", [moisDep, anneeDep], (err, data) => {
                if(err) return res.send(err)
                if(data){
                    res.send(data)
                }
            })
        }
    })

module.exports = router