import React from 'react';

const ThemeSelection = ({ themes, selectedThemes, setSelectedThemes, startGame, feedbackMessage, feedbackColor }) => {
    const handleThemeChange = (event) => {
        const { name, checked } = event.target;
        setSelectedThemes(prevThemes => checked
            ? [...prevThemes, name]
            : prevThemes.filter(theme => theme !== name));
    };

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
};

export default ThemeSelection;
