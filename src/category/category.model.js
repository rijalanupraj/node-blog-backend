// External Import
const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// Category Model
const Category = mongoose.model('Category', CategorySchema);

// Export Category Model
module.exports = Category;
