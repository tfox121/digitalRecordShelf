import React from 'react';
import { Segment, Button, Icon } from 'semantic-ui-react';

const SpotifyAuthButton = (props) => {
  const { token } = props;
  const redirect = process.env.REACT_APP_REDIRECT_URL;
  const url = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_ID}&response_type=token&redirect_uri=${redirect}&scope=streaming%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20user-read-email%20user-read-private`;

  if (token) {
    return null;
  }

  return (
    <Segment basic textAlign="center">
      <Button as="a" href={url} color="green">
        <Icon name="spotify" />
        Connect to Spotify
      </Button>
    </Segment>
  );
};

export default SpotifyAuthButton;
