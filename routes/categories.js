const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

const createRouter = () => {
    router.get('/', async (req, res) => {
        try {
            const categories = await Category.find();
            res.send(categories);
        } catch (err) {
            res.sendStatus(500);
        }
    });
    
    router.post('/', async (req, res) => {
        const category = new Category(req.body);
        try {
            await category.save();
            res.send(category);
        } catch (err) {
            res.status(400).send(err);
        }
    });

    return router;
};

module.exports = createRouter;

