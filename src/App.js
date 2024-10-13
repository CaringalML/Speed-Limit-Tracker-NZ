// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SpeedLimit from './components/SpeedLimit';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/speed-limit-tracker-nz" element={<SpeedLimit />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
