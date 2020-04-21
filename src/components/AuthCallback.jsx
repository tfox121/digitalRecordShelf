import React from 'react';
import { useLocation } from 'react-router-dom';

import { Button, Header } from 'semantic-ui-react';
import lastfm from '../api/lastfm';

const useQuery = () => new URLSearchParams(useLocation().search);

const getSession = async (token) => {
  const response = await lastfm.post('/lastfm', { token });
  console.log(response.data);
};

const AuthCallback = () => {
  const query = useQuery();
  const token = query.get('token');
  console.log(token);

  const handleClick = () => {
    getSession(token);
  };

  return (
    <div>
      <Header>CALLBACK</Header>
      <p>
        Token =
        {' '}
        {token}
      </p>
      <Button onClick={handleClick}>GET SESSION</Button>
    </div>
  );
};

export default AuthCallback;
