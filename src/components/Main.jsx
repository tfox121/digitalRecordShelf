import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Icon, Input, Segment, Header, Form, Loader, Dimmer, Image,
} from 'semantic-ui-react';

import staticData from '../data/staticData';
import getRandomSubset from '../utils/getRandomSubset';

import ModeSelector from './ModeSelector';

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [lastfmUser, setLastfmUser] = useState('foxtrapper121');
  const [overallAlbums, setOverallAlbums] = useState([]);
  const [lastYearAlbums, setLastYearAlbums] = useState([]);
  const [lastSixMonthsArtists, setLastSixMonthsArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);

  useEffect(() => {
    if (!filteredAlbums.length && (lastYearAlbums && lastSixMonthsArtists)) {
      let albumfiltered = 0;
      console.log('PREFILTER', overallAlbums, filteredAlbums);
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
      console.log('ARTISTS', lastSixMonthsArtists);
    }
  }, [overallAlbums]);

  useEffect(() => {
    if (filteredAlbums.length) {
      loading === true && setLoading(false);
    }
  }, [filteredAlbums]);


  const getAlbumTracks = async (album) => {
    const reqURL = 'http://ws.audioscrobbler.com/2.0/';

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
    const reqURL = 'http://ws.audioscrobbler.com/2.0/';

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
    await userTopMusic('user.getTopAlbums', lastfmUser, '12month', 100, setLastYearAlbums);
    await userTopMusic('user.getTopArtists', lastfmUser, '6month', 75, setLastSixMonthsArtists);
    await userTopMusic('user.getTopAlbums', lastfmUser, 'overall', 275, setOverallAlbums);
    // setFilteredAlbums(staticData);
    setLoading(false);
  };

  const loaderRender = () => {
    if (!loading) {
      return (
        <ModeSelector albums={getRandomSubset(filteredAlbums, 15)} />
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


  return (
    <>
      <Header content="Digital Record Shelf" />
      <Form action="submit" onSubmit={handleSubmit}>
        <Form.Field>
          <Input inverted icon placeholder="Your Last.fm Username...">
            <input value={lastfmUser} onChange={(e) => setLastfmUser(e.target.value)} />
            <Icon name="search" />
          </Input>
        </Form.Field>
      </Form>
      {loaderRender()}
    </>
  );
};

export default Main;
