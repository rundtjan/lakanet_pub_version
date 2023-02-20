"use strict";

var axios = require("axios");
var mongodb = require('mongodb');

module.exports = function (app, secret, dbo) {

  var send = "reii234kdksolkdie2345"

  app.route("/").get(function (req, res) {
    if (req.cookies.values) {
      if (req.cookies.values.token == secret.simonSays) {
        res.sendFile(process.cwd() + "/public/index.html");
      }
    } else {
      res.sendFile(process.cwd() + "/public/login.html");
    }
  });

  app.route("/ifjol").get(function (req, res) {
    if (req.cookies.values) {
      if (req.cookies.values.token == secret.simonSays) {
        res.sendFile(process.cwd() + "/public/indexLastYear.html");
      }
    } else {
      res.sendFile(process.cwd() + "/public/login.html");
    }
  });
  app
    .route("/dataretrieve")
    .post(function (req, res) {
        var data = JSON.parse(req.body)
        if (data.send == send){
        dbo.collection('bookings').find({}).toArray(function(err,items){ 
          if (err) throw err;        
          res.send(items)
        });
      }
      else res.send("[]")
    })

  app
    .route("/data")
    .get(function (req, res) {
      console.log(req.cookie)
        dbo.collection('bookings').find({}).toArray(function(err,items){ 
          if (err) throw err;        
          res.send(items)
        });
    })
    .post(function (req, res) {
      console.log("received" + req.body)
      var data = JSON.parse(req.body)
      console.log(data.send)
      if (data.send == send)
      {
        console.log("booking")
        var myObj = data.booking;
        dbo.collection("bookings").insertOne(myObj, (err, res) => {
        if (err) throw err
        else console.log("inserted ", myObj);
        })
      }
      res.send('thank you for ' + JSON.stringify(data ))
    })
    .put(function (req, res) {
      var data = JSON.parse(req.body);
      if (data.send == send){
        console.log("update")
       // borde innehålla {id: id, update: {allt: annat, kommer: såhär}}
      dbo.collection('bookings').updateOne({_id: new mongodb.ObjectID(data.id)}, { $set: data.update }, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");
      })}
      res.send("ok")
    })
    .delete(function (req, res) {
      var data = JSON.parse(req.body);//json måste vara bara id
      if (data.send == send){
        console.log("deleting")
        dbo.collection('bookings').deleteOne({_id: new mongodb.ObjectID(data._id)}, function (err, result) {
          if (err) throw err;
          console.log("1 record deleted");
        })
      }
      res.send("deleted")   
    });

  app.route("/login").post(function (req, res) {
    var login = JSON.parse(req.body);
    if (
      secret.users.hasOwnProperty(login.username) &&
      secret.users[login.username] == login.password
    ) {
      res
        .cookie("values", { user: login.username, token: secret.simonSays })
        .send("match!");
    } else {
      res.send("fail");
    }
  });

  app.route("/fastForward").post(function (req, res) {
    var login = JSON.parse(req.body);
    if (login.token == secret.simonSays) {
      res
        .cookie("values", { user: login.user, token: login.token })
        .send("fastForward!");
    } else {
      res.send("fail");
    }
  });


};
