const fs = require('fs');
const path = require('path');
const faker = require('faker');
const pool = require('../index.js');

const numberOfUsers = 1500000;
const stream = fs.createWriteStream(path.join(__dirname, './data/users.csv'));
stream.write('username\n', 'utf-8');

const writeListings = (writer, encoding, callback) => {
  let count = numberOfUsers;
  let ok = true;
  const write = () => {
    while(count > 0 && ok) {
      count--;
      const data = `${faker.internet.userName()}\n`;
      if (count === 0) writer.write(data, encoding, callback);
      if (count !== 0) writer.write(data, encoding);
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
  pool.query(`COPY users(username)
              FROM '/Users/chasemanoukian/hack-reactor/hrr50/sdc-the_reactors/backend/database/seeding/data/users.csv'
              DELIMITER ','
              CSV HEADER;`)
  .then((res) => console.log('SUCCESS'))
  .catch((err) => console.error('ERROR: ', err));
});