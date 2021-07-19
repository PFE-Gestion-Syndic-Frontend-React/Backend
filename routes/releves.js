const express = require("express")
let router = express.Router()
require("dotenv").config()
const bodyparser = require("body-parser");
const cors = require("cors");

router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json())
router.use(express.json())
router.use(cors({origin : 'http://localhost:3000', credentials : true}))


router.route("/all")
    .get(async (req, res) => {
        /*try{ 
            const sqlQuery = "select distinct month(d.dateDepense) as month, year(d.dateDepense) as year from depense d;"
            const data = await pool.query(sqlQuery)
            if(data.length !== 0){
                res.json(data)
                return res.send(data.map( async (elt) =>{
                    const sql2 = `call releves(${elt.month}, ${elt.year})`
                    return await pool.query(sql2)
                }))
            }
            else{
                console.log("No Data")
            }
        }
        catch(e){
            console.log(e)
            return res.send(e)
        }*/
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


module.exports = router