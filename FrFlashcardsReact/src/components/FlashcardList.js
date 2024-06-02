import React, { useState, useEffect } from 'react';
import { getAllFlashcards } from '../services/FlashcardService';
import '../styles/FlashcardList.css';

const FlashcardList = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredFlashcards, setFilteredFlashcards] = useState([]);
    const [searchOptions, setSearchOptions] = useState({
        english: true,
        french: true,
        theme: true
    });

    useEffect(() => {
        getAllFlashcards().then(response => {
            console.log(response.data); // Log to verify pronunciation data
            setFlashcards(response.data);
            setFilteredFlashcards(response.data);
        });
    }, []);

    useEffect(() => {
        const normalizedFilter = normalize(searchText.toLowerCase());
        setFilteredFlashcards(flashcards.filter(flashcard => {
            return (searchOptions.english && normalize(flashcard.english).toLowerCase().includes(normalizedFilter)) ||
                (searchOptions.french && normalize(flashcard.french).toLowerCase().includes(normalizedFilter)) ||
                (searchOptions.theme && normalize(flashcard.theme).toLowerCase().includes(normalizedFilter));
        }));
    }, [searchText, flashcards, searchOptions]);

    const handleCheckboxChange = (event) => {
        setSearchOptions({
            ...searchOptions,
            [event.target.name]: event.target.checked
        });
    };

    const normalize = (text) => {
        if (!text) return '';
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
    };

    const playPronunciation = (pronunciation) => {
        if (!pronunciation) {
            console.log("No pronunciation data available.");
            return;
        }
        try {
            const audio = new Audio(`data:audio/mp3;base64,${pronunciation}`);
            audio.play();
        } catch (error) {
            console.error("Error playing pronunciation audio:", error);
        }
    };

    return (
        <div className="flashcard-container">
            <h1>Flashcards Report</h1>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        name="english"
                        checked={searchOptions.english}
                        onChange={handleCheckboxChange}
                    /> English
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="french"
                        checked={searchOptions.french}
                        onChange={handleCheckboxChange}
                    /> French
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="theme"
                        checked={searchOptions.theme}
                        onChange={handleCheckboxChange}
                    /> Theme
                </label>
            </div>
            <table className="flashcard-table">
                <thead>
                <tr>
                    <th>English</th>
                    <th>French</th>
                    <th>Theme</th>
                    <th>Pronunciation</th>
                    <th>Gender</th>
                </tr>
                </thead>
                <tbody>
                {filteredFlashcards.map(flashcard => (
                    <tr key={flashcard.id}>
                        <td>{flashcard.english}</td>
                        <td>{flashcard.french}</td>
                        <td>{flashcard.theme}</td>
                        <td><button onClick={() => playPronunciation(flashcard.frenchPronunciation)}>Play</button></td>
                        <td>{flashcard.gender}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FlashcardList;
