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
        chats
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



const login = async (req, res) => {
    const { name, password } = req.body;  // Expecting name and password in the body
    const { type } = req.params;  // Expecting type (student or alumni) in the URL
  
    try {
      // Determine which model to use (Student or Alumni)
      let user;
      if (type === 'student') {
        user = await Student.findOne({ name });
      } else if (type === 'alumni') {
        user = await Alumni.findOne({ name });
      } else {
        return res.status(400).json({ message: 'Invalid user type' });
      }
  
      // If no user found, return an error
      if (!user) {
        return res.status(404).json({ message: `${type} not found` });
      }
  
      // Compare the provided password directly (no bcrypt hashing)
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Successful login
      res.status(200).json({
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} login successful`,
        user: {
          id: user._id,
          name: user.name,
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
  

  
  module.exports = { createProfile, addChat,login, getStudentsFromChats, getAllAlumni };