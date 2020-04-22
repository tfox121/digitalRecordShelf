import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Input, Segment, Header, Form, Loader, Dimmer, Icon, Image, Button,
} from 'semantic-ui-react';

import spotify from '../api/spotify';
// import staticData from '../data/staticData';
import getRandomSubset from '../utils/getRandomSubset';

import ModeSelector from './ModeSelector';
import Player from './Player';

const TWELVE_MONTH_TOP_ALBUMS_FILTER = 100;
const SIX_MONTH_TOP_ARTIST_FILTER = 75;
const OVERALL_TOP_ALBUMS_NUM = 275;

const Main = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [lastfmUser, setLastfmUser] = useState('foxtrapper121');
  const [spotifyToken, setSpotifyToken] = useState('');
  const [overallAlbums, setOverallAlbums] = useState([]);
  const [lastYearAlbums, setLastYearAlbums] = useState([]);
  const [lastSixMonthsArtists, setLastSixMonthsArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [randomAlbums, setRandomAlbums] = useState([]);
  const [isPlaying, setIsPlaying] = useState('Paused');
  const [progressMs, setProgressMs] = useState(0);
  const [mediaItem, setMediaItem] = useState({
    album: { images: [{ url: '' }] },
    name: '',
    artists: [{ name: '' }],
    duration_ms: 0,
  });

  useEffect(() => {
    if (location.hash) {
      const accessToken = location.hash.slice(1).split('&')[0].split('=')[1];
      setSpotifyToken(accessToken);
    }
  }, [location]);

  useEffect(() => {
    const getCurrentlyPlaying = async () => {
      const response = await spotify.get('/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${spotifyToken}` },
        params: {
          market: 'from_token',
        },
      });
      // eslint-disable-next-line camelcase
      const { item, is_playing, progress_ms } = response.data;
      setMediaItem(item);
      setIsPlaying(is_playing);
      setProgressMs(progress_ms);
    };

    let checkInterval;
    if (spotifyToken) {
      checkInterval = setInterval(getCurrentlyPlaying, 1000);
    }
    if (!spotifyToken && checkInterval) {
      clearInterval(checkInterval);
    }
  }, [spotifyToken]);

  useEffect(() => {
    if (!filteredAlbums.length && (lastYearAlbums && lastSixMonthsArtists)) {
      let albumfiltered = 0;
      const albums = overallAlbums.filter((album) => {
        if (!lastYearAlbums.find(({ name }) => name === album.name)
          && !lastSixMonthsArtists.find(({ name }) => name === album.artist.name)
          && (!album.tracks || album.tracks.length > 4)) {
          return true;
        }

        albumfiltered += 1;

        return false;
      });
      console.log(albumfiltered);
      setFilteredAlbums(albums);
      console.log('FILTERED', albums);
    }
  }, [filteredAlbums.length, lastSixMonthsArtists, lastYearAlbums, overallAlbums]);

  useEffect(() => {
    if (filteredAlbums.length) {
      loading === true && setLoading(false);
      setRandomAlbums(getRandomSubset(filteredAlbums, 15));
    }
  }, [filteredAlbums, loading]);

  const getAlbumTracks = async (album) => {
    const reqURL = 'https://ws.audioscrobbler.com/2.0/';

    const params = {
      method: 'album.getInfo',
      artist: album.artist.name,
      album: album.name,
      autocorrect: 1,
      api_key: process.env.REACT_APP_LASTFM_API,
      format: 'json',
    };
    try {
      let response = await axios.get(reqURL, {
        params,
      });

      if (!response.data.album) {
        response = await axios.get(reqURL, {
          params: {
            method: 'album.search',
            limit: '1',
            album: album.name,
            api_key: process.env.REACT_APP_LASTFM_API,
            format: 'json',
          },
        });
        if (response.data.results.albummatches.album[0].name) {
          const newAlbum = response.data.results.albummatches.album[0];
          const newParams = {
            ...params,
            artist: newAlbum.artist,
            album: newAlbum.name,
          };
          response = await axios.get(reqURL, {
            params: newParams,
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

  const userTopMusic = async (method, user, period, limit, update) => {
    const reqURL = 'https://ws.audioscrobbler.com/2.0/';

    const params = {
      method,
      user,
      limit,
      period,
      api_key: process.env.REACT_APP_LASTFM_API,
      format: 'json',
    };
    try {
      const response = await axios.get(reqURL, {
        params,
      });
      if (method === 'user.getTopAlbums') {
        if (period === 'overall') {
          const albumWithTracks = await Promise.all(
            response.data.topalbums.album.map(async (album) => getAlbumTracks(album)),
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
          update(albumWithTracks);
        }
        update(response.data.topalbums.album);
      } else {
        update(response.data.topartists.artist);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await userTopMusic('user.getTopAlbums', lastfmUser, '12month', TWELVE_MONTH_TOP_ALBUMS_FILTER, setLastYearAlbums);
    await userTopMusic('user.getTopArtists', lastfmUser, '6month', SIX_MONTH_TOP_ARTIST_FILTER, setLastSixMonthsArtists);
    await userTopMusic('user.getTopAlbums', lastfmUser, 'overall', OVERALL_TOP_ALBUMS_NUM, setOverallAlbums);
    // setFilteredAlbums(staticData);
    setLoading(false);
  };


  const spotifyFindAlbumUri = async (albumData) => {
    try {
      const response = await spotify.get(`/search?q=album:${encodeURI(albumData[0])}%20artist:${encodeURI(albumData[1])}`, {
        headers: { Authorization: `Bearer ${spotifyToken}` },
        params: {
          type: 'album',
          limit: 1,
        },
      });
      return response.data.albums.items[0].uri;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const changeTrackHandler = async (uri) => {
    try {
      const response = await axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: { Authorization: `Bearer ${spotifyToken}` },
        data: { context_uri: uri },
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const albumSelect = async (albumData) => {
    const uri = await spotifyFindAlbumUri(albumData);
    console.log(uri);
    changeTrackHandler(uri);
  };

  const albumsRender = () => {
    if (!loading) {
      return (
        <ModeSelector albums={randomAlbums} albumSelect={albumSelect} />
      );
    }
    return (
      <Segment>
        <Dimmer active>
          <Loader indeterminate>Retrieving Albums</Loader>
        </Dimmer>
        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
      </Segment>
    );
  };


  const spotifyStuff = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_ID}&response_type=token&redirect_uri=http://localhost:3000&scope=streaming%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing`;

    return (
      <>
        {
          !spotifyToken && (
            <Segment basic textAlign="center">
              <Button as="a" href={url} color="green">
                <Icon name="spotify" />
                Connect to Spotify
              </Button>
            </Segment>
          )
        }
        {
          spotifyToken && (
            <Player
              item={mediaItem}
              isPlaying={isPlaying}
              progressMs={progressMs}
            />
          )
        }
      </>
    );
  };

  return (
    <>
      <Header as="h1" href="/" content="Record Shelf Rediscovery" />
      <Form action="submit" onSubmit={handleSubmit}>
        <Form.Field>
          <Input
            inverted
            action={{
              color: 'teal',
              labelPosition: 'right',
              icon: 'lastfm',
              content: 'Search',
            }}
            placeholder="Your Last.fm Username..."
            size="large"
            value={lastfmUser}
            onChange={(e) => setLastfmUser(e.target.value)}
          />
        </Form.Field>
      </Form>
      {spotifyStuff()}
      {albumsRender()}
    </>
  );
};

export default Main;
