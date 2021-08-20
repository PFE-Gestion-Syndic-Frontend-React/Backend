module.exports = (situation) => {
    const today = new Date()
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
                <h3 style="font-size : 35px; text-align: center;"><strong>Ma Situation Financière </strong></h3><br/><br/><br/>
                <h2> Situation du Logement : <strong> ${situation[0].RefLogement} </strong></h2>
                <table class="table table-striped" id="customers" style="margin-left : 10px; margin-right : 200px;">
                    <thead>
                        <tr class="thead-light">
                            <th>Réf Cotisation</th>
                            <th>Nombre Mois</th>
                            <th>Montant Payer</th>
                            <th>Méthode Paiement</th>
                            <th>Du</th>
                            <th>Au</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${situation.map((n) => {
                            return(
                                `<tr>
                                    <td><strong> ${n.RefPaiement} </strong></td>
                                    <td class="dCenter"><strong> ${n.NbrMois} </strong></td>
                                    <td class="dCenter"><strong> ${n.Montant} </strong></td>
                                    <td class="dCenter"><strong> ${n.MethodePaiement} </strong></td>
                                    <td class="dCenter"><strong> ${n.Du.replace("T23:00:00.000Z", "")} </strong></td>
                                    <td class="dCenter"><strong> ${n.Au.replace("T23:00:00.000Z", "")} </strong></td>
                                </tr>`
                            )
                        })}
                    </tbody>
                </table>
            </div><br/><br/><br/> 
        </body>
        <footer>
            <div>
                <h4 class="text-muted" style="margin-left : 70%">Le  ${new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(today)} </h4>
            </div>
        </footer>
    </html> `
}