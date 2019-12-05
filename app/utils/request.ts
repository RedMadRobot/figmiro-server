import axios from 'axios';

export const request = axios.create({
  baseURL: 'https://miro.com/api/v1'
});
