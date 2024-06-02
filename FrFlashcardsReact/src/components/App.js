import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import FlashcardList from './FlashcardList';
import FlashcardSession from './FlashcardSession';
import '../styles/NavBar.css';

const App = () => {
    return (
        <Router>
            <div>
                <div className="navbar">
                    <Link to="/flashcards" className={({ isActive }) => (isActive ? "active" : "")}>Flashcards</Link>
                    <Link to="/flashcard-session" className={({ isActive }) => (isActive ? "active" : "")}>Flashcard Session</Link>
                </div>
                <Routes>
                    <Route path="/flashcards" element={<FlashcardList />} />
                    <Route path="/flashcard-session" element={<FlashcardSession />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
