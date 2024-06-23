import React, { useState, useEffect } from 'react';
import { getAllFlashcards, getPronunciation } from '../services/FlashcardService';
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
            setFlashcards(response.data);
            setFilteredFlashcards(response.data);
        });
    }, []);

    useEffect(() => {
        const normalizedFilter = normalize(searchText.toLowerCase());
        setFilteredFlashcards(flashcards.filter(flashcard => {
            const normalizedEnglish = normalize(flashcard.english).toLowerCase();
            const normalizedFrench = normalize(flashcard.french).toLowerCase();
            const normalizedTheme = normalize(flashcard.theme).toLowerCase();
            return (searchOptions.english && normalizedEnglish.includes(normalizedFilter)) ||
                (searchOptions.french && normalizedFrench.includes(normalizedFilter)) ||
                (searchOptions.theme && normalizedTheme.includes(normalizedFilter));
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

    const playPronunciation = (id) => {
        getPronunciation(id).then(response => {
            const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        }).catch(error => {
            console.error("Error playing pronunciation audio:", error);
        });
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
                        <td><button onClick={() => playPronunciation(flashcard.id)}>Play</button></td>
                        <td>{flashcard.gender}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FlashcardList;
