const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");
const mongoose = require('mongoose');
const { remove } = require("../Models/userModel");


// 1. either creating or if already exists then fetching the one to one chat of 
//    current logged-in user and the user with which a user want to chat 
const  accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;


  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
  
    .populate("users","-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// 2. fetching(not creating here) all the chats in which current logged-in user 
//    is involved ie; one to one or group-chat(?pls verify for group chat?)          
const fetchChats = asyncHandler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

// 3. creating a new chat group

const createGroupChat = asyncHandler( async (req, res) =>{
        if(!req.body.name || ! req.body.users)
        {
           return res.status(400).send({message  :'send necessary data' })
        }

        // since users is an array hence we can't send array directly from frontend 
        // hence stringify at frontend hence we need to JSON.parse() that incoming users
        var users = JSON.parse(req.body.users)

        if(users.length < 2){
            return res.status(400).send('more than 2 users is required to create group chat')

        }

        // if any of above condition is not satisfied
        // then create the group but add the current logged-in user also 

        users.push(req.user)
        try {
            const groupChat = await Chat.create({
                chatName : req.body.name,
                users : users,
                isGroupChat : true,
                groupAdmin : req.user
            })

            const fullGroupChat = await Chat.findOne({_id : groupChat._id})
                .populate("users","-password")
                .populate("groupAdmin","-password")

                res.status(200).json(fullGroupChat)

        } catch (error) {
            return res.status(400).send('error occured while group creation!!')
        }

})

// 4. rename the group

const renameGroup = asyncHandler ( async (req, res) =>{
            const {chatId, chatName } = req.body

            const updatedChat =await Chat.findByIdAndUpdate(chatId,
                {chatName},
                {new : true})
                .populate("users","-password")
                .populate("groupAdmin","-password")

            if(!updatedChat){
                return res.status(400)
            }
            else{
                res.json(updatedChat)
            }
})

// 5. add the new members to the group

const addToGroup = asyncHandler ( async (req, res) =>{
    const { chatId , userId} = req.body
    console.log('prabhas latest console')
    console.log('my chatId',typeof  mongoose.Types.ObjectId(userId)  )
    // new ObjectId(idinstring);
    // const data = await Chat.find({_id : chatId})
    // console.log('users from mongoose', data[0].users)
    // const user1= data[0].users
    const added = await Chat.findByIdAndUpdate(chatId,
         {$push : {users : userId}}, 
         {new : true})
    .populate("users", "-password")
    .populate('groupAdmin',"-password")
    // const newMember = await Chat.findByIdAndUpdate(chatId, {users : user1.push(new ObjectId(userId))}, {new : true})

    if(!added){
        return res.status(400).json('cannot add new member')
    }

    else{
        res.json(added)
    }
})

// 6. remove the existing member from the group

const removeFromGroup = asyncHandler( async (req, res)=>{
        const {chatId, userId}  = req.body

        const removed = await Chat.findByIdAndUpdate(chatId, 
                                                    { $pull : {users : userId }}, 
                                                    {new : true})
                                                    .populate("users","-password")
                                                    .populate("groupAdmin","-password")

        if(!removed){
            return res.status(400).json('cannot remove the member')
        }
        else{
            res.json(removed)
        }

})




module.exports = { accessChat, 
                   fetchChats,
                   createGroupChat,
                   renameGroup, 
                   addToGroup,
                   removeFromGroup 
                }