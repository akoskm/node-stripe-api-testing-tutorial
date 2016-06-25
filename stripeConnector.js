var stripe = require('stripe')(
  'test'
);

module.exports = {

  createOrder: function (req, cb) {
    var items = req.items,
        email = req.email;

    // Always validate the user input before handling it to an external API.
    // If you can detect requests that would fail anyway, you'll spare the
    // cost of the network request before it's even made.
    if (items === null || items.length < 1) {
      cb('No items found.', null);
    }

    // a terrible way to validate an email address
    if (!email) {
      cb('Email is required.', null);
    }

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
};