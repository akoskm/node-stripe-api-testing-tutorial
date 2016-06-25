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
      errorMessage = 'Failed to create the order',
      createOrderStub = this.sandbox.stub(stripeClient.orders.__proto__, 'create', function (orderRequest, cb) {
        cb(errorMessage, null);
      });

    stripeConnector.createOrder(request, function (err, order) {
      assert.isNotNull(err);
      assert.equal(err, errorMessage);
    });
  });
  
  it('return an error because the order response does not contain id', function () {
    var stripeClient = sinon.stub(stripe(testKey)),
      createOrderStub = this.sandbox.stub(stripeClient.orders.__proto__, 'create', function (orderRequest, cb) {
        cb(null, {});
      });

    stripeConnector.createOrder(request, function (err, order) {
      assert.isNotNull(err);
      assert.equal('Unknown error occurred.', err);
    });
  });

  it('creates an order through the API and returns the created order', function () {
    var stripeClient = sinon.stub(stripe(testKey)),
      createOrderStub = this.sandbox.stub(stripeClient.orders.__proto__, 'create', function (orderRequest, cb) {
        cb(null, orderResponse);
      });

    stripeConnector.createOrder(request, function (err, order) {
      assert.isNull(err);
      assert.equal(orderResponse, order);
    });
  });
});