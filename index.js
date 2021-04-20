const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const port = process.env.PORT || 5001;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kljii.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookingCollection = client.db("repairGuru").collection("bookInfo");
  const reviewCollection = client.db("repairGuru").collection("userReview");
  const serviceCollection = client.db("repairGuru").collection("services");
  const adminCollection = client.db("repairGuru").collection("adminUser");

  // perform actions on the collection object
  app.post("/bookInfo", (req, res) => {
    const bookInfo = req.body;
    bookingCollection.insertOne(bookInfo).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });
  app.post("/userReview", (req, res) => {
    const userReview = req.body;
    reviewCollection.insertOne(userReview).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });
  app.get("/reviewDetails", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  app.post("/addServices", (req, res) => {
    const serviceInfo = req.body;

    serviceCollection.insertOne(serviceInfo).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });
  app.post("/adminUser", (req, res) => {
    const adminUser = req.body;
    adminCollection.insertOne(adminUser).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });

  app.get("/bookingListDetails", (req, res) => {
    bookingCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/bookingList", (req, res) => {
    const email = req.body.email;
    bookingCollection.find({ email: email });
    const filter = { email: email };
    bookingCollection.find(filter).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });
  app.patch("/updateStatus/:id", (req, res) => {
    console.log(req);
    const id = ObjectID(req.params.id);
    console.log("update this", id);
    bookingCollection.updateOne({ _id: id }),
      {
        $set: { Status: req.body.status },
      }.then((err, result) => {
        console.log(result);
      });
  });

  app.get("/servicesList", (req, res) => {
    serviceCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  app.delete("/deleteService/:id", (req, res) => {
    console.log(req);
    const id = ObjectID(req.params.id);
    console.log("delete this", id);
    serviceCollection.deleteOne({ _id: id }).then((err, result) => {
      console.log(result);
    });
  });

  console.log("db connected!", err);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
