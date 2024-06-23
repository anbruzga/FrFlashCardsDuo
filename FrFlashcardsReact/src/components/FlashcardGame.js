import React from 'react';
import { getPronunciation } from '../services/FlashcardService';

const FlashcardGame = ({
                           flashcards,
                           currentFlashcardIndex,
                           setCurrentFlashcardIndex,
                           userAnswer,
                           setUserAnswer,
                           isFrenchToEnglish,
                           setIsFrenchToEnglish,
                           feedbackMessage,
                           feedbackColor,
                           setFeedbackMessage,
                           setFeedbackColor,
                           setIsGameStarted
                       }) => {
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
            <button onClick={() => setIsGameStarted(false)}>Back</button> {}
        </div>
    );
};

export default FlashcardGame;
