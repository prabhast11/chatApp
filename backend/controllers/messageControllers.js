const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");
const mongoose = require("mongoose");

//when message is typed in input box and hit the enter button
//the message will be saved in database based on senderID and chatID 

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  console.log("morning chat id 99999", chatId);
  if (!chatId || !content) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  // const objectId = mongoose.Types.ObjectId(idString);

  var newMessage = {
    content: content,
    // chat : mongoose.Types.ObjectId(chatId),
    chat: chatId,
    sender: req.user._id,
  };
  console.log("message came from backend ttttttttooooday", newMessage);

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name ")
    message = await message.populate("chat","chatName")
    
    await Chat.findByIdAndUpdate(req.body.chatId,{
        latestMessage : message
    })

    res.json(message);

    console.log("........_______...........", message);
  } catch (error) {
    res.status(400);
  }
});

const allMessages= asyncHandler( async (req, res) =>{

    const {limit, skip} = req.body

    try {
        const message = await Message.find({chat : req.params.chatId}).populate("sender",
        "name pic email").populate("chat")

        res.json(message)

    } catch (error) {
        return res.status(400)
    }

    // console.log("before meeting",req.params.chatId)
    // const message = await Message.find({ chat : req.params.chatId})
    // res.send(message)

})

module.exports = {
  sendMessage,
  allMessages
};
