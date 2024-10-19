import axios from 'axios';
const baseURL = "http://localhost:8145";

export const getData = async (url) => {
    try {
        const response = await axios.get(`${baseURL}/${url}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const postData = async (url, data) => {
    try {
        const response = await axios.post(`${baseURL}/${url}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const putData = async (url, updatedData) => {
    try {
        const response = await axios.put(`${baseURL}/${url}`, updatedData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const deleteData = async (url, data = {}) => {
    try {
        const response = await axios.delete(`${baseURL}/${url}`, { data });
        return response.data;
    } catch (error) {
        throw error;
    }
};
