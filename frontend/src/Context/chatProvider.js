// import { createContext, useContext, useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom';

// const ChatContext = createContext()

// this children is whole of our app
// const ChatProvider = ({ children }) =>{
//     const [user, setUser ] = useState([])
//     const history = useHistory()
//     useEffect(() =>{In this example, the useEffect hook fetches the variable asynchronously using async/await. Once the variable has been fetched, the loading state is set to false. During the loading state, the component returns a loading message or component. Once the variable is fetched, the component renders the variable.


//         const userInfo =  JSON.parse(localStorage.getItem("userInfo"))
//         setUser(userInfo)
//         if(!userInfo){
//             history.push('/')
//         }
//     }, [history]
//     )
//     return(
//                 <ChatContext.Provider value={{user, setUser}}>
//                     {children}
//                 </ChatContext.Provider>
//         )
// };
//     export const ChatState = () =>{
//         return useContext(ChatContext)
//     }
// export default ChatProvider
//code starts here

import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


const ChatContext = createContext();


// This children parameter is actually whole of our app
// ie; all the component nested inside <App> including <App> component.

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState("");
  const [notification, setNotification] = useState([]);
  //populate all the chats
  const [chats, setChats] = useState();

  const history = useHistory();

  useEffect( () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // if (!userInfo) {
    //     history.push("/");
    // }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState =  () => {
  return  useContext(ChatContext);
};

export default ChatProvider;