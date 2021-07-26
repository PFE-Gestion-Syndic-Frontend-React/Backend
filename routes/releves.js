const express = require("express")
let router = express.Router()
require("dotenv").config()
const bodyparser = require("body-parser");
const cors = require("cors");
const pdf = require('html-pdf')
const pdfTemplate = require("./documents releve financier/index.js");

router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(cors({origin : 'http://localhost:3000', credentials : true}))


router.route("/all")
    .get(async (req, res) => {
        const sqlQuery = "select distinct month(d.dateDepense) as month, year(d.dateDepense) as year from depense d order by month(d.dateDepense) desc, year(d.dateDepense) desc;"
        pool.query(sqlQuery, async (err, data) => {
            if(err){
                console.log(err)
                return res.send(err)
            }
            if(data){
                let arr = []
                for(let i = 0; i < data.length; i++){
                    const sqlQuery = `call releves(${data[i].month}, ${data[i].year})`
                    await pool.query(sqlQuery, async (er, result) => {
                        if(er) return res.send(er)
                        if(result){
                            arr.push(result)
                        }
                    })
                    setTimeout(() => {
                        if(i === data.length - 1){
                            return res.send(arr)
                        }
                    }, 1000);
                }
            }
        })
    })

router.route('/create-pdf')
    .post((req, res) => {
        const {mois, year} = req.body
        if(mois !== "" && mois !== undefined && year !== "" && year !== undefined){
            const sqlQuery = `call releves(${mois}, ${year})`
            pool.query(sqlQuery, (er, result) => {
                if(er) return res.send(er)
                if(result){
                    let month = result[3][0].month
                    let year = result[3][0].year 
                    let NbrCoti = result[0][0].NbrCotisation
                    let MntCoti = result[0][0].MontantCotisation
                    let depenses = result[1]
                    let NbrDep = result[2][0].NbrDepense
                    let MntDep = result[2][0].MontantDepense
                    pdf.create(pdfTemplate(month, year, NbrCoti, MntCoti, depenses, NbrDep, MntDep), {}).toFile(`${__dirname}/documents releve financier/result.pdf`, (err) => {
                        if(err){
                            res.send(Promise.reject())
                        }
                        res.send(Promise.resolve())
                    })
                }
            })
        }
    })

router.route('/fetch-pdf')
    .get((req, res) =>{
        try{
            res.sendFile(`${__dirname}/documents releve financier/result.pdf`)
        }
        catch(err){
            console.log("No Way .... ", err)
        }
    })

module.exports = router