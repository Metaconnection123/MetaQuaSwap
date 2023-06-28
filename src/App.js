import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SwapPage from "./components/Swap";
import NewSwapPage from "./components/NewSwap";
import { WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import {
  ethereumClient,
  projectId,
  wagmiConfig,
} from "./utils/WalletConnectModel";
function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Router>
          <Routes>
            <Route element={<SwapPage />} path="/" />
            <Route element={<NewSwapPage />} path="/newSwap" />
          </Routes>
        </Router>
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={{
          "--w3m-font-family": "Roboto, sans-serif",
          "--w3m-accent-color": "#07588A",
        }}
      />
    </>
  );
}

export default App;
