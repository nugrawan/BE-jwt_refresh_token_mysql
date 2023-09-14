// gunakan   "type": "module", di package json agar export import bisa denga es6 module
const express = require('express');
const db = require('./config/Database');
const router = require('./routes/routes');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT

const connectToDatabase = async () => {
    try {
        await db.authenticate();
        console.log('Database connected...');
    } catch (err) {
        console.log(err);
    }
}
connectToDatabase();

app.use(cors({ credentials: true, origin: `http://localhost:${port}`}))
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(port, () => console.log(`Running at port ${port}`));