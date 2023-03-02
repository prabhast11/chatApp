// import { ModalCloseButton, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Text,
  useToast,
  Box
} from "@chakra-ui/react";
import React from "react";
import   {useState}  from "react";
import { FormControl } from "@chakra-ui/react";
import axios from 'axios'
import { ChatState } from "../../Context/chatProvider";
import UserListItem from "../UserAvatar/UserListItem"
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false)
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);



  const {user,selectedChat, setSelectedChat, chats, setChats } = ChatState()

  // useEffect(() => {
  //    setSearch(query)
  // }, [search]);

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

  const handleDelete = (delUser) =>{
    setSelectedUsers(selectedUsers.filter(sel => sel._id != delUser._id))

  }

  const handleSubmit = async () =>{
    if(!groupChatName || !selectedUsers){
      toast({
        title: "Error Occured!",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
  }

    try {
      const config = {
        headers :{
          Authorization : `Bearer ${user.token}`
        }
      }

      const { data } = await axios.post('/api/chat/group',{
        name : groupChatName,
        users : JSON.stringify(selectedUsers.map((u) => u._id))
      }, config)

      setChats([data,...chats])
      onClose()

      toast({
        title: "Created",
        description: "New group created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });

      setSelectedUsers([])
      setSearch("")

      console.log('value of search', search)

    } catch (error) {

      toast({
        title: "Failed",
        description: "Error while creating the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      
    }

  }

  const handleGroup = (userToAdd) =>{
        if(selectedUsers.includes(userToAdd)){
          toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontFamily="Work sans"
            fontSize="35px"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Text>Group Name</Text>
              <Input
                placeholder="chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
            <Text>Add Users</Text>
              <Input
                placeholder="Add users eg. Ajay Manish Bikash"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <Box
              w="100%"
              display="flex"
              flexWrap="wrap"
            >
            {selectedUsers.map((u) =>
              <UserBadgeItem
              key={u._id}
              user={u}
              handleFunction={ () => handleDelete(u) }
              ></UserBadgeItem>
            )
            }
            </Box>

            {loading ? <div>Loading...</div> : (
              searchResult?.slice(0,4).map(user => <UserListItem
                key={user._id}
                user={user}
                handleFunction= {() => handleGroup(user) }></UserListItem> )
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue"  onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
