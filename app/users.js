const axios = require("axios");
const express = require("express");
const { nanoid } = require("nanoid");
const config = require("../config");
const User = require("../models/User");

const router = express.Router();

const createRouter = () => {
    router.get("/", async (req, res) => {
        try {
            const users = await User.find();
            res.send(users);
        } catch (err) {
            res.status(500).send(err);
        }
    });
    router.post("/", async (req, res) => {
        try {
            const user = new User(req.body);
            user.generateToken();
            await user.save();
            res.send(user);
        } catch (err) {
            res.status(400).send(err);
        }
    });
    router.post("/sessions", async (req, res) => {
        const user = await User.findOne({username: req.body.username});

        const errorMessage = "Wrong username or password";

        if (!user) return res.status(400).send({error: errorMessage});

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) return res.status(400).send({error: errorMessage});

        user.generateToken();
        try {
            await user.save({ validateBeforeSave: false });
        } catch(e) {
            res.status(500).send(e);
        }

        res.send(user);
    });
    router.delete("/sessions", async (req, res) => {
        const token = req.get("Authentication");
        const success = {message: "Success"};

        if (!token) return res.send(success);

        const user = await User.findOne({token});

        if (!user) return res.send(success);

        user.generateToken();
        try {
            await user.save({ validateBeforeSave: false });
            return res.send(success);
        } catch(e) {
            res.status(500).send(e);
        }
    });
    router.post('/facebook-login', async (req, res) => {
        const inputToken = req.body.accessToken;
        const accessToken = config.fb.appId + "|" + config.fb.appSecret;
        const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;
        try {
            const response = await axios.get(debugTokenUrl);
            if (response.data.data.error) {
                return res.status(401).send({message: "Facebook token incorrect"});
            }
            if (req.body.id !== response.data.data.user_id) {
                return res.status(401).send({message: "Wrong user ID"});
            }
            let user = await User.findOne({facebookId: req.body.id});
            if (!user) {
                user = new User({
                    username: req.body.email,
                    password: nanoid(20),
                    facebookId: req.body.id,
                    displayName: req.body.name
                })
            }
            user.generateToken();
            await user.save({validateBeforeSave: false});
            return res.send(user);
        } catch (err) {
            return res.status(500).send({message: "Something went wrong"})
        }
    });

    return router;
};

module.exports = createRouter;
