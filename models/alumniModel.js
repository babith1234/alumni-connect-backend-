const mongoose = require('mongoose');


const alumniSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone_number: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  // Professional Details
  company: {
    type: String,
    required: true,
    trim: true
  },
  stack: {
    type: [String], // Array of strings to list tech stack items
    required: true
  },
  package: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },

  // Additional Information
  advice: {
    type: [String],
  },
  comment: {
    type: String,
    trim: true
  },
  requirements: {
    type: [String], // Array of strings for requirements
  },

  // Chats Field - Array of student user IDs
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student' // Refers to the Student model
    }
  ]

}, {
  timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

const Alumni = mongoose.model('Alumni', alumniSchema);

module.exports = Alumni;
