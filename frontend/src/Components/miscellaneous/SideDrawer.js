import React from 'react'
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/chatProvider';
import ProfileModal from './ProfileModal'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem';
// import MyLogout from './MyLogout';
// import useDisclosure from '@chakra-ui/hooks'


import { useState } from 'react'
import { Menu, MenuButton ,
        Flex,
        MenuItem,
        DrawerBody,
        MenuList,
        MenuDivider, 
        Avatar, 
        Drawer, 
        DrawerOverlay, 
        DrawerContent, 
        DrawerHeader,
        useDisclosure, 
        DrawerFooter, 
        Input,
        useToast,
        Spinner
    } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

const SideDrawer = () => {
      const [ search , setSearch ] = useState("")
      const [searchResult, setSearchResult] = useState([])
      const [loading, setLoading] = useState(false)
      const [loadingChat, setLoadingChat] = useState()
      const { isOpen, onOpen, onClose } = useDisclosure()
      const {user, setSelectedChat, chats, setChats } = ChatState()
      const history = useHistory()

      const toast = useToast()

      // Implementing logout functionality
        const logoutHandler = () =>{
        localStorage.removeItem("userInfo")
        history.push('/')
     }

        // Implementing search of user to create the chat
        const handleSearch = async () =>{
            if(!search){
                toast({
                    title: 'Empty search',
                    description: "Please enter the search value",
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position : 'top-left'
                  })
            }

            try {
                    setLoading(true)

                    const config = {
                        headers : {
                            Authorization : `Bearer ${user.token}`
                        }
                    }
                    
                    const { data } = await axios.get(`/api/user?search=${search}`, config)
                    // console.log('loading data....', data )
                    setLoading(false)
                    setSearchResult(data)

            } catch (error) {
                toast({
                    title: 'Error Occured',
                    description: "Failed to load the data",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position : 'top-left'
                  })
                }
            }

        //craeting the chat with provided id
        const accessChat =async (userId) =>{

            try {
                    setLoadingChat(true) 
                    const config = {
                        headers : {
                            "Content-type" : "application/json",
                            Authorization : `Bearer ${user.token}`
                        }
                    }
                    
                    const { data } = await axios.post('/api/chat',{ userId }, config)

                    if(chats.find((c) => c._id === data._id))
                    {
                        setChats([data, ...chats])
                    }

                    setLoadingChat(false)
                    setSelectedChat(data)
                    onClose()

            } catch (error) {

                toast({
                    title: 'Error Occured',
                    description: "Failed to load the chat",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position : 'bottom-left'
                  })
                
            }

        }

  return (
    <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 10px 5px 10px"
          borderWidth="5px"
          flexDirection="row"
        >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Chat-App
        </Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <BellIcon fontSize="2xl" m={1}></BellIcon>
                </MenuButton>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    <Avatar 
                    size="sm"
                    cursor='pointer'
                    name={user.name}
                    // src={user.pic}
                    >

                    </Avatar>
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                           <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider/>
                    {/* <MenuItem><MyLogout></MyLogout></MenuItem> */}
                    <MenuItem 
                    onClick={logoutHandler}
                    >
                        Logout
                </MenuItem>
                </MenuList>
            </Menu>
        </div>
       
    </Box>
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px" >Search Users</DrawerHeader>
      
      <DrawerBody>
         <Box
            display="flex"
            pb="2px" 
            >
                <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange ={ (e) => setSearch(e.target.value) }
                >
                </Input>
                <Button onClick={handleSearch}>Go</Button>
        </Box>

                
        {
            loading ? (<ChatLoading></ChatLoading>) : searchResult?.map( user =>
                <UserListItem
                 key={user._id}
                 user={user}
                 handleFunction = { () => accessChat(user._id) }
                >
                </UserListItem>)
        }
        {loadingChat && <Spinner ml="auto" display="flex"/>}
      </DrawerBody>
      </DrawerContent>
    </Drawer>

    {/* <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer> */}

    </>
  )
}

export default SideDrawer