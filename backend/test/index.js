const server = require('../index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Listing APIs', () => {
  const randomListing = Math.floor(Math.random() * 8500000);
  const randomUser = Math.floor(Math.random() * 1500000);
  describe('Test GET route /listing/:id', () => {
    it('Should retrieve an individual listing', (done) => {
      chai.request(server)
        .get(`/listing/${randomListing}`)
        .end((err, res) => {
          res.should.have.status(200);
          checkListing(res.body);
          done();
        })
    });
  });

  describe('Test GET route /reviews/:listingId', () => {
    it('Should retrieve all reviews for a listing', (done) => {
      chai.request(server)
        .get(`/reviews/${randomListing}`)
        .end((err, res) => {
          res.should.have.status(200);
          checkReviews(res.body);
          done();
        })
    })
  });

  describe('Test GET route /:userId/listings', () => {
    it('Should retrieve all listings for a given user', (done) => {
      chai.request(server)
        .get(`/${randomUser}/listings`)
        .end((err, res) => {
          res.should.have.status(200);
          checkUserListings(res.body);
          done();
        })
    })
  })
});

function checkListing(resBody) {
  resBody.should.be.a('object');
  resBody.should.have.property('id');
  resBody.should.have.property('title');
  resBody.should.have.property('product_desc');
  resBody.should.have.property('price');
  resBody.should.have.property('rating');
  resBody.should.have.property('list_date');
  resBody.should.have.property('seller_id');
  resBody.should.have.property('image_urls');
  resBody.image_urls.should.be.a('array');
};

function checkReviews(resBody) {
  resBody.should.be.a('array');
  if (resBody.length) {
    resBody[0].should.have.property('username');
    resBody[0].should.have.property('body');
  };
};

function checkUserListings(resBody) {
  resBody.should.be.a('array');
  if (resBody.length) {
    checkListing(resBody[0]);
  };
};