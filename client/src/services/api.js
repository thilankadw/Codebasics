import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/learning-plan', 
  headers: {
    'Content-Type': 'application/json'
  }
});