import axios from 'axios';

export default axios.create({
  baseURL: 'https://ws.audioscrobbler.com/2.0',
  params: {
    api_key: process.env.REACT_APP_LASTFM_API,
    format: 'json',
  },
});
