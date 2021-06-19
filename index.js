const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const port = process.env.PORT || 5001;
const mongoose = require("mongoose");
require("dotenv").config();
const { Admin } = require("./Model/Admin");
const { BookingCollection} =require("./Model/bookingCollection")
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kljii.mongodb.net/repairGuru?retryWrites=true&w=majority`;
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connected!"))
  .catch((error) => console.log(error));



app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/admin/register", (req, res) => {
  const admin = new Admin({
    email: req.body.email,
    password: req.body.password,
  }).save((err, response) => {
    if (err) res.status(400).send(err);
    res.status(200).send(response);
  });
});

app.post("/admin/login", (req, res) => {
  Admin.findOne({ email: req.body.email })
    .then((admin) => {
      if (!admin) res.status(202).json({ message: "invalid credentials" });
      else {
        admin.comparePassword(
          req.body.password,

          (err, isMatch) => {
            if (err) return console.log(err);
            else if (!isMatch) {
              return res.status(202).json({ message: "Invalid credentials" });
            } else res.status(201).json({ message: "success login" });
          }
        );
      }
    })

    .catch((error) => {
      res.status(500).json(error);
    });
});

app.post("/addBooking", (req, res) => {
  var bookingCollection = new BookingCollection({
    name: req.body.name,
    email: req.body.email,
    problem: req.body.problem,
    payWith: req.body.payWith,
    status: req.body.status,
   
  }).save((err, response) => {
    if (err) res.status(201).send(err);
    res.status(201).send(response);
  });
});
app.get("/bookingListDetails", function (req, res) {
  BookingCollection.find(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    });
  });
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
   const bookingInfoCollection = client.db("repairGuru").collection("bookingcollections");
  const reviewCollection = client.db("repairGuru").collection("userReview");
  const serviceCollection = client.db("repairGuru").collection("services");

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
 
  app.post("/bookingList", (req, res) => {
    const email = req.body.email;
    bookingInfoCollection.find({ email: email });
    const filter = { email: email };
    bookingInfoCollection.find(filter).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.put("/statusUpdate/:id",(req, res)=>{
    var response = {};

        BookingCollection.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
      
                if(req.body.status !== undefined) {
                
                    data.status = req.body.status;
                }
               
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
})

 
  

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
