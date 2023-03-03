import { AddIcon } from '@chakra-ui/icons'
import { useToast ,Box, Button, Stack, Text} from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getSender } from '../config/ChatLogics'
import { ChatState } from '../Context/chatProvider'
import ChatLoading from './ChatLoading'
import {} from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import GroupChatModal from './miscellaneous/GroupChatModal'

const MyChats = ({ fetchAgain }) => {

  const [loggedUser, setLoggedUser] = useState()
  const {user,selectedChat, setSelectedChat, chats, setChats } = ChatState()

  console.log('printing the chats...', chats)

  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);

      console.log('chat data',data)
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(async () =>{
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
      fetchChats()
  },[fetchAgain])

  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
    h="500px"

    >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      fontFamily="Work sans"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      My Chats
      <GroupChatModal>
          <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />} >
                  New Group Chat
          </Button>
      </GroupChatModal>
       </Box>
       <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden">
        {chats ? (
          <Stack overflowY='scrool'>
            { chats.map((chat) =>(<Box
            onClick={() => setSelectedChat(chat)}
            cursor="pointer"
            bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
            color={selectedChat === chat ? "white" : "black"}
            px={3}
            py={2}
            borderRadius="lg"
            key={chat._id}

            >
              {console.log('isGroupChat of group',chat.isGroupChat)}
              <Text>
                {
                  !chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName
                }
              </Text>

            </Box>)) }
          </Stack>
        ) : <ChatLoading/>}
     </Box>
      </Box>
  )
}

export default MyChats