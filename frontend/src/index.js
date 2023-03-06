import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter } from 'react-router-dom'
import ChatProvider from './Context/chatProvider';


// // Bootstrap CSS
// import "bootstrap/dist/css/bootstrap.min.css";
// // Bootstrap Bundle JS
// import "bootstrap/dist/js/bootstrap.bundle.min";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <BrowserRouter>
      <ChatProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
      </ChatProvider>
        </BrowserRouter>
);

