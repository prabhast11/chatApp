const asyncHandler = require('express-async-handler')
const Message = require('../Models/messageModel')
const User = require('../Models/userModel')

const sendMessage = asyncHandler( async (req, res) =>{

    const {chatId, content   } = req.body
    
    if(!chatId || !content){
        console.log('Invalid data passed into request')
        return res.sendStatus(400)
    }
    
    var newMessage = {
        content : content,
        chat : chatId,
        sender : req.user._id
    }
    console.log('message came from backend ttttttttooooday', newMessage)

        try {
            var message =await Message.create(newMessage)
console.log('ok so only print message',message)

// message = await message.populate("sender", "name ")

// message = await  message.populate("sender", "name")
// message = await  message.populate("sender", "name pic")
// message = await message.populate("chat")
console.log('ok so only print message 1',message)
            // message = await  User.populate(message,{
            //     path : "chat.users",
            //     select : "name pic email"
            // })

            // await Chat.findByIdAndUpdate(req.body.chatId,{
            //     latestMessage : message
            // })

            res.json(message)

            console.log('........_______,...........', message)
            
        } catch (error) {
            res.status(400)
        }

})

module.exports ={
    sendMessage
}


