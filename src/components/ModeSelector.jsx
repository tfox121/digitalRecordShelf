import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';

import AlbumArtView from './AlbumArtView';
import AlbumListView from './AlbumListView';

const ModeSelector = (props) => {
  const { albums, albumSelect } = props;
  const [activeItem, setActiveItem] = useState('list');

  if (!albums[0] || !albums[0].tracks) {
    return null;
  }

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <div>
      <Menu inverted attached="top" widths="2" tabular>
        <Menu.Item
          name="list"
          active={activeItem === 'list'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name="art"
          active={activeItem === 'art'}
          onClick={handleItemClick}
        />
      </Menu>

      <div style={{ display: `${activeItem === 'list' ? 'block' : 'none'}` }}>
        <AlbumListView albums={albums} albumSelect={albumSelect} />
      </div>
      <div style={{ display: `${activeItem === 'art' ? 'block' : 'none'}` }}>
        <AlbumArtView albums={albums} albumSelect={albumSelect} />
      </div>
    </div>
  );
};

export default ModeSelector;
