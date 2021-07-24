const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Schema.Types.Decimal128,
        required: true
    },
    description: String,
    image: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
});

ProductSchema.plugin(idValidator, {
    message: "Bsd ID value for {PATH}"
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;

