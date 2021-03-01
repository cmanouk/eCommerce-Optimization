const db = require('../index.js');

const addUser = (username) => {
  return pool
        .query(`INSERT INTO users(username)
                VALUES ('${username}');`)
        .then((res) => res)
        .catch((err) => err);
}

const addListing = ({ title, product_desc, price, rating, list_date, seller_id, image_urls }) => {
  const stringifiedUrls = (JSON.stringify(image_urls));
  const finalStr = stringifiedUrls.slice(1, stringifiedUrls.length - 1);
  console.log(finalStr);
  return pool
        .query(`INSERT INTO listings(title, product_desc, price, rating, list_date, seller_id, image_urls)
                VALUES ('${title}', '${product_desc}', ${price}, ${rating}, ${list_date}, ${seller_id},
                '{${finalStr}}');`)
        .then((res) => res)
        .catch((err) => err);
}

module.exports = {
  addUser,
  addListing
}