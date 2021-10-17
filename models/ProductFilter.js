const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

const ProductFilterSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  factory: {
    type: Schema.Types.ObjectId,
    ref: 'Factory',
    required: true,
  },
});

ProductFilterSchema.plugin(idValidator, {
  message: 'Bad ID value for {PATH}',
});

const ProductFilter = mongoose.model('ProductFilter', ProductFilterSchema);

module.exports = ProductFilter;
