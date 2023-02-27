import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
  import { Button, IconButton } from "@chakra-ui/button";
  import { ViewIcon } from '@chakra-ui/icons';
  import { Image, Text } from '@chakra-ui/react';
//   import {  } from '@chakra-ui/react';
//   var Lorem = require('react-lorem-component');



const ProfileModal = ({user, children}) => {
   const { isOpen, onOpen, onClose } = useDisclosure()
  
   return (
          <>{ children ? (<span onClick={onOpen}  >{children}</span>) : (
            <IconButton 
            d={{base : "flex"}}
            icon= {<ViewIcon></ViewIcon>}
            onClick={onOpen}
            >
            </IconButton>
          )  }
            {/* <Button onClick={onOpen}>My Profile</Button> */}
      
            <Modal  isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent h="410px">
                <ModalHeader
                fontFamily="Work sans"
                fontSize="40px"
                justifyContent="center"
                display="flex"
                >{user.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems='center'
                >
                  <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={user.pic}
                    alt={user.name}
                  ></Image>
                  <Text
                  fontSize={{ base : "20PX", md: "28px"  }}
                  fontFamily="Work sans"
                  >
                       Email :  {user.email}
                  </Text>
                </ModalBody>
      
                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )
}

export default ProfileModal


// function BasicUsage() {
//     const { isOpen, onOpen, onClose } = useDisclosure()
//     return (
//       <>
//         <Button onClick={onOpen}>My Profile</Button>
  
//         <Modal isOpen={isOpen} onClose={onClose}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Modal Title</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <Lorem count={2} />
//             </ModalBody>
  
//             <ModalFooter>
//               <Button colorScheme='blue' mr={3} onClick={onClose}>
//                 Close
//               </Button>
//               <Button variant='ghost'>Secondary Action</Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       </>
//     )
//   }