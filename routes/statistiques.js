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
const {authToken, authRole} = require('./../middleware')
const multer = require('multer')



router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(fileUpload())
router.use(cors({origin : 'http://localhost:3000', credentials : true}))

router.route("/data")
    .get((req, res) =>  {
        pool.query("call statistiques()", (err, data) => {
            res.send(data)
        })
    })


module.exports = router