import React, { useState, useEffect } from 'react';
import { getDistinctThemes, getFlashcardsByTheme } from '../services/FlashcardService';
import ThemeSelection from './ThemeSelection';
import FlashcardGame from './FlashcardGame';
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

    if (!isGameStarted) {
        return (
            <ThemeSelection
                themes={themes}
                selectedThemes={selectedThemes}
                setSelectedThemes={setSelectedThemes}
                startGame={startGame}
                feedbackMessage={feedbackMessage}
                feedbackColor={feedbackColor}
            />
        );
    }

    return (
        <FlashcardGame
            flashcards={flashcards}
            currentFlashcardIndex={currentFlashcardIndex}
            setCurrentFlashcardIndex={setCurrentFlashcardIndex}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            isFrenchToEnglish={isFrenchToEnglish}
            setIsFrenchToEnglish={setIsFrenchToEnglish}
            feedbackMessage={feedbackMessage}
            feedbackColor={feedbackColor}
            setFeedbackMessage={setFeedbackMessage}
            setFeedbackColor={setFeedbackColor}
            setIsGameStarted={setIsGameStarted}
        />
    );
};

export default FlashcardSession;
