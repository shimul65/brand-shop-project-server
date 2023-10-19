const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5555;

// middleware
app.use(cors());
app.use(express.json());










app.get('/', (req, res) =>{
    res.send('Brand-shop Server is running')
})

app.listen(port, () => {
    console.log(`Brand-shop Server is running on port ${port}`);
})