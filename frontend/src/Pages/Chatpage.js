import SideDrawer from "../Components/miscellaneous/SideDrawer"
import { ChatState } from "../Context/chatProvider"
import { Box } from "@chakra-ui/react"
import MyChats from "../Components/MyChats"
import ChatBox from "../Components/ChatBox"
import { useState } from "react"
// import ChatState from "../Context/chatProvider"


function Chatpage() {
    const { user }  = ChatState()
    const [fetchAgain, setFetchAgain] = useState()
    // console.log('inside chatpage', user)
    // const user = ChatState()
    // console.log("sidedrawer user using context api",user)

  return (  
    <div style={{width : "100%"}}>
        {user && <SideDrawer/>} 
        {/* <Box
            d="flex"
            justifyContent="space-between"
            w="100%"
            h="91.5vh"
            p="10px"
        > */}
            <div 
             style={{display : 'flex', justifyContent :'space-between'}}
            >
                {user && <MyChats fetchAgain={fetchAgain}   />}
                {user && <ChatBox fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain} />}
            </div>
        {/* </Box> */}
    </div>
    )
}

export default Chatpage





// import React, { useState, useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import List from '@material-ui/core/List';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';

// import Header from '../Layout/Header';
// import ChatBox from '../Chat/ChatBox';
// import Conversations from './Conversations';
// import Users from './Users';

// const useStyles = makeStyles(theme => ({
//     paper: {
//         minHeight: 'calc(100vh - 64px)',
//         borderRadius: 0,
//     },
//     sidebar: {
//         zIndex: 8,
//     },
//     subheader: {
//         display: 'flex',
//         alignItems: 'center',
//         cursor: 'pointer',
//     },
//     globe: {
//         backgroundColor: theme.palette.primary.dark,
//     },
//     subheaderText: {
//         color: theme.palette.primary.dark,
//     },
// }));

// const Chatpage = () => {
//     const [scope, setScope] = useState('Global Chat');
//     const [tab, setTab] = useState(0);
//     const [user, setUser] = useState(null);
//     const classes = useStyles();

    // const handleChange = (e, newVal) => {
    //     // setTab(newVal);
    // };

    // return (
    //     <React.Fragment>
    //         {/* <Header /> */}
    //         <Grid container>
    //             <Grid item md={4} className={classes.sidebar}>
    //                 <Paper className={classes.paper} square elevation={5}>
    //                     <Paper square>
    //                         <Tabs
    //                             onChange={handleChange}
    //                             variant="fullWidth"
    //                             value={tab}
    //                             indicatorColor="primary"
    //                             textColor="primary"
    //                         >
    //                             <Tab label="Chats" />
    //                             <Tab label="Users" />
    //                         </Tabs>
    //                     </Paper>
                        {/* {tab === 0 && (
                            <Conversations
                                setUser={setUser}
                                setScope={setScope}
                            />
                        )} */}
                        {/* {tab === 1 && (
                            <Users setUser={setUser} setScope={setScope} />
                        )} */}
                //     </Paper>
                // </Grid>
                // <Grid item md={8}>
                    {/* <ChatBox  /> */}
//                 </Grid>
//             </Grid>
//         </React.Fragment>
//     );
// };

// export default Chatpage;

