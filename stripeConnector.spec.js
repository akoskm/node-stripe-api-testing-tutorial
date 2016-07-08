var stripeConnector = require('./stripeConnector'),
  assert = require('chai').assert,
  stripe = require('stripe'),
  sinon = require('sinon'),
  testKey = 'test';

describe('The Stripe Connector', function() {

  var request = {
      items: ['silky-sunscreen', 'coconut-cream'],
      email: 'user@example.com'
    },
    orderResponse = {
      id: 123
    };

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('returns an error received from the Stripe API', function () {
    var stripeClient = sinon.stub(stripe(testKey)),
      errorMessage = 'Failed to create the order';

    this.sandbox.stub(stripeClient.orders.__proto__, 'create', function (orderRequest, cb) {
      cb(errorMessage, null);
    });

    stripeConnector.createOrder(request, function (err, order) {
      assert.isNotNull(err);
      assert.equal(err, errorMessage);
    });
  });
  
  it('return an error because the order response does not contain id', function () {
    var stripeClient = sinon.stub(stripe(testKey));
    
    this.sandbox.stub(stripeClient.orders.__proto__, 'create', function (orderRequest, cb) {
      cb(null, {});
    });

    stripeConnector.createOrder(request, function (err, order) {
      assert.isNotNull(err);
      assert.equal('Unknown error occurred.', err);
    });
  });

  it('creates an order through the API and returns the created order', function () {
    var stripeClient = sinon.stub(stripe(testKey));
      
    this.sandbox.stub(stripeClient.orders.__proto__, 'create', function (orderRequest, cb) {
      cb(null, orderResponse);
    });

    stripeConnector.createOrder(request, function (err, order) {
      assert.isNull(err);
      assert.equal(orderResponse, order);
    });
  });

  it('returns an array of errors if email is missing from the request', function () {
    var stripeClient = sinon.stub(stripe(testKey)),
      invalidRequest = {
        items: ['silky-sunscreen', 'coconut-cream']
      };

    stripeConnector.createOrder(invalidRequest, function (err, order) {
      assert.isNotNull(err);
      assert.equal(1, err.length);
      assert.equal(err[0], 'Email is required.');
    });
  });

  it('returns an array of errors if no items in the request', function () {
    var stripeClient = sinon.stub(stripe(testKey)),
      invalidRequest = {
        email: 'user@example.com',
        items: []
      };

    stripeConnector.createOrder(invalidRequest, function (err, order) {
      assert.isNotNull(err);
      assert.equal(1, err.length);
      assert.equal(err[0], 'No items found.');
    });
  });

  it('returns an array of errors if no items and no email in the request', function () {
    var stripeClient = sinon.stub(stripe(testKey)),
      invalidRequest = {
      };

    stripeConnector.createOrder(invalidRequest, function (err, order) {
      assert.isNotNull(err);
      assert.equal(2, err.length);
      assert.equal(err[0], 'No items found.');
      assert.equal(err[1], 'Email is required.');
    });
  });
});