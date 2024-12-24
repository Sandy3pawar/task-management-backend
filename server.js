const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// load environment variables
dotenv.config();
// create an Express application instance 
const app= express();
// set middleware 
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
// routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// mongoDB connections
console.log('mongo URI', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,}).then(() => {
        console.log("Connected to MongoDB");
        // start the server
        app.listen(5000, () => {
            console.log(`Server is listening on port ${PORT}  ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`);
        });
    }).catch((error) => {
        // `Error connecting to MongoDB: ${error}`;
        console.log(error);
    })