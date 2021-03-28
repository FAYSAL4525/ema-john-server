const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const port = 5000

app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qthye.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    console.log(products);
    productsCollection.insertMany(products)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount)
      })
  })
 app.get('/products',(req,res)=>{
   productsCollection.find({})
   .toArray((err,documents)=>{
     res.send(documents)
   })
 })
 app.get('/product/:key',(req,res)=>{
  productsCollection.find({key:req.params.key})
  .toArray((err,documents)=>{
    res.send(documents[0])
  })
})
app.post('/productsBuyKey',(req, res)=>{
  const productKey = req.body;
  productsCollection.find({key:{$in:productKey}})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

app.post('/addOrder', (req, res) => {
  const orders = req.body;
  console.log(orders);
 ordersCollection.insertOne(orders)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount>0)
    })
})



  console.log('database connected');
  //   client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)