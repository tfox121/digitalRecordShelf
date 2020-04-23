import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {
  Image, Header, Segment, Container,
} from 'semantic-ui-react';

import './AlbumArtView.css';
import SpotifyConnectPrompt from './SpotifyConnectPrompt';

const AlbumArtView = (props) => {
  const {
    albumSelect, albums, extendedArt, token,
  } = props;
  const [carouselPos, setCarouselPos] = useState(0);
  const bigCarouselRef = useRef(null);
  const smallCarouselRef = useRef(null);

  // if (!extendedArt) {
  //   return null;
  // }

  const handleOnDragStart = (e) => e.preventDefault();

  const handleSlideChange = (e) => {
    setCarouselPos(Number(e.item));
    bigCarouselRef.current.slideTo(e.item);
  };

  const onCarouselItemSelect = (e) => {
    bigCarouselRef.current.slideTo(e.target.id);
    smallCarouselRef.current.slideTo(e.target.id);
    setCarouselPos(Number(e.target.id));
  };

  const handleClick = (event) => {
    const headerElement = event.currentTarget.parentElement.parentElement.nextSibling;
    const albumInfo = Array.from(headerElement.children).map((el) => el.innerText);
    albumInfo.splice(1, 1);
    console.log(albumInfo);
    albumSelect(albumInfo.reverse());
  };

  // const imageSource = (index, album) => {
  //   if (extendedArt[index]) {
  //     return extendedArt[index][0].image;
  //   }
  //   return album.image[3]['#text'];
  // };

  const imagesPlusText = albums.map((album) => (
    <Segment basic inverted textAlign="center">
      <div className="image-container">
        <Image bordered onDragStart={handleOnDragStart} src={album.image[3]['#text']} />
        <div className="image-icon"><SpotifyConnectPrompt token={token} size="huge" handleClick={handleClick} /></div>
      </div>
      <Header as="h5" className="album-info">
        <div>{album.artist.name}</div>
        <div className="space">{' - '}</div>
        <div>{album.name}</div>
      </Header>
    </Segment>
  ));

  const images = albums.map((album, index) => (
    <Container>
      <Image id={index} onDragStart={handleOnDragStart} onClick={onCarouselItemSelect} src={album.image[3]['#text']} />
    </Container>
  ));

  return (
    <>
      <AliceCarousel
        touchTrackingEnabled={false}
        items={imagesPlusText}
        startIndex={carouselPos}
        dotsDisabled
        buttonsDisabled
        ref={bigCarouselRef}
      />
      <AliceCarousel
        mouseTrackingEnabled
        onSlideChanged={handleSlideChange}
        items={images}
        ref={smallCarouselRef}
        startIndex={carouselPos}
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
