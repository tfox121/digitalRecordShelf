/* eslint-disable camelcase */
export const getSpotifyPlayingState = async (axiosSpotify, token) => {
  try {
    const response = await axiosSpotify.get('/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        market: 'from_token',
      },
    });
    // eslint-disable-next-line camelcase
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const spotifyFindAlbumUri = async (axiosSpotify, albumData, token) => {
  const response = await axiosSpotify.get(`/search?q=album:${encodeURI(albumData[0])}%20artist:${encodeURI(albumData[1])}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      type: 'album',
      limit: 1,
    },
  });
  return response.data.albums.items[0].uri;
};

export const changeSpotifyMusic = async (axios, uri, token, deviceId) => {
  try {
    const response = await axios({
      method: 'put',
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: { Authorization: `Bearer ${token}` },
      data: { context_uri: uri },
      params: {
        device_id: deviceId,
      },
    });
    console.log(response);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const initiateSpotifyWebPlayback = (token, deviceIdHook) => {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new window.Spotify.Player({
      name: 'Record Shelf Rediscovery',
      getOAuthToken: (cb) => {
        cb(token);
      },
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('authentication_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('account_error', ({ message }) => {
      console.error(message);
    });
    player.addListener('playback_error', ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener('player_state_changed', (state) => {
      console.log(state);
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      deviceIdHook(device_id);
      console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      deviceIdHook('');
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
  };
  const body = document.getElementsByTagName('body')[0];
  if (body) {
    const js = document.createElement('script');

    js.src = 'https://sdk.scdn.co/spotify-player.js';

    body.appendChild(js);
  }
};
