const Student = require('../models/studentModel');
const Alumni = require('../models/alumniModel');

const createProfile = async (req, res) => {
    try {
      const { profileType } = req.params; // Get the profileType from the URL parameter (Student or Alumni)
      const {
        name,
        phone_number,
        password,
        company,
        stack,
        package,
        location,
        advice,
        comment,
        requirements,
        
      } = req.body;
  
      // Create the profile based on the profile type
      let profile;
      if (profileType === 'student') {
        // Create Student Profile
        profile = new Student({
          name,
          password
        });
  
      } else if (profileType === 'alumni') {
        // Create Alumni Profile
        profile = new Alumni({
          name,
          phone_number,
          password,
          company,
          stack,
          package,
          location,
          advice,
          comment,
          requirements,
        });
      }
  
      // Save the profile to the database
      await profile.save();
  
      // Send a success response
      res.status(201).json({
        message: `${profileType.charAt(0).toUpperCase() + profileType.slice(1)} profile created successfully`,
        profile
      });
  
    } catch (err) {
      // Catch and handle any errors
      console.error(err.message);
      res.status(500).json({
        message: 'Server error',
        error: err.message
      });
    }
  };

 
// Controller to add a student's ObjectId to the alumni's chats array
const addChat = async (req, res) => {
  const { alumniId, studentId } = req.params;

  try {
    // Check if the alumni and student exist in the database
    const alumni = await Alumni.findById(alumniId);
    const student = await Student.findById(studentId);

    // If alumni or student is not found, return a 404 error
    if (!alumni || !student) {
      return res.status(404).json({ message: 'Alumni or Student not found' });
    }

    // Check if the student's ObjectId is already in the alumni's chats array
    if (alumni.chats.includes(studentId)) {
      return res.status(400).json({ message: 'Student already exists in the alumni chats' });
    }

    // Add the student's ObjectId to the alumni's chats array
    alumni.chats.push(studentId);

    // Save the alumni profile with the updated chats array
    await alumni.save();

    res.status(200).json({
      message: 'Student added to alumni chats successfully',
      alumni
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const login = async (req, res) => {
    const { name, password } = req.body; // Expecting name and password in the body
    const { type } = req.params; // Expecting type (student or alumni) in the URL

    try {
        let user;
        let role;

        if (type === 'student') {
            user = await Student.findOne({ name });
            role = 'student';
        } else if (type === 'alumni') {
            user = await Alumni.findOne({ name });
            role = 'alumni';
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token with user ID and role
        const token = jwt.sign(
            { userId: user._id, role: role },
            process.env.JWT_SECRET, // Make sure to set this in your environment variables
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} login successful`,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                role:role
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

  

  const getStudentsFromChats = async (req, res) => {
    const alumniId = req.params.id;  // Extract the alumni ID from the URL params
  
    try {
      // Find the Alumni by ID
      const alumni = await Alumni.findById(alumniId);
      
      // If no alumni found, return an error
      if (!alumni) {
        return res.status(404).json({ message: 'Alumni not found' });
      }
  
      // Extract the student IDs from the chats array
      const studentIds = alumni.chats;
      
      // If no students in the chats, return a message
      if (!studentIds || studentIds.length === 0) {
        return res.status(404).json({ message: 'No students in the alumni chats' });
      }
  
      // Find all students by their IDs
      const students = await Student.find({ '_id': { $in: studentIds } });
  
      // If no students found, return an error
      if (students.length === 0) {
        return res.status(404).json({ message: 'No students found for the alumni' });
      }
  
      // Map through students and return only their names
      const studentNames = students.map(student => student.name);
  
      // Respond with the student names
      res.status(200).json({
        message: 'Student names fetched successfully',
        students: studentNames,
      });
      
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  const getAllAlumni = async (req, res) => {
    try {
      // Find all alumni in the database
      const alumni = await Alumni.find();
  
      // If no alumni found, return an error
      if (alumni.length === 0) {
        return res.status(404).json({ message: 'No alumni found' });
      }
  
      // Respond with the list of alumni
      res.status(200).json({
        message: 'Alumni fetched successfully',
        alumni: alumni,
      });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  


  const UrlModel = require('../models/referalModel'); // Import the model

// Controller to create a new URL document with category
const createUrl = async (req, res) => {
  try {

    const { url, category } = req.body; // Get the URL and category from the request body
   
    // Validate URL and category (ensure they are not empty)
    if (!url || !category) {
      return res.status(400).json({ message: 'URL and category are required' });
    }

    // Create a new UrlModel instance
    const newUrl = new UrlModel({
      url,
      category
    });

    // Save the new URL document
    await newUrl.save();

    // Send a success response
    return res.status(201).json({ message: 'URL created successfully', data: newUrl });
  } catch (error) {
    console.error('Error creating URL:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getAllUrls = async (req, res) => {
    try {
      // Fetch all URL documents from the database
      const urls = await UrlModel.find(); 
  
      // Check if no URLs are found
      if (!urls || urls.length === 0) {
        return res.status(404).json({ message: 'No URLs found' });
      }
  
      // Send the list of URLs in the response
      return res.status(200).json({ message: 'URLs fetched successfully', data: urls });
    } catch (error) {
      console.error('Error fetching URLs:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


module.exports = { createProfile, addChat,login, getStudentsFromChats, getAllAlumni,createUrl,getAllUrls};