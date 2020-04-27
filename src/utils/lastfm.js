export const getAlbumTracks = async (axiosLastfm, album) => {
  const baseParams = {
    api_key: process.env.REACT_APP_LASTFM_API,
    format: 'json',
  };

  const params = {
    method: 'album.getInfo',
    artist: album.artist.name,
    album: album.name,
    autocorrect: 1,
    ...baseParams,
  };

  try {
    let response = await axiosLastfm.get('/', {
      params,
    });

    if (!response.data.album) {
      response = await axiosLastfm.get('/', {
        params: {
          method: 'album.search',
          limit: '1',
          album: album.name,
          ...baseParams,
        },
      });
      if (response.data.results.albummatches.album[0].name) {
        const newAlbum = response.data.results.albummatches.album[0];
        response = await axiosLastfm.get('/', {
          params: {
            ...params,
            artist: newAlbum.artist,
            album: newAlbum.name,
          },
        });
      }
    }
    if (response.data.album) {
      const tracks = response.data.album.tracks.track;
      const albumWithTracks = { ...album, tracks, ratio: album.playcount / tracks.length };
      return albumWithTracks;
    }
    console.log('MISSING', album.name, album.artist.name);
    return album;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getUserTopMusic = async (
  axiosLastfm, method, user, period, limit, updateHook, errorHook,
) => {
  try {
    const response = await axiosLastfm.get('/', {
      params: {
        method,
        user,
        limit,
        period,
        api_key: process.env.REACT_APP_LASTFM_API,
        format: 'json',
      },
    });
    if (method === 'user.getTopAlbums') {
      if (period === 'overall') {
        const albumWithTracks = await Promise.all(
          response.data.topalbums.album.map(async (album) => getAlbumTracks(axiosLastfm, album)),
        );
        albumWithTracks.sort((a, b) => {
          if (a.ratio > b.ratio) {
            return -1;
          }
          if (a.ratio < b.ratio) {
            return 1;
          }
          return 0;
        });
        updateHook(albumWithTracks);
      }
      updateHook(response.data.topalbums.album);
    } else {
      updateHook(response.data.topartists.artist);
    }
    errorHook('');
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 404) {
      errorHook('That username could not be found or the.');
    } else {
      errorHook('There was a problem with the request.');
    }
  }
};
