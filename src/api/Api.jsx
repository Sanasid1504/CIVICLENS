import axios from 'axios';

const Apiclient=axios.create({
  baseURL: 'https://civiclens-backend-j6i2.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Apiclient;