import React, { useRef } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {
  Image, Header, Segment, Container,
} from 'semantic-ui-react';

import './AlbumArtView.css';

const AlbumArtView = (props) => {
  const { albumSelect, albums } = props;
  const bigCarouselRef = useRef(null);
  const smallCarouselRef = useRef(null);


  const handleOnDragStart = (e) => e.preventDefault();

  const handleSlideChange = (e) => {
    bigCarouselRef.current.slideTo(e.item);
    smallCarouselRef.current.slideTo(e.item);
  };

  const handleClick = (event) => {
    const headerElement = Array.from(event.currentTarget.children)[1];
    const albumInfo = Array.from(headerElement.children).map((el) => el.innerText);
    console.log(albumInfo);
    albumSelect(albumInfo.reverse());
  };

  const imagesPlusText = albums.map((album) => (
    <Segment basic inverted textAlign="center" onClick={handleClick}>
      <Image onDragStart={handleOnDragStart} src={album.image[3]['#text']} />
      <Header as="h5">
        <div>{album.artist.name}</div>
        {' '}
        -
        {' '}
        <div>{album.name}</div>
      </Header>
    </Segment>
  ));

  const images = albums.map((album) => (
    <Container>
      <Image onDragStart={handleOnDragStart} src={album.image[3]['#text']} />
    </Container>
  ));
  return (
    <>
      <AliceCarousel
        mouseTrackingEnabled
        onSlideChanged={handleSlideChange}
        items={imagesPlusText}
        dotsDisabled
        buttonsDisabled
        ref={bigCarouselRef}
      />
      <AliceCarousel
        mouseTrackingEnabled
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
