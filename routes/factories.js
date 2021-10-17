const express = require('express');
const Factory = require('../models/Factory');

const router = express.Router();

const createRouter = () => {
  router.get('/', async (req, res) => {
    try {
      const factories = await Factory.find();
      res.send(factories);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.post('/', async (req, res) => {
    const factory = new Factory(req.body);
    try {
        await factory.save();
        res.send(factory);
    } catch (err) {
        res.status(400).send(err);
    }
});

  return router;
};

module.exports = createRouter;
