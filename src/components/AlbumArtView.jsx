import React, { useRef, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {
  Image, Header, Segment, Container,
} from 'semantic-ui-react';

import './AlbumArtView.css';

const AlbumArtView = (props) => {
  const { albums } = props;
  const bigCarouselRef = useRef(null);
  const smallCarouselRef = useRef(null);


  const handleOnDragStart = (e) => e.preventDefault();

  const handleSlideChange = (e) => {
    bigCarouselRef.current.slideTo(e.item);
    smallCarouselRef.current.slideTo(e.item);
  };

  const imagesPlusText = albums.map((album) => (
    <Segment basic inverted textAlign="center">
      <Image onDragStart={handleOnDragStart} autoHeight="true" src={album.image[3]['#text']} />
      <Header as="h5">
        {album.artist.name}
        {' '}
        -
        {' '}
        {album.name}
      </Header>
    </Segment>
  ));

  const images = albums.map((album) => (
    <Container>
      <Image onDragStart={handleOnDragStart} autoHeight="true" src={album.image[3]['#text']} />
    </Container>
  ));
  return (
    <>
      <AliceCarousel
        mouseTrackingEnabled
        onSlideChanged={handleSlideChange}
        items={imagesPlusText}
        dotsDisabled="true"
        buttonsDisabled="true"
        ref={bigCarouselRef}
      />
      <AliceCarousel
        mouseTrackingEnabled
        autoHeight="true"
        onSlideChanged={handleSlideChange}
        items={images}
        ref={smallCarouselRef}
        responsive={{
          0: {
            items: 3,
          },
          767: {
            items: 4,
          },
          1023: {
            items: 5,
          },
        }}
      />
    </>
  );
};

export default AlbumArtView;
