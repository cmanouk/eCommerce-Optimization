const fs = require('fs');
const path = require('path');
const faker = require('faker');
const pool = require('../index.js');

const numberOfReviews = 15000000;
const stream = fs.createWriteStream(path.join(__dirname, './data/reviews.csv'));
stream.write('author,listing,body\n', 'utf-8');

const generateReview = () => {
  const author = Math.floor(Math.random() * 1500000);
  const listing = Math.floor(Math.random() * 8500000);
  const body = faker.lorem.sentences(2);
  return `${author},${listing},"${body}"`
}

const writeReviews = (writer, encoding, callback) => {
  let count = numberOfReviews;
  let ok = true;
  const write = () => {
    while(count > 0 && ok) {
      count--;
      const data = `${generateReview()}\n`;
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

writeReviews(stream, 'utf-8', () => {
  stream.end();
  pool.query(`COPY reviews(author, listing, body)
              FROM '/Users/chasemanoukian/hack-reactor/hrr50/sdc-the_reactors/backend/database/seeding/data/reviews.csv'
              DELIMITER ','
              CSV HEADER;`)
  .then((res) => console.log('SUCCESS'))
  .catch((err) => console.error('ERROR: ', err));
});