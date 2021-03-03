require('newrelic');
const express = require('express');
const bp = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const db = require('./database/helpers/queries.js');
const pool = require('./database/index.js');
const cache = require('./middleware/cache.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(compression());

app.get('/listing/:id', (req, res, next) => {
  const { id } = req.params;
  pool.query(`SELECT * FROM listings WHERE id=${id};`, (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result.rows[0]);
  });
});

app.get('/:userId/listings', (req, res) => {
  const { userId } = req.params;
  pool.query(`SELECT * FROM listings WHERE seller_id=${userId};`, (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result.rows);
  })
});

app.get('/reviews/:listingId', (req, res) => {
  const { listingId } = req.params;
  pool.query(`SELECT u.username, body FROM users u INNER JOIN reviews r
    ON u.id=r.author WHERE r.listing=${listingId};`, (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result.rows);
  })
});

app.post('/create/user', (req, res) => {
  const { username } = req.body;
  db.addUser(username)
    .then((result) => res.send(result))
    .catch((err) => res.status(400).send(err.message));
});

app.post('/create/listing', (req, res) => {
  const { listing_info } = req.body;
  db.addListing(listing_info)
    .then((result) => res.send(result))
    .catch((err) => res.status(400).send(err));
});

app.listen(PORT, () => console.log(`App is up on ${PORT}`));

module.exports = app;