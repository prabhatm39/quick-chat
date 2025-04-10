
const router = require('express').Router();
const User= require('./../models/user');
const authMiddleware = require('./../middelwares/authMiddleware');
const cloudinary  = require('../cloudinary');


//Get details of currect loggin user
router.get('/get-logged-user',authMiddleware, async (req, res) =>{
    try{
        const user = await User.findOne({_id: req.body.userId})
        res.send({
            message: 'User found successfully',
            success: true,
            data: user
        })

    }
    catch(error){
        res.send({
            message: error.maessage,
            success: false
        })
      
    }

   
})



router.get('/get-all-users',authMiddleware, async (req, res) =>{
    try{
        const userId = req.body.userId;
        const allUsers = await User.find({_id: {$ne: userId}})
        res.send({
            message: 'All User found successfully',
            success: true,
            data: allUsers
        })

    }
    catch(error){
        res.send({
            message: error.maessage,
            success: false
        })
      
    }

   
})

router.post('/upload-profile-pic', authMiddleware, async (req,res) => {
    try{
        const image = req.body.image;

        //we need to upload image to cloudinary
        const uploadedImage= await cloudinary.uploader.upload(image,{
            folder: 'quick-chat'
        });

       const user = await User.findByIdAndUpdate({
            _id: req.body.userId
        }, {
            profilePic: uploadedImage.secure_url
        },{
            new: true
        });
        res.send({
            message: 'profile pic uploaded successfullly',
            success: true,
            data: user
        })



        //update the user model and set profile pic

    }
    catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
})



module.exports = router;