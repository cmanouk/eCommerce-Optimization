const fs = require('fs');
const path = require('path');
const faker = require('faker');
const pool = require('../index.js');

const numberOfListings = 8500000;
const stream = fs.createWriteStream(path.join(__dirname, './data/listings.csv'));
stream.write('title,product_desc,list_date,price,rating,seller_id,image_urls\n', 'utf-8');

const generateListing = () => {
  const randomEpoch = () => Math.floor(Math.random() * (1612456227 - 1609518628)) + 1609518628;
  const randomUrls = () => {
    const urls = [];
    const imgCount = Math.floor(Math.random() * (7 - 2)) + 3;
    for (let i = 0; i < imgCount; i++) { urls.push(faker.image.image(320, 240, true)) };
    return `{${urls}}`;
  };
  const title = faker.commerce.productName();
  const product_desc = faker.commerce.productDescription();
  const list_date = randomEpoch();
  const price = faker.finance.amount(9, 199, 2);
  const rating = Math.round((Math.random() * 3 + 2) * 100) / 100;
  const seller_id = Math.floor(Math.random() * 1500000);
  const image_urls = randomUrls();
  return `"${title}","${product_desc}",${price},${rating},${list_date},${seller_id},"${image_urls}"\n`;
};

const writeListings = (writer, encoding, callback) => {
  let count = numberOfListings;
  let ok = true;
  const write = () => {
    while(count > 0 && ok) {
      count--;
      const data = generateListing();
      if (count === 0) return writer.write(data, encoding, callback);
      if (count !== 0) ok = writer.write(data, encoding);
    }
    if (count > 0) {
      ok = true;
      writer.once('drain', write);
    }
  }
  write();
};

writeListings(stream, 'utf-8', () => {
  stream.end();
  pool.query(`COPY listings(title, product_desc, price, rating, list_date, seller_id, image_urls)
              FROM '/Users/chasemanoukian/hack-reactor/hrr50/sdc-the_reactors/backend/database/seeding/data/listings.csv'
              DELIMITER ','
              CSV HEADER;`)
  .then((res) => console.log('SUCCESS'))
  .catch((err) => console.error(err));
});