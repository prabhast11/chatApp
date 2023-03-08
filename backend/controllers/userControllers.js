const asyncHandler = require('express-async-handler')
const User = require('../Models/userModel')
const generateToken = require('../config/generateToken')

const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    
    if(!name || !email || !password){
        // console.log('first')
     return   res.status(400)
        throw new Error('Please provide all the field')
    }

    const userExist = await User.findOne({email})
    // console.log('exist user',userExist)

    if(userExist){
        // console.log('second')
      return  res.status(400).json("user already exist")
        throw new Error('User already exists')
    }

    const user =await User.create({
        name,
        email,
        password
    })

    if(user){
      return  res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })
    }
    else{
        console.log('third')
        return res.status(400).json('something went wrong')
        throw new Error('Unable to create user')
    }

}

const authUser = async (req, res) =>{
    const {email, password} = req.body
    const user = await User.findOne({email})
    // console.log('data from front end', email,password)

    if(user &&  (await user.matchPassword(password)) ){
         return res.json({
                _id : user._id,
                name : user.name,
                email : user.email,
                pic : user.pic,
                token : generateToken(user._id)
            })
    }
    else{
       return res.status(400).json('Invalid email or password')
    }
}


//  /api/user?search=prabhas1
const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or : [
            { name : {$regex : req.query.search, $options : "i"}},
            { email : {$regex : req.query.search, $options : "i"} }
        ]
    } : {}

    const users = await User.find(keyword).find({_id : {$ne : req.user._id}})
    res.send(users)
    // console.log(keyword)



}

module.exports = {registerUser,authUser, allUsers }