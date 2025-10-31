import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import ProductPage from './components/ProductPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminPage />} />
          <Route path="/product/:batch_id" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
