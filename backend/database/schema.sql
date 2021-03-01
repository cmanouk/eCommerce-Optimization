DROP DATABASE IF EXISTS yetsy;
CREATE DATABASE yetsy;

\c yetsy;

CREATE TABLE users (
  id serial,
  username varchar(40),
  PRIMARY KEY(id)
);

CREATE TABLE listings (
  id serial,
  title varchar(40),
  product_desc varchar(160),
  price money,
  rating real,
  list_date int,
  seller_id int,
  image_urls text [],
  PRIMARY KEY(id)
);

CREATE TABLE reviews (
  author int,
  listing int,
  body varchar(240)
);