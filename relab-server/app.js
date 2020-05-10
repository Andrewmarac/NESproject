const express = require('express');
const app = new express();
const sql = require('mssql');

const CC = require('./CoordConverter.js');
const coordConverter = new CC();

const sqlUtils = require('./SqlUtils.js');

const config = {
 user: 'PCTO',
 password: 'xxx123#',
 server: "213.140.22.237", 
 database: 'Katmai', 
}
app.get('/ci_vettore/:foglio', function (req, res) {
    console.log(req.params.foglio);
 //richiamo il metodo che ottiene l'elenco dei vettori energetici
 sqlUtils.connect(req,res, sqlUtils.ciVettRequest);
 });


function makeSqlRequest(res) {
 let sqlRequest = new sql.Request(); 
 let q = 'SELECT DISTINCT TOP (100) [GEOM].STAsText() FROM [Katmai].[dbo].[interventiMilano]';

 sqlRequest.query(q, (err, result) => {sendQueryResults(err,result,res)});
}
function sendQueryResults(err,result, res)
{
 if (err) console.log(err);
 res.send(coordConverter.generateGeoJson(result.recordset)); 
}

app.listen(3000, function () {
 console.log('Example app listening on port 3000!');
});
