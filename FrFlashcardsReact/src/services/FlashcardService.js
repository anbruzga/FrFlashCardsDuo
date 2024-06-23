import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
console.log('API_URL:', API_URL);  // Add this line

export const getAllFlashcards = () => {
    return axios.get(API_URL);
};

export const getFlashcardById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const getFlashcardsByTheme = (theme) => {
    return axios.get(`${API_URL}/theme`, {
        params: {
            theme: theme
        }
    });
};

export const getDistinctThemes = () => {
    return axios.get(`${API_URL}/themes`);
};

export const getPronunciation = (id) => {
    return axios.get(`${API_URL}/${id}/pronunciation`, { responseType: 'arraybuffer' });
};
