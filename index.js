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
      const query = {}
      const result = servicesCollection.find(query)
      const service = await result.toArray()
      res.send(service)

    })
    


  } finally{
    
  }
}

run()

app.listen(port, () => {
  console.log(`Server fire On ${port}`);
});
