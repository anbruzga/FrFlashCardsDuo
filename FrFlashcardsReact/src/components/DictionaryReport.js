import React from 'react';
import DictionaryRow from './DictionaryRow';

const DictionaryReport = ({ flashcards }) => {
    return (
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
            {flashcards.map(flashcard => (
                <DictionaryRow key={flashcard.id} flashcard={flashcard} />
            ))}
            </tbody>
        </table>
    );
};

export default DictionaryReport;
