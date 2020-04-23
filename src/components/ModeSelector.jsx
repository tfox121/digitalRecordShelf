import React, { useState } from 'react';
import { Menu, Divider } from 'semantic-ui-react';

import AlbumArtView from './AlbumArtView';
import AlbumListView from './AlbumListView';

const ModeSelector = (props) => {
  const {
    albums, albumSelect, filteredNum, extendedArt, loading, token,
  } = props;
  const [activeItem, setActiveItem] = useState('art');

  if (loading || !albums[0] || !albums[0].tracks) {
    return null;
  }

  const handleItemClick = (e, { name }) => setActiveItem(name);

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
      <div style={{ display: `${activeItem === 'art' ? 'block' : 'none'}` }}>
        <AlbumArtView albums={albums} albumSelect={albumSelect} token={token} />
      </div>
      <div style={{ display: `${activeItem === 'list' ? 'block' : 'none'}` }}>
        <AlbumListView albums={albums} albumSelect={albumSelect} filteredNum={filteredNum} extendedArt={extendedArt} token={token} />
      </div>
    </div>
  );
};

export default ModeSelector;
