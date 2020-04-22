import axios from 'axios';

const baseURL = 'https://api.spotify.com/v1';

const spotify = axios.create({
  baseURL,
});


export default spotify;
