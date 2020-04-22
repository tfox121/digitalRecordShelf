import React from 'react';
import { Segment } from 'semantic-ui-react';
import './Player.css';

const Player = (props) => {
  const { item, isPlaying, progressMs } = props;

  if (!item || !item.album) {
    return null;
  }
  const backgroundStyles = {
    backgroundImage: `url(${item.album.images[0].url})`,
  };

  const progressBarStyles = {
    width: `${progressMs * 100 / item.duration_ms}%`,
  };

  return (
    <Segment basic inverted textAlign="center" className="App">
      <div className="main-wrapper">
        {/* <div className="now-playing__img">
          <img src={item.album.images[0].url} alt="album art" />
        </div> */}
        <div className="now-playing__side">
          <div className="now-playing__name">{item.name}</div>
          <div className="now-playing__artist">
            {item.artists[0].name}
          </div>
          <div className="now-playing__status">
            {isPlaying ? 'Playing' : 'Paused'}
          </div>
          <div className="progress">
            <div
              className="progress__bar"
              style={progressBarStyles}
            />
          </div>
        </div>
        <div className="background" style={backgroundStyles} />
        {' '}
      </div>
    </Segment>
  );
};
export default Player;
