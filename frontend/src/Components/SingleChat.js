import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text, Spinner, FormControl, Input , useToast} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import { useEffect } from 'react'
import './styles.css'
import ScrollableChat from './ScrollableChat'


const SingleChat = ({ fetchAgain , setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat} = ChatState()
    const toast = useToast();
    const [messages, setMessages] = useState()
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()

    const fetchMessage =async () =>{
      if(!selectedChat)
      {  
           return  
      }

      try {
        
        const config = {

          headers : {
            Authorization : `Bearer ${user.token}`
          }
        }

        setLoading(true)
          const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
          console.log('on friday evening', data)
        await  setLoading(false)
          await setMessages(data)
          console.log("after the lunch",messages)


      } catch (error) {

        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        
      }

    }

    const typingHandler = () =>{

    }

    useEffect(() =>{
        fetchMessage()
    }, [selectedChat])

  return (
    <>{
        selectedChat ? (
            <>
                <Text
                 fontSize={{ base: "28px", md: "30px" }}
                 pb={3}
                 px={2}
                 w="100%"
                 fontFamily="Work sans"
                 display="flex"
                 justifyContent={{ base: "space-between" }}
                 alignItems="center"
                >
                    <IconButton
                    display={{base : 'flex', md : "none"}}
                    icon={ArrowBackIcon}
                    onClick={ ()=> setSelectedChat("")}
                    ></IconButton>
                    {
                    
                    !selectedChat.isGroupChat ? (<>
                      { getSender(user, selectedChat.users) }
                      <ProfileModal
                        user={getSenderFull(user, selectedChat.users)}
                      ></ProfileModal>
                    </>) : 
                    (<>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal
                          fetchAgain={fetchAgain}
                          setFetchAgain={setFetchAgain}
                          fetchMessage={fetchMessage}
                          
                        ></UpdateGroupChatModal>
                    </>)
                    
                    }
                </Text>
                <Box
                  display="flex"
                  flexDir="column"
                  justifyContent="flex-end"
                  p={3}
                  bg="#E8E8E8"
                  w="100%"
                  h="100%"
                  borderRadius="lg"
                  overflowY="hidden"
                >
                    {
                     loading ? 
                      <Spinner
                      w={20}
                      h={20} 
                      size="xl" 
                      margin="auto" 
                      alignSelf="center" 
                      ></Spinner> :       
                      <div className='messages'> 
                      {/* messages */}
                      <ScrollableChat messages={messages}></ScrollableChat>
                      
                      </div>
                    }

                <FormControl onKeyDown ={fetchMessage} isRequired mt={3}  >
                      <Input
                      variant="filled"
                      bg="#E0E0E0"
                      placeholder='Enter a message...'
                      onChange={typingHandler}
                      value={newMessage}
                      ></Input>
                </FormControl>

                </Box>
            </>
        ) : 
         <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>
    }</>
  )
}

export default SingleChat