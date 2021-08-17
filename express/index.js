const express = require("express");
const cors = require("cors");
const transactor = require("./transactor").transactor;
const DB = require("./db");
require("dotenv").config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

var db = new DB()
db.createTable();
var transact = new transactor();

app.post("/api/newApp", (req, res) => {
  var data = req.body;
  db.insertApp(data.appid);
  res.send({result:200})
});
app.post("/api/delApp", (req, res) => {
  var data = req.body;
  db.delApp(data.appid);
  res.send({result:200})
});
app.post("/api/updateAppContent", (req, res) => {
  var data = req.body;
  console.log(req.body)
  db.updateAppContent(data.id,data.title,data.content,data.show);
  res.send({result:200})
});
app.post("/api/getAppContent", (req, res) => {
  var data = req.body;
  db.getAppContent(data.appid,(v,re)=>{
    res.send({result:re[0]});
  });
});

app.post("/api/getAllAppContent", (req, res) => {
  var data = req.body;
  db.getAllAppContent(data.appid,(v,re)=>{
    res.send({result:re});
  });
});

app.post("/api/createApp", (req, res) => {
  var data = req.body;
  transact
    .get_Txn(data.addre, data.end, data.amount)
    .then((d) => {
      res.send(d);
    })
    .catch((d) => {
      res.send(d);
    });
});
app.post("/api/update", (req, res) => {
  var data = req.body;
  transact
    .UpdateApp( data.appid)
    .then((d) => {
      res.send(d);
    })
    .catch((d) => {
      res.send(d);
    });
});

app.post("/api/giveaway", (req, res) => {
  var data = req.body;
  transact.GiveAwayAssets(data.addre).then(console.log);
  res.send({ result: "Ok" });
});

app.post("/api/getaccess", (req, res) => {
  var data = req.body;
  transact
    .Optin(data.addre)
    .then((d) => {
      res.send(d);
    })
    .catch(console.log);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
