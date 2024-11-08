const mongoose = require('mongoose');

// Define the schema for storing the URL and category
const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
   // Validate URL format
  },
  category: {
    type: String,
    required: true,
    enum: ['web-app', 'ai-ml', 'electronics', 'mechanics','Software','others'], 
    
  }
}, { timestamps: true }); 

// Create a model from the schema
const UrlModel = mongoose.model('UrlModel', urlSchema);

module.exports = UrlModel;
