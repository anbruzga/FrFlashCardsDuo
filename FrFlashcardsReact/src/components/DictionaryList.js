import React, { useState, useEffect } from 'react';
import { getAllFlashcards } from '../services/FlashcardService';
import DictionarySearchBox from './DictionarySearchBox';
import DictionaryReport from './DictionaryReport';
import '../styles/FlashcardList.css';

const DictionaryList = () => {
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

    const normalize = (text) => {
        if (!text) return '';
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
    };

    return (
        <div className="flashcard-container">
            <h1>Dictionary Report</h1>
            <DictionarySearchBox
                searchText={searchText}
                setSearchText={setSearchText}
                searchOptions={searchOptions}
                setSearchOptions={setSearchOptions}
            />
            <DictionaryReport flashcards={filteredFlashcards} />
        </div>
    );
};

export default DictionaryList;
