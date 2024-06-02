import React, { useState, useEffect } from 'react';
import { getAllFlashcards } from '../services/FlashcardService';
import '../styles/FlashcardSession.css';

const FlashcardSession = () => {
    const [themes, setThemes] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [flashcards, setFlashcards] = useState([]);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isFrenchToEnglish, setIsFrenchToEnglish] = useState(true);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');

    useEffect(() => {
        getAllFlashcards().then(response => {
            const allFlashcards = response.data;
            const uniqueThemes = [...new Set(allFlashcards.map(fc => fc.theme))];
            setThemes(uniqueThemes);
            setFlashcards(allFlashcards);
        });
    }, []);

    useEffect(() => {
        if (isGameStarted && flashcards.length > 0 && currentFlashcardIndex < flashcards.length) {
            playPronunciation();
        }
    }, [isGameStarted, currentFlashcardIndex, flashcards]);

    const handleThemeChange = (event) => {
        const { name, checked } = event.target;
        setSelectedThemes(prevThemes => checked
            ? [...prevThemes, name]
            : prevThemes.filter(theme => theme !== name));
    };

    const startGame = () => {
        setIsGameStarted(true);
        setCurrentFlashcardIndex(0);
        setFeedbackMessage('');
        shuffleFlashcards();
    };

    const shuffleFlashcards = () => {
        const filteredFlashcards = flashcards.filter(fc => selectedThemes.includes(fc.theme));
        for (let i = filteredFlashcards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredFlashcards[i], filteredFlashcards[j]] = [filteredFlashcards[j], filteredFlashcards[i]];
        }
        setFlashcards(filteredFlashcards);
    };

    const normalize = (text) => {
        return text.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[-\s]/g, '') // Remove hyphens and spaces
            .toLowerCase();
    };

    const currentFlashcard = flashcards[currentFlashcardIndex];

    const checkTranslation = () => {
        if (!currentFlashcard) return;
        const correctAnswers = isFrenchToEnglish ? currentFlashcard.english.split(',').map(normalize) : currentFlashcard.french.split(',').map(normalize);
        if (correctAnswers.includes(normalize(userAnswer))) {
            setFeedbackMessage('Correct!');
            setFeedbackColor('lightgreen');
            setCurrentFlashcardIndex(prevIndex => prevIndex + 1);
        } else {
            setFeedbackMessage('Incorrect. Try again.');
            setFeedbackColor('lightcoral');
        }
        setUserAnswer('');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            checkTranslation();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            flipLanguages();
        }
    };

    const flipLanguages = () => {
        setIsFrenchToEnglish(!isFrenchToEnglish);
    };

    const playPronunciation = () => {
        if (!currentFlashcard) return;
        const audio = new Audio(`data:audio/mp3;base64,${currentFlashcard.frenchPronunciation}`);
        audio.play();
    };

    if (!isGameStarted) {
        return (
            <div className="theme-selection">
                <h1>Select Themes</h1>
                <div className="themes">
                    {themes.map(theme => (
                        <label key={theme}>
                            <input
                                type="checkbox"
                                name={theme}
                                onChange={handleThemeChange}
                            />
                            {theme}
                        </label>
                    ))}
                </div>
                <button onClick={startGame}>Start</button>
            </div>
        );
    }

    if (!currentFlashcard) {
        return <div className="flashcard-game">No more flashcards available.</div>;
    }

    return (
        <div className="flashcard-game">
            <h1>Flashcard Game</h1>
            <div>
                <p>{currentFlashcardIndex + 1}</p>
                <p>{isFrenchToEnglish ? currentFlashcard.french : currentFlashcard.english}</p>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter translation..."
                />
                <button onClick={checkTranslation}>Submit</button>
                <button onClick={flipLanguages}>Flip</button>
                <button onClick={playPronunciation}>Play</button>
                {feedbackMessage && (
                    <p style={{ color: feedbackColor }}>{feedbackMessage}</p>
                )}
            </div>
            <button onClick={() => setIsGameStarted(false)}>Back</button>
        </div>
    );
};

export default FlashcardSession;
