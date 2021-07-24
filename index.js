const express = require("express");
const cors = require("cors");
const config = require("./config");
const mongoose = require("mongoose");
const products = require("./app/products");
const categories = require("./app/categories");
const users = require("./app/users");

const app = express();

const port = process.env.NODE_ENV === 'test' ? 8010 : 8000;

const run = async () => {
    await mongoose.connect(config.getDbUrl(),
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true
    });

    app.use(cors());
    app.use(express.static("public"));
    app.use(express.json());
    app.use("/products", products());
    app.use("/categories", categories());
    app.use("/users", users());

    app.listen(port, () => {
        console.log("Server started at http://localhost:" + port);
    });
};
run().catch(e => console.log(e));



