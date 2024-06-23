import React from 'react';

const DictionarySearchBox = ({ searchText, setSearchText, searchOptions, setSearchOptions }) => {
    const handleCheckboxChange = (event) => {
        setSearchOptions({
            ...searchOptions,
            [event.target.name]: event.target.checked
        });
    };

    return (
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
    );
};

export default DictionarySearchBox;
