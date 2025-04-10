
const router = require('express').Router();
const authMiddleware = require('./../middelwares/authMiddleware');
const Chat = require('./../models/chat');
const Message = require('./../models/message');


router.post('/new-message', authMiddleware,async (req,res)=>{

    try{
        //store the message in message collection
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();


        // update the lastmessage in chat collection
        // const currentChat = await Chat.findById(req.body.chatId);
        // currentChat.lastMessage = saveMessage._id;
        // await currentChat.save();

        const currentChat = await Chat.findOneAndUpdate({
            _id:req.body.chatId
        }, {
            lastMessage:savedMessage._id,
            $inc: {unreadMessageCount: 1}
        });

        res.send({
            message:"message sent successfully",
            success:true,
            data: savedMessage
        })

    }
    catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
})


router.get('/get-all-message/:chatId', authMiddleware, async (req, res) =>{
    try{
        const allMessage = await Message.find({chatId: req.params.chatId})
        .sort({createdAt: 1})

        res.send({
            message: "all messages fetched successfully",
            success: true,
            data: allMessage
        })
    }
    catch(error){
        res.status(400).send({
            message: error.message,
            success:false
        })
    }
})

module.exports = router;