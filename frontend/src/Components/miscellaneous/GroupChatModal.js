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
    Text
  } from '@chakra-ui/react'
import React from 'react'
import { FormControl } from '@chakra-ui/react'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()


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
              >Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              >
                <FormControl>
                    <Text>Group Name</Text>
                <Input placeholder='Enter group name'></Input>
                </FormControl>
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

export default GroupChatModal