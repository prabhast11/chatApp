import { Container, Box, Text, Tab,Tabs,TabList,TabPanel,TabPanels } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'

function Homepage() {
  const history = useHistory()

  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem("userInfo"))
    console.log('checking the logout function', user)

    if(user){
      history.push('/chats')
    }
  },[history])

  return (
    <Container maxW='xl' centerContent>   
        <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="2xl" fontFamily="Work sans" textAlign="center">
          Chat-App
        </Text>
      </Box>
      <Box
      d="flex"
      justifyContent="center"
      p={3}
      bg="white"
      w="100%"
      m="10px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px"
      >
      <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList mb='1em'>
                <Tab width='50%' >Login</Tab>
                <Tab width='50%'>Signup</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Login/>
                </TabPanel>
                 <TabPanel>
                    <Signup/>
                </TabPanel>
            </TabPanels>
        </Tabs>
      </Box>

    </Container>
    )
}

export default Homepage