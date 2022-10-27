import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SwapPage from './components/Swap';
import { ConnectButton, useAccount } from '@web3modal/react';
function App() {
  const { connected, address } = useAccount()

  return connected ? <h1>{address ? address : 'none'} </h1> : <ConnectButton />
  // return (
  //   <Router>
  //     <Routes>
  //       <Route element={<SwapPage/>} path="/" />
  //     </Routes>
  //   </Router>
  // );
}

export default App;
