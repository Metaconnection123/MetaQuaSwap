import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Web3Modal } from '@web3modal/react'
import {chains, providers} from "@web3modal/ethereum";

const config = {
  theme: "dark",
  accentColor: "default",
  ethereum: {
    appName: 'eth_token_swap',
    chains: [chains.mainnet, chains.goerli, chains.polygon, chains.polygonMumbai],
    providers: [
      providers.walletConnectProvider({
        projectId: "f6b3b3cdad6af9ce4e840bae063879a1",
      }),
    ],
    autoConnect: true
  },
  projectId: 'f6b3b3cdad6af9ce4e840bae063879a1',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <App />
        <Web3Modal config={config} />
    </>

);