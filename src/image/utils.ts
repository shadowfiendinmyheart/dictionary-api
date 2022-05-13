const gis = require('g-i-s'); // eslint-disable-line

const getImages = (search: string) => {
  return new Promise((resolve, reject) => {
    gis(search, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      const answer = res.map((r) => r.url);
      resolve(answer);
    });
  });
};

export default getImages;
