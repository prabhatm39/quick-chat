const router = require('express').Router();
const authMiddleware = require('./../middelwares/authMiddleware');
const Chat = require('./../models/chat');
const Message = require('./../models/message');

router.post('/create-new-chat', authMiddleware, async(req, res)=>{
    try{    
        const chat = new Chat(req.body);
        const saveChat = await chat.save();

        await saveChat.populate('members');


        res.status(201).send({
            message: 'Chat created successfully',
            success: true,
            data: saveChat
        })

    }
    catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})



router.get('/get-all-chats', authMiddleware, async(req, res)=>{
    try{    
        const allChat = await Chat.find({members: {$in: req.body.userId}})
                                  .populate('members')
                                  .populate('lastMessage')
                                  .sort({updatedAt: -1});
        res.status(201).send({
            message: 'All chat fetch successfully',
            success: true,
            data: allChat
        })
    }
    catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})


router.post('/clear-unread-message', authMiddleware, async(req,res) => {
    try{
        const chatId = req.body.chatId;
        //we want to update the unread message count in chat application
        const chat = await Chat.findById(chatId);
        if(!chat){
            res.send({
                message: 'Chat not found',
                success: false
            })

        }
        const updatedChat =await Chat.findByIdAndUpdate(
            chatId,
            {unreadMessageCount: 0},
            {new: true}
        ).populate('members').populate('lastMessage');

        //we want to update the read property to true in message collection

        await Message.updateMany({
            chatId: chatId,
            read: false
        },
    {
        read: true
    })
    res.send({
        message: 'Unread message count updated successfully',
        success: true,
        data: updatedChat
    })

    }
    catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
})

module.exports = router;