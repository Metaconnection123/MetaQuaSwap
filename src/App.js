import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SwapPage from './components/Swap';
import { ConnectButton, useAccount } from '@web3modal/react';
import { Web3Modal } from "@web3modal/react";
import { WalletConnectButton } from "./components/WalletConnectButton";


const config = {
  projectId: 'f6b3b3cdad6af9ce4e840bae063879a1',
  theme: "dark",
  accentColor: "default",
  ethereum: {
    appName: 'eth_token_swap',
  },
};

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <WalletConnectButton />
        <Web3Modal config={config} />
        <a
          className="App-link"
          href="https://github.com/WalletConnect/web3modal"
          target="_blank"
          rel="noopener noreferrer"
        >
          WalletConnect/web3modal
        </a>
      </header>
    </div>
  );


  // const { connected, address } = useAccount()

  // return connected ? <h1>{address ? address : 'none'} </h1> : <ConnectButton />
  ////////////////
  // return (
  //   <Router>
  //     <Routes>
  //       <Route element={<SwapPage/>} path="/" />
  //     </Routes>
  //   </Router>
  // );
}

export default App;
