module.exports = (month, year, NbrCoti, MntCoti, depenses, NbrDep, MntDep) => {
    const todate = new Date()
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Relevé Financièr</title>
            <style>
                #customers {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
                }

                #customers td, #customers th {
                border: 1px solid #ddd;
                padding: 8px;
                }

                #customers tr:nth-child(even){background-color: #f2f2f2;}

                #customers tr:hover {background-color: #ddd;}

                #customers th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                background-color: silver;
                color: white;
                }
            </style>
        </head>
        <body style="padding-top : 3%">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6" style="margin-left: 170px;"></div>
            </div>
            <div class="container col-md-10 col-md-offset-1">
                <h3 style="font-size : 35px; text-align: center;"><strong>Situation Financièr Du ${month} - ${year} </strong></h3><br/><br/><br/>
                <div class="container" style="margin-left : 200px; margin-right : 200px;">
                <div class="row">
                    <div class="col-md-6">
                        <th>Nombre Des Cotisations </th>
                        <td><strong style="font-size : 20px"> ${NbrCoti} </strong></td>
                    </div>
                    <div class="col-md-6">
                        <th>Monatnt Total des Retenus</th>
                        <td><strong style="font-size : 20px"> ${MntCoti} MAD</strong></td>
                    </div>
                </div>
                <table class="table table-striped" id="customers" style="margin-left : 10px; margin-right : 200px;">
                    <tr class="thead-light">
                        <th><strong style="color : black">Nature de Dépenses</strong></th>
                        <th><strong style="color : black">Montant (MAD)</strong></th>
                    </tr>
                    ${depenses.map((d) => {
                        return(
                            `<tr>
                                <td> ${d.descriptionDepense} </td>
                                <td class="dCenter"><strong> ${d.MontantDepense} </strong></td>
                            </tr>`
                        )
                    })}
                    <tr>
                        <td style="font-size : 20px">Nombre Total des Dépenses : <strong>${NbrDep}</strong></div>
                        <td style="color : blue; font-size : 20px">Le Solde Actuel : <strong>${MntCoti - MntDep} MAD</strong></div>
                    </tr>
                </table>
                <div class="row">
                    <div></div>
                </div>
            </div><br/><br/><br/>
        </body>
        <footer>
            <div>
                <h5 class="text-muted"></h5>
            </div>
        </footer>
    </html> `
}