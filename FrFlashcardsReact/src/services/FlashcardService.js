import axios from 'axios';

const API_URL = 'http://localhost:9090/api/flashcards'; // Ensure the correct URL
//const API_URL = 'http://192.168.1.141:9090/api/flashcards'; // Ensure the correct URL
//todo softcode above

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