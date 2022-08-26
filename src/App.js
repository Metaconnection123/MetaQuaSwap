import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SwapPage from './components/Swap';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<SwapPage/>} path="/" />
      </Routes>
    </Router>
  );
}

export default App;
