const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9zut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run() {
    try {
        await client.connect();
        // console.log("connected to database")
        const database = client.db("jum-TT");
        const servicesCollection = database.collection("services");
        // Get service
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // Single service
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            // console.log("getting id", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        // // Post Api
        app.post("/services", async (req, res) => {
            const service = req.body;
            // console.log("hit the api", service);
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        })
        // Delete Api
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Running JUM T&T Server")
})


app.listen(port, () => {
    console.log("server", port)
})