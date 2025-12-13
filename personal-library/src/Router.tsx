import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Books from './pages/Books/Books';
import Games from './pages/Games/Games';
import Vinyls from './pages/Vinyls/Vinyls';
import BookDetails from './pages/Books/BookDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/games" element={<Games />} />
          <Route path="/vinyls" element={<Vinyls />} />
          <Route path="/books/:id" element={<BookDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
