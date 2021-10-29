const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('This is the server of travelist')
})

app.listen(port, () => {
    console.log('server is running at ', port)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odpvs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const spotCollection = client.db("travelist").collection("spots");
      const bookedCollection = client.db("travelist").collection("bookedspot");
     // find all spots
      app.get('/allspots', async(req, res) => {
        const result = await spotCollection.find({}).toArray()
        res.send(result) 
      })

      // find all bookings
      app.get('/allbookings', async(req, res) => {
        const result = await bookedCollection.find({}).toArray()
        res.send(result) 
      })

      // api for find single spot with id
      app.get('/spots/:id', async(req, res) => {
        const id = req.params.id
        const query = {_id : ObjectId(id)}
        const result = await spotCollection.findOne(query)
        res.send(result)
      })
      
      //post api
      app.post('/addspot', async(req, res) => {
        const data = req.body;
        const result = await spotCollection.insertOne(data)
        res.json(result)
      })
      //post api for booked spot
      app.post('/bookedspot', async(req, res) => {
        const data = req.body;
        const result = await bookedCollection.insertOne(data)
        res.json(result)
      })
      // api for find bookings
      app.get('/mybookings/:email', async(req, res) => {
        const email = req.params.email;
        const query = {email : email}
        const result = await bookedCollection.find(query).toArray()
        res.send(result)
      })
    
      //delete api
      app.delete('/mybookings/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : ObjectId(id)}
        const result = await bookedCollection.deleteOne(query)
        res.json(result)
      })
      // update
    //   app.put('/blogs/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const updatedblog = req.body;
    //     const filter = {_id : ObjectId(id)}
    //     const options = { upsert: true };
    //     // create a document that sets the plot of the movie
    //     const updateDoc = {
    //       $set: {
    //         name: updatedblog.name,
    //         img: updatedblog.img,
    //         instructor: updatedblog.instructor,
    //         blog: updatedblog.blog
    //       },
    //     };
    //     const result = await blogCollection.updateOne(filter, updateDoc, options)
    //     console.log('upadating user ', id)
    //     res.send(result)
        
    //   })
      
    } finally {
    
    }
  }
  run().catch(console.dir);
