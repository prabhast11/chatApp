import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Route } from 'react-router-dom';
import Chatpage from './Pages/Chatpage';
import Homepage from './Pages/Homepage';
import { useEffect } from 'react';
import io from 'socket.io-client'


function App() {

  return (
    <div className="App">
      {/* Hello */}
      {/* <Button colorScheme='blue'>Button</Button> */}
      <Route  path='/' component={Homepage} exact></Route>
      <Route  path='/chats' component={Chatpage} exact></Route>
    </div>
  );
}

export default App;
