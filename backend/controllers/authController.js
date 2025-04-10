

const router = require('express').Router();
const User= require('./../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/singup',async (req, res)=>{
    try{
        // 1. If the user already exist
        const user = await User.findOne({email: req.body.email});

          

        // 2. if user exist send an error message 

        if(user){
            res.send({
                message: 'user exist',
                success: false
            })
            return;
        }

        // 3. encrypt the password

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        //4. create new user, save it in database

       const newUser = new User(req.body);
       newUser.save();

       res.send({
        message: 'user created',
        success: true
       })
       

    }
    catch(error){
       return res.send({
            message: error.message,
            success: false
        })
    }
   
})

router.post('/login',async (req,res) => {
   try{
        //1. check if user exist or not
        const user = await User.findOne({email: req.body.email})
        
        
        if(!user){
            return res.send({
                message: 'user not exist',
                success: false
            })
        }
        //2. check password is correct
        const isValid = await bcrypt.compare(req.body.password, user.password)
        // console.log("isvalid", isValid);
        
        if(!isValid){
            return res.send({
                message: 'Incorrect Password',
                success: false
            })
        }

        //3. if the user exist & password is coorect, assign a jwt
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"});
        // console.log("token", token)
        res.send({
            message: 'login success',
            success: true,
            token: token
        });
   }
   catch(error){
    res.send({
        message: error.message,
        success: false
    })
   }
})


















module.exports = router;