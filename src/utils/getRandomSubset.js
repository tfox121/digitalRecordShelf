const getRandomSubset = (arr, size) => {
  const shuffled = arr.slice(0);
  let i = arr.length;
  let temp;
  let index;
  while (i) {
    i -= 1;
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
};

export default getRandomSubset;
