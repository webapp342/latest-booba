import axios from 'axios';

const API_KEY = '3c03ad8bfad6d290b4d430cf6c733431'; // API-Football API anahtarınızı buraya ekleyin
const API_URL = 'https://v3.football.api-sports.io';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
});
