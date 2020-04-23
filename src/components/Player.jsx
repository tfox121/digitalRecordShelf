import React, { useEffect, useState } from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import axios from 'axios';

import spotify from '../api/spotify';
import millisecondsToMinsAndSecs from '../utils/millisecondsToMinsAndSecs';
import { getSpotifyPlayingState } from '../utils/spotify';
import history from '../history';
import './Player.css';

const Player = (props) => {
  const [isPlaying, setIsPlaying] = useState('Paused');
  const [progressMs, setProgressMs] = useState(0);
  const [mediaItem, setMediaitem] = useState({
    album: { images: [{ url: '' }] },
    name: '',
    artists: [{ name: '' }],
    duration_ms: 0,
  });

  const { spotifyToken, setSpotifyToken } = props;

  useEffect(() => {
    const getCurrentlyPlaying = async () => {
      try {
        const response = await getSpotifyPlayingState(spotify, spotifyToken);
        // eslint-disable-next-line camelcase
        const { item, is_playing, progress_ms } = response.data;
        setMediaitem(item);
        setIsPlaying(is_playing);
        setProgressMs(progress_ms);
      } catch (err) {
        console.error(err);
        setSpotifyToken('');
        history.push('/');
      }
    };

    let checkInterval;
    if (spotifyToken) {
      checkInterval = setInterval(getCurrentlyPlaying, 1000);
    }
    if (!spotifyToken && checkInterval) {
      clearInterval(checkInterval);
    }
  }, [spotifyToken]);

  if (!mediaItem || !mediaItem.name) {
    return null;
  }
  const backgroundStyles = {
    backgroundImage: `url(${mediaItem.album.images[0].url})`,
  };

  const progressBarStyles = {
    width: `${progressMs * 100 / mediaItem.duration_ms}%`,
  };

  const skipBackward = () => {
    axios({
      method: 'post',
      url: 'https://api.spotify.com/v1/me/player/previous',
      headers: { Authorization: `Bearer ${spotifyToken}` },
    });
  };

  const playPause = () => {
    let action = 'play';
    if (isPlaying === true) {
      action = 'pause';
    }
    axios({
      method: 'put',
      url: `https://api.spotify.com/v1/me/player/${action}`,
      headers: { Authorization: `Bearer ${spotifyToken}` },
    });
  };

  const skipForward = () => {
    axios({
      method: 'post',
      url: 'https://api.spotify.com/v1/me/player/next',
      headers: { Authorization: `Bearer ${spotifyToken}` },
    });
  };

  const playOrPauseIcon = (playing) => {
    if (playing === true) {
      return (
        <Icon name="pause circle outline" size="big" onClick={playPause} />
      );
    }
    return (
      <Icon name="play circle outline" size="big" onClick={playPause} />
    );
  };


  return (
    <Segment basic inverted textAlign="center" className="App">
      <div className="main-wrapper">
        <div className="now-playing__side">
          <div className="now-playing__name">{mediaItem.name}</div>
          <div className="now-playing__artist">
            {mediaItem.artists[0].name}
          </div>
          <div className="progress-details">
            <div>{millisecondsToMinsAndSecs(progressMs)}</div>
            <div className="progress">
              <div
                className="progress__bar"
                style={progressBarStyles}
              />
            </div>
            <div>{millisecondsToMinsAndSecs(mediaItem.duration_ms)}</div>
          </div>
        </div>
        <div className="controls">
          <Icon name="step backward" size="large" onClick={skipBackward} />
          {playOrPauseIcon(isPlaying)}
          <Icon name="step forward" size="large" onClick={skipForward} />
        </div>
        <div className="background" style={backgroundStyles} />
        {' '}
      </div>
    </Segment>
  );
};
export default Player;
