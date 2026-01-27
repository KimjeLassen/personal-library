import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Books from './pages/Books/Books';
import Games from './pages/Games/Games';
import Vinyls from './pages/Vinyls/Vinyls';
import BookDetails from './pages/Books/BookDetails';
import CreateBook from './pages/Books/CreateBook';
import CreateCategory from './pages/CreateCategory';
import CreateGame from './pages/Games/CreateGame';
import GameDetails from './pages/Games/GameDetails';

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
          <Route path ="/books/create" element={<CreateBook/>} />
          <Route path="/categories/:type/create" element={<CreateCategory />} />
          <Route path="/games/create" element={<CreateGame />} />
          <Route path="/games/edit/:id" element={<CreateGame />} />
          <Route path="/games/:id" element={<GameDetails/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
