var stripe = require('stripe')(
  'test'
);

module.exports = {

  createOrder: function (req, cb) {
    var items = req.items,
        email = req.email,
        errors = [];

    // Always validate the user input before handling it to an external API.
    // If you can detect requests that would fail anyway, you'll spare the
    // cost of the network request before it's even made.
    if (!items || items.length < 1) {
      // return cb('No items found.', null);
      errors.push('No items found.');
    }

    // a terrible way to validate an email address
    if (!email) {
      errors.push('Email is required.');
    }

    if (errors.length > 0) {
      cb(errors, null);
    } else {
      stripe.orders.create({
        currency: 'usd',
        items: items,
        email: email
      }, function(err, order) {
        // stripe response, asynchronously called
        if (err) {
          cb(err, null);
        } else {
          if (!order || !order.id) {
            cb('Unknown error occurred.', null);
          } else {
            cb(null, order);
          }
        }
      });
    }
  }
};