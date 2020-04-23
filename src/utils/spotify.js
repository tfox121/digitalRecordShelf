/* eslint-disable camelcase */
export const getSpotifyPlayingState = async (axiosSpotify, token) => {
  try {
    const response = await axiosSpotify.get('/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        market: 'from_token',
      },
    });
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

const getDeviceId = async (axiosSpotify, token) => {
  try {
    const response = await axiosSpotify.get('/me/player/devices', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.devices[0]) {
      return response.data.devices[0].id;
    }
    return null;
  } catch (err) {
    console.log('No devices found');
    return null;
  }
};

export const changeSpotifyMusic = async (axios, axiosSpotify, uri, token) => {
  console.log('Setting music');
  const deviceId = await getDeviceId(axiosSpotify, token);
  if (!deviceId && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    const start = new Date().getTime();

    window.location.href = uri;

    const end = new Date().getTime();

    if (end - start < 1) {
      const id = uri.match(/\w*\d*\w+\d+/);
      const url = `https://open.spotify.com/album/${id}`;
      console.log('URL', url);
      window.open(url);
    }
  } else {
    try {
      console.log('Found device');

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
  }
};


export const initiateSpotifyWebPlayback = async (token) => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('Web playback not supported on mobile devices');
  } else {
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
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
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
  }
};
