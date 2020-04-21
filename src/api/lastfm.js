import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000/auth'
  : 'https://subreddit-game-api.herokuapp.com/games';

export default axios.create({ baseURL });