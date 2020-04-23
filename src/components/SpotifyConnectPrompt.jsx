import React from 'react';
import { Icon, Modal } from 'semantic-ui-react';
import SpotifyAuthButton from './SpotifyAuthButton';

const SpotifyConnectPrompt = ({ token, size, handleClick }) => {
  if (token) {
    return <Icon size={size} name="play circle outline" onClick={handleClick} />;
  }
  return (
    <Modal basic trigger={<Icon size={size} name="play circle outline" />} content={<SpotifyAuthButton />} />
  );
};

export default SpotifyConnectPrompt;
