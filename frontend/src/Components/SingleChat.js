import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Text,
  Spinner,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

// const io = require('socket.io')(server,{
//   pingTimeout : 60000,
//   cors :{
//       origin : "http://localhost:3000"
//   }
// })

import { ChatState } from "../Context/chatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import { useEffect } from "react";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:5005";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  // selectedChat : user and group on which the mouse is clicked
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const [messages, setMessages] = useState();

  const [loading, setLoading] = useState(false);

  // message that we type inside the chat input box to send a message to user
  const [newMessage, setNewMessage] = useState();

  // to indicate whether the socket is connected or not

  const [socketConnected, setSocketConnected] = useState(false);

  //very first time when user loggs in user will connect to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("connection", () => {
      setSocketConnected(true);
    });
  }, []);

  // fetching all the messages of particular chat  to render it on the screen
  // when that chat is pressed
  const fetchMessage = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log("on friday evening", data);
      setMessages(data);
      setLoading(false);
      // console.log("after the lunch", messages);

      console.log("selected chat id room id", selectedChat._id);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // when we type message in input box and press enter button our message should go to backend
  // and it should be appended as a last message to the existing all the message for that
  // particular child
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        // once we type the message and hit the enter button our message is sent to backend
        // to store that message in that particuler chat so we are setting newMessage to empty
        setNewMessage("");

        socket.emit("new message", data);

        setMessages([...messages, data]);
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
  };

  // for controlled input
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // console.log(e.target.value)
  };

  useEffect(() => {
    fetchMessage();
    // making the copy of selected chat so that to emit the message or show the notification
    // ie the moment when we just logged in but doesn't clicked on a chat in mychats area
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("new message", (newMessageReceived) => {
      console.log("././././", newMessageReceived);
      if (!newMessageReceived.chats) {
        console.log(`User does't exist`);
      }
      socket.emit(messages);
    });
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log("JOSEPSH 2", newMessageReceived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
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
              display={{ base: "flex", md: "none" }}
              icon={ArrowBackIcon}
              onClick={() => setSelectedChat("")}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                ></ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                ></UpdateGroupChatModal>
              </>
            )}
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
            {loading ? (
              <Spinner
                w={20}
                h={20}
                size="xl"
                margin="auto"
                alignSelf="center"
              ></Spinner>
            ) : (
              <div className="messages">
                {/* messages */}
                <ScrollableChat messages={messages}></ScrollableChat>
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              ></Input>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
