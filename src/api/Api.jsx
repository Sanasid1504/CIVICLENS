import axios from 'axios';

const Apiclient=axios.create({
  baseURL: 'https://168.144.68.244.sslip.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Apiclient;