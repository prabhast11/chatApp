const express = require('express')
require('dotenv').config()
const chats = require('./data/data.js')
var cors = require('cors');
const connectDB= require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')

connectDB()

const app = express()
app.use(cors());

// to accept json data from frontend
app.use(express.json())

app.get('/',(req, res) =>{
    res.send('API is running...')
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


// app.get('/api/chat', (req, res) =>{
//     console.log('an axios request came from frontend')
//     res.send(chats)
// })

// app.get('/api/chat/:id', (req, res) =>{
//     const data = chats.chats.find((chat) =>{ return chat._id === req.params.id  } )
//     console.log(data)
//     res.json(data)
//     // res.send(data)
// })

const PORT = process.env.PORT || 5005
app.listen(PORT, () =>{
    console.log(`server started listening on ${PORT}`)
})
