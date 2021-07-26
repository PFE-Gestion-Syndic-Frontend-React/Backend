module.exports = (nom, prenom, tele, email, log, coti) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Relevé Financièr</title>
            </head>
            <body style="padding-top : 3%">
                <div class="row"><div class="col-md-3"></div></div>
                <div class="container col-md-10 col-md-offset-1">
                    <h3 style="font-size : 35px; text-align: center;"><strong>Situation Du Copropriétaire : ${nom} ${prenom} </strong></h3><br/>
                    <div class="row col-md-12">
                        <h4> Libellé du Logemenet : ${log} </h4>
                        <h4> N° Téléphone : ${tele} </h4>
                        <h4> Adresse E-mail : ${email} </h4>
                    </div>
                </div>
                <div>
                    ${coti.map((c, i) => {
                            return(
                                `<div key=${i}>
                                    <h5> La Référence du Paiement : ${c.RefPaiement} </h5>
                                    <h5> Date du Paiement effectue le ${c.datePaiement} </h5>
                                    <h5> Montant Payé : ${c.Montant} pour la période du ${c.NbrMois} Mois </h5>
                                    <h5> Methode de Paiement : ${c.MethodePaiement} </h5>
                                    <h5> N° Chèque : ${c.NumeroCheque} --- Libellé du Banque : ${c.Banque} </h5>
                                    <h5> Paiement effectuée pour la Période du ${c.Du} - au ${c.Au} </h5>
                                </div>`    
                            )
                        })
                    }
                </div>
            </body>
        </html>
    `
}