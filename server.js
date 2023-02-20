var express = require('express'),
    routes = require('./app/routes/index.js'),
    secret = require('./secrets/secrets.js'),
    bodyParser = require('body-parser'),
    app = express(),
    cookieParser = require('cookie-parser'),
    mongo = require('mongodb').MongoClient,
    url = 
`mongodb+srv://${secret.dbUsername}:${secret.dbPassword}kanskedetkanvaraheltokejattskrivaettnyttord16@cluster0.jlltv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    port = process.env.PORT || 8080;

mongo.connect(url, (err, db) => {
    if (err) {throw err}
    
    var dbo = db.db("myDb")
    console.log("mongo connected")

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use(bodyParser.text());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

routes(app, secret, dbo); //gets routes from the index.js under /app/routes

app.listen(port, function () {
        console.log('Listening on port ' + port);
    });

});
