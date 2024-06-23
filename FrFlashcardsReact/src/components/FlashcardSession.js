import React, { useState, useEffect } from 'react';
import { getDistinctThemes, getFlashcardsByTheme, getPronunciation } from '../services/FlashcardService';
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
        const fetchThemes = async () => {
            try {
                const response = await getDistinctThemes();
                setThemes(response.data);
            } catch (error) {
                console.error('Failed to fetch themes:', error);
                setFeedbackMessage('Failed to load themes. Please try again later.');
                setFeedbackColor('red');
            }
        };

        fetchThemes();
    }, []);

    const startGame = async () => {
        if (selectedThemes.length > 0) {
            try {
                const responses = await Promise.all(selectedThemes.map(theme => getFlashcardsByTheme(theme)));
                const combinedFlashcards = responses.flatMap(response => response.data);
                shuffleFlashcards(combinedFlashcards);
                setIsGameStarted(true);
                setCurrentFlashcardIndex(0);
                setFeedbackMessage('');
            } catch (error) {
                console.error('Failed to fetch flashcards:', error);
                setFeedbackMessage('Failed to load flashcards. Please try again later.');
                setFeedbackColor('red');
            }
        }
    };

    const shuffleFlashcards = (flashcards) => {
        for (let i = flashcards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
        }
        setFlashcards(flashcards);
    };

    const handleThemeChange = (event) => {
        const { name, checked } = event.target;
        setSelectedThemes(prevThemes => checked
            ? [...prevThemes, name]
            : prevThemes.filter(theme => theme !== name));
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
        getPronunciation(currentFlashcard.id).then(response => {
            const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        }).catch(error => {
            console.error("Error playing pronunciation:", error);
        });
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
                {feedbackMessage && (
                    <p style={{ color: feedbackColor }}>{feedbackMessage}</p>
                )}
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
