const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Picoritamt Server On Fire");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);



const run  = ()=>{

    const servicesCollection = client.db('picoritamy').collection('services');


  try {
    app.get('/home/services',async(req,res)=>{
      const query = {};
      const result = servicesCollection.find(query).limit(3);
      const service = await result.toArray();
      res.send(service)

    })
    app.get('/services',async(req,res)=>{
      const query = {};
      const result = servicesCollection.find(query);
      const service = await result.toArray();
      res.send(service)

    })
    app.get('/services/:id',async(req,res)=>{
      const id =  req.params.id
      console.log(id);
      const query = {_id:ObjectId(id)}
      const result = await servicesCollection.findOne(query);
      res.send(result)

    })
    


  } finally{
    
  }
}

run()

app.listen(port, () => {
  console.log(`Server fire On ${port}`);
});
