const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avi8n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());

client.connect(err => {
    const bookCollection = client.db("madReadersDB").collection("bookCollection");
    const orders = client.db("madReadersDB").collection("orders");

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        bookCollection.insertOne(newBook)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/allBooks', (req, res) => {
        bookCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        bookCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })

    app.get('/selected/:id', (req, res) => {
        bookCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/orders/', (req, res) => {
        const emailAddress = req.query.email;
        orders.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/checkOut', (req, res) => {
        const orderInfo = req.body;
        orders.insertOne(orderInfo)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
});



app.get('/', (req, res) => {
    res.send('Hello duniya');
})

app.listen(process.env.PORT || port);