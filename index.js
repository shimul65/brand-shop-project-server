const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5555;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n45ephu.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const productsCollection = client.db('productsDB').collection('products');

        const cartProductsCollection = client.db('productsDB').collection('cartProducts');


        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })


        app.put('/products/:id', async (req, res) => {
            const product = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = {
                $set: {
                    name: product.name,
                    brand_name: product.brand_name,
                    product_type: product.product_type,
                    ratting: product.ratting,
                    price: product.price,
                    description: product.description,
                    photo: product.photo,
                }
            }
            const result = await productsCollection.updateOne(query, updateProduct, options);
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })


        // cart product related API

        app.get('/cartProducts', async (req, res) => {
            const result = await cartProductsCollection.find().toArray();
            res.send(result);
        })

        app.get('/cartProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartProductsCollection.findOne(query);
            res.send(result);
        })

        app.post('/cartProducts', async (req, res) => {
            const newCartProduct = req.body;
            console.log(newCartProduct);
            const result = await cartProductsCollection.insertOne(newCartProduct);
            res.send(result);
        })

        app.delete('/cartProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartProductsCollection.deleteOne(query);
            res.send(result);
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
    res.send('Brand-shop Server is running')
})

app.listen(port, () => {
    console.log(`Brand-shop Server is running on port ${port}`);
})