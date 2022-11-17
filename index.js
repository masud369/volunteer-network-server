
const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
// const objectID = require("mongodb").objectID
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kz5wbn2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(process.env.DB_NAME)
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
const port = 5055


app.use(bodyParser.json())
app.use(cors())


client.connect(err => {
  const eventsCollection = client.db("volunteer").collection("events");
  // perform actions on the collection object
  console.log("database connected successfully!!");
  app.post('/addevent',(req,res)=>{
    const reqBody = req.body;
    console.log(reqBody);
    eventsCollection.insertOne(reqBody)
    .then(result=>{
      console.log(result)
      res.send(result.acknowledged)
    })
  })

  app.get("/allEvents",(req,res)=>{
    const data = req.body;
    eventsCollection.find()
    .toArray((err,items)=>{
      res.send(items);
    })
  })

  app.delete('/event/:id', (req, res) => {
    const id = ObjectId(req.params.id)
    console.log(id)
    eventsCollection.findOneAndDelete({_id: id})
    .then(document=>res.send(document))
  })



});
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})