module.exports = (month, year, NbrCoti, MntCoti, depenses, NbrDep, MntDep) => {
    const todate = new Date()
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset='utf-8'>
            <title>Relevé Financièr</title>
        </head>
        <body style='padding-top : 3%'>
            <div class="row">
                <div class='col-md-3'></div>
                <div class='col-md-6' style='margin-left: 170px;'><img src='' width='400px' height='260px' alt='' /></div>
            </div>
            <div class='container col-md-10 col-md-offset-1'>
                <h3 style='font-size : 35px; text-align: center;'><strong>Situation Financièr Du ${month} - ${year} </strong></h3><br/><br/><br/>
                <div class='container' style='margin-left : 200px; margin-right : 200px;'>
                <div class='row'>
                    <div class='col-md-6'>
                        <th>Nombre Des Cotisations </th>
                        <td><strong style='font-size : 20px'> ${NbrCoti} </strong></td>
                    </div>
                    <div class='col-md-6'>
                        <th>Monatnt Total des Retenus</th>
                        <td><strong style='font-size : 20px'> ${MntCoti} MAD</strong></td>
                    </div>
                </div>
                <table class='table table-striped' style='margin-left : 10px; margin-right : 200px;'>
                    <tr class='thead-light'>
                        <th><strong>Nature de Dépenses</strong></th>
                        <th><strong>Montant (MAD)</strong></th>
                    </tr>
                    ${depenses.map((d, i) => {
                        return(
                            `<tr key=${i}>
                                <td> ${d.descriptionDepense} </td>
                                <td class='dCenter'><strong> ${d.MontantDepense} </strong></td>
                            </tr>`
                        )
                    })}
                </table>
                <div>
                    <div class='col-md-6'>Nombre Total des Dépenses : <strong style='font-size : 20px'>${NbrDep}</strong></div>
                    <div class='col-md-6'>Le Solde Actuel : <strong style='font-size : 20px'>${MntCoti - MntDep} MAD</strong></div>
                </div>
                <div class="row">
                    <div>
                        <img src='' alt='' width='400px' height='200px' />
                    </div>
                </div>
            </div><br/><br/><br/>
        </body>
        <footer>
            <div>
                <h5 class='text-muted'>${todate}</h5>
            </div>
        </footer>
    </html> `
}