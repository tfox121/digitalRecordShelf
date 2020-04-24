import axios from 'axios';

// const getExtendedArt = async (albumList) => {
//   console.log('Albums', albumList);
//   const list = [];
//   await albumList.forEach(async (album, index) => {
//     try {
//       const response = await axios.get(`http://coverartarchive.org/release/${album.mbid}`);
//       console.log(response.data);
//       list[index] = response.data.images;
//     } catch (err) {
//       console.log('No art found');
//       // list[index] = [{ image: album.image[3]['#text'] }];
//       list[index] = null;
//     }
//   });
//   console.log('ART', list);
//   return list;
// };


const getExtendedArt = async (album) => {
  try {
    const response = await axios.get(`http://coverartarchive.org/release/${album.mbid}`);
    const images = response.data.images.map((imageObj) => imageObj.image);
    return { ...album, images };
  } catch (err) {
    console.log('No art found', album);
    return album;
  }
};

const addExtendedArtToArray = async (albums) => {
  const albumsWithArt = await Promise.all(albums.map(async (album) => getExtendedArt(album)));
  return albumsWithArt;
};


export default addExtendedArtToArray;
