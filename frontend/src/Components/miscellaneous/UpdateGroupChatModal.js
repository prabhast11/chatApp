import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import {ChatState } from '../../Context/chatProvider'
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat} = ChatState()

  const [groupChatName, setGroupChatName] = useState()
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [renameloading, setRenameloading] = useState(false);

  const toast = useToast();

  // Leave group api
  const handleRemove = async (user1) =>{
  // const val = window.confirm('Are you sure you want to leave?')

    // if(val){
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,                                                       
        isClosable: true,                    
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      // fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  // }
  }

  const handleAddUser = async (user1) =>{
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
          setLoading(true)

          const config = {
            headers : {
              Authorization : `Bearer ${user.token}`
            }
          }

          const { data } = await axios.put('/api/chat/groupadd',{
            chatId : selectedChat._id,
            userId : user1._id
          }, config)

          setSelectedChat(data)
          setFetchAgain(!fetchAgain)
          fetchMessage()
          setLoading(false)


    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)     
    }
    setGroupChatName("");
  }

  const handleRename = async () =>{

    if(!groupChatName){
      return
    }

    try {
          setRenameloading(true)

          const config = {
            headers :{
              Authorization : `Bearer ${user.token}`
            }
          }

          const { data } = await axios.put('/api/chat/rename',{
            chatId : selectedChat._id,
            chatName : groupChatName
          }, config) 

          setSelectedChat(data)
          setFetchAgain(!fetchAgain)
          setRenameloading(false)
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameloading(false);
      
    }
    setGroupChatName("");


  }
  
  const handleSearch = async (query) =>{
    
    await setSearch(query)
      if(!query){
        return
      }

      try {

        setLoading(true)

        const config = {
          headers : {
            Authorization : `Bearer ${user.token}`
          }
        }

        const { data }  = await axios.get(`/api/user?search=${search}`, config)

        console.log('my gc data', data)
        setLoading(false)
        setSearchResult(data)
      } catch (error) {

        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        
      }
  }
  return (
    <>
      {/* { console.log('group chat',selectedChat)  } */}
      <IconButton
        icon={<ViewIcon />}
        onClick={onOpen}
        display={{ base: "flex" }}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          display="flex"
          justifyContent="center"
          fontFamily="Work sans"
          fontSize="35px"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>

          <Text
          fontFamily="Work sans"
          fontSize="20px"
          background="pink"

          display="flex"
          justifyContent="center"
          >Group Admin  : {selectedChat.groupAdmin.name}</Text>

              <Box
              display="flex"
              flexWrap="wrap"
              pb={3}
              >
                {selectedChat.users.map(u =>
                  <UserBadgeItem
                   key={u._id}
                   user={u}
                   handleFunction={() => handleRemove(u)}
                  ></UserBadgeItem>
                  )}


          <FormControl display="flex">  
              <Input
                placeholder="New Group Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add New User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}

              </Box>

          </ModalBody>

          <ModalFooter>
          <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
