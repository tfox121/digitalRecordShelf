import React, { useState } from 'react';
import { Menu, Divider, Message } from 'semantic-ui-react';

import AlbumArtView from './AlbumArtView';
import AlbumListView from './AlbumListView';

const ModeSelector = (props) => {
  const {
    albums, albumSelect, filteredNum, extendedArt, loading, token, errMsg,
  } = props;
  const [activeItem, setActiveItem] = useState('art');

  if (loading || !albums[0] || !albums[0].tracks) {
    return null;
  }

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const errorMessageSpotifyRender = (err) => {
    if (err) {
      return (
        <Message negative>
          <Message.Header>Oops...</Message.Header>
          <p>{err}</p>
        </Message>
      );
    }
    return null;
  };

  return (
    <div>
      <Divider />
      <Menu inverted secondary attached="top" widths="2" tabular>
        <Menu.Item
          name="art"
          active={activeItem === 'art'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name="list"
          active={activeItem === 'list'}
          onClick={handleItemClick}
        />
      </Menu>
      {errorMessageSpotifyRender(errMsg)}
      <div style={{ display: `${activeItem === 'art' ? 'block' : 'none'}` }}>
        <AlbumArtView albums={albums} albumSelect={albumSelect} extendedArt={extendedArt} token={token} />
      </div>
      <div style={{ display: `${activeItem === 'list' ? 'block' : 'none'}` }}>
        <AlbumListView albums={albums} albumSelect={albumSelect} filteredNum={filteredNum} token={token} />
      </div>
    </div>
  );
};

export default ModeSelector;
