module.exports = (impaye, never) => {
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
                width: 97%;
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
                <h3 style="font-size : 35px; text-align: center;"><strong>Liste des Impayés </strong></h3><br/><br/><br/>
                <table class="table table-striped" id="customers" style="margin-left : 10px; margin-right : 200px;">
                    <thead>
                        <tr class="thead-light">
                            <th><strong style="color : black">Non et Prénom</strong></th>
                            <th><strong style="color : black">Téléphone</strong></th>
                            <th><strong style="color : black">Libellé Logement</strong></th>
                            <th><strong style="color : black">le Montant à Payer (MAD)</strong></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${never.map((n) => {
                            return(
                                `<tr>
                                    <td> ${n.NomCompte} ${n.PrenomCompte} </td>
                                    <td class="dCenter"><strong> ${n.telephone} </strong></td>
                                    <td class="dCenter"><strong> ${n.RefLogement} </strong></td>
                                    <td class="dCenter"><strong> ${n.periode * 200} </strong></td>
                                </tr>`
                            )
                        })}

                        ${impaye.map((d) => {
                            return(
                                `<tr>
                                    <td> ${d.NomCompte} ${d.PrenomCompte} </td>
                                    <td class="dCenter"><strong> ${d.telephone} </strong></td>
                                    <td class="dCenter"><strong> ${d.RefLogement} </strong></td>
                                    <td class="dCenter"><strong> ${d.periode * 200} </strong></td>
                                </tr>`
                            )
                        })}
                    </tbody>
                </table>
            </div><br/><br/><br/>
        </body>
        <footer>
            <div>
                <h5 class="text-muted"></h5>
            </div>
        </footer>
    </html> `
}