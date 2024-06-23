import React from 'react';
import {BrowserRouter as Router, Route, Link, Routes, NavLink} from 'react-router-dom';
import DictionaryList from './DictionaryList';
import FlashcardSession from './FlashcardSession';
import '../styles/NavBar.css';

const App = () => {
    return (
        <Router>
            <div>
                <div className="navbar">
                    <NavLink
                        to="/flashcards"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Dictionary
                    </NavLink>
                    <NavLink
                        to="/flashcard-session"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Flashcards
                    </NavLink>
                </div>
                <Routes>
                    <Route path="/flashcards" element={<DictionaryList />} />
                    <Route path="/flashcard-session" element={<FlashcardSession />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
