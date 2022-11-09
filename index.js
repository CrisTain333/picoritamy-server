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

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  console.log(token)
  

  jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err){
        return res.status(403).send({message: 'Forbidden access'});
    }
    console.log(decoded)
    req.decoded = decoded;
    next();
  })

};

const run = () => {
  const servicesCollection = client.db("picoritamy").collection("services");
  const reviewsCollection = client.db("picoritamy").collection("reviews");

  try {
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "5h" });
      res.json(token);
    });
    app.get("/home/services", async (req, res) => {
      const query = {};
      const result = servicesCollection.find(query).limit(3);
      const service = await result.toArray();
      res.send(service);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const result = servicesCollection.find(query);
      const service = await result.toArray();
      res.send(service);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    app.post("/review", async (req, res) => {
      const body = req.body;
      const review = {
        date: new Date(),
        serviceName: body.serviceName,
        serviceId: body.serviceId,
        time: body.time,
        message: body.message,
        name: body.name,
        email: body.email,
        photo: body.photo,
      };
      console.log(review);
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    app.get("/review/:id", async (req, res) => {
      
      const id = req.params.id;
      const query = { serviceId: id };
      const result = reviewsCollection.find(query).sort({ date: -1 })
      const reviews = await (await result.toArray());
      res.send(reviews);
    });

    app.get("/review",verifyJwt, async (req, res) => {
      const decoded = req.decoded
        if(decoded.email !== req.query.email){
            return res.status(403).send({message: 'Forbidden access'});
        }
      const email = req.query.email;
      const filter = { email: email };
      const result = reviewsCollection.find(filter).sort({ date: -1 });
      const review = await result.toArray();
      console.log(review)
      res.send(review);
    });

    app.delete("/review/delete/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/review/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.findOne(query);
      res.send(result);
    });

    app.put("/review/update/:id", async (req, res) => {
      const updatedText = req.body;
      console.log(updatedText);
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          message: updatedText.message,
        },
      };
      const result = await reviewsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.post("/add/service", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });
  } finally {
  }
};

run();

app.listen(port, () => {
  console.log(`Server fire On ${port}`);
});
