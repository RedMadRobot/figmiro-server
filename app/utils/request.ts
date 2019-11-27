import axios from 'axios';
import {API_BASE} from 'config';

export const request = axios.create({
  baseURL: API_BASE
});
