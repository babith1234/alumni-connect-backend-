const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')

router.post('/create-profile/:profileType', userController.createProfile);
router.post('/add-chat/:alumniId/:studentId', userController.addChat);
router.post('/login/:type', userController.login);
router.get('/get-students-from-chats/:id', userController.getStudentsFromChats);
router.get('/get-all-alumni', userController.getAllAlumni);

module.exports=router