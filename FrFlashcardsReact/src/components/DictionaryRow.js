import React from 'react';
import { getPronunciation } from '../services/FlashcardService';

const DictionaryRow = ({ flashcard }) => {
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
        <tr>
            <td>{flashcard.english}</td>
            <td>{flashcard.french}</td>
            <td>{flashcard.theme}</td>
            <td><button onClick={() => playPronunciation(flashcard.id)}>Play</button></td>
            <td>{flashcard.gender}</td>
        </tr>
    );
};

export default DictionaryRow;
