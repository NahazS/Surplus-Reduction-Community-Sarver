const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1tebz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express()

const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())





// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const AvailableFoodCollection = client.db('SurplusReductionCommunity').collection("availableFood")
    const RequestFoodCollection = client.db('SurplusReductionCommunity').collection("requestFood")


    app.get('/availableFood', async(req,res) => {
        if(req.query.foodName)
        {
            const query = {foodName: {$regex: req.query.foodName, $options: "i"}}
            const result = await AvailableFoodCollection.find(query).toArray()
            return res.send(result)
        } else if (req.query.donatorEmail)
        {
            const query = {donatorEmail: req.query.donatorEmail}
            const result = await AvailableFoodCollection.find(query).toArray()
            return res.send(result)
        }
        const cursor = AvailableFoodCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('running')
})
app.listen(port, () => {
    console.log(`running port : ${port}`)
})