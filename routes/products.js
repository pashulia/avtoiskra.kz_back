
const express = require("express");
const {nanoid} = require("nanoid");
const multer = require("multer");
const auth = require("../middleware/auth");
const path = require("path");
const Product = require("../models/Product")
const config =require("../config");
const ValidationError = require("mongoose").Error.ValidationError;
const permit = require('../middleware/permit');
const router = express.Router();

const PRODUCT_PAGE_COUNT = 15;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const createRouter = () => {
    router.get("/", async (req, res) => {
        await Product.find(req.query)
            .populate("category", "title").sort({price: +1})
            .exec((err, products) => {
                products.filter(product => {
                    return product.category._id.equals(req.query.category);
                });
                if (products) {
                    res.send(products)
                } else {
                    res.status(404).send("not found");
                }
            });
    });

    router.post("/", [upload.single("image"), auth, permit("admin")], async (req, res) => {
        const product = {...req.body};
        if (req.file) {
            product.image = req.file.filename;
        }
        const result = new Product(product);
        try {
            await result.save();
            res.send(result);
        } catch (err) {
            if (err instanceof ValidationError){
                res.status(400).send(err);
            } else {
                res.sendStatus(500);
            }
        }
    });

    router.get('/filters', filter, async (req, res) => {
        let page = 0;
        let limit = PRODUCT_PAGE_COUNT;
        ProductFilter.find()
            .skip(page * limit)
            .limit(limit)
            .exec((err, doc) => {
                if (err) {
                    return res.send(err);
                }
                ProductFilter.estimatedDocumentCount().exec((count_error, count) => {
                    if (err) {
                        return res.send(count_error);
                    }
                    return res.send({
                        items: count,
                        pages: Math.ceil(count / limit),
                        page: page,
                        pageSize: doc.length,
                        products: doc,
                    });
                });
            });
    });
    
    router.get('/pages', filter, (req, res) => {
        let page = parseInt(req.query.page) || 0;
        let limit = parseInt(req.query.limit) || PRODUCT_PAGE_COUNT;
        ProductFilter.find()
            .skip(page * limit)
            .limit(limit)
            .exec((err, doc) => {
                if (err) {
                    return res.send(err);
                }
                ProductFilter.estimatedDocumentCount().exec((count_error, count) => {
                    if (err) {
                        return res.send(count_error);
                    }
                    return res.send({
                        items: count,
                        pages: Math.ceil(count / limit),
                        page: page,
                        pageSize: doc.length,
                        products: doc,
                    });
                });
            });
    });
    

    router.get("/:id", auth, async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            .populate("category");
            if (product) {
                res.send(product);
            } else {
            res.sendStatus(404);
            }
        } catch (err) {
            res.sendStatus(500);
        }      
    });

    router.get('/last', async (req, res) => {
        try {
            const lastFourProducts = await Product.find().sort({ _id: -1 }).limit(4);
            if (req.query.sort) {
                if (req.query.order === 'asc') {
                    res.send(sortArrAsc(lastFourProducts, req.query.sort));
                } else {
                    res.send(sortArrDesc(lastFourProducts, req.query.sort));
                }
            } else {
                res.send(lastFourProducts);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    });
    
    router.put("/:id", auth, async (req, res) => {
        await Product.findByIdAndUpdate(
            req.params.id,
            {$inc: {price: "-10.934"}}
        );
        const updateProduct = await Product.findById(req.params.id);
        res.send(updateProduct);
    });

    return router;
};


module.exports = createRouter;