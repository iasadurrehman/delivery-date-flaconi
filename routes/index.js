var express = require('express');
var router = express.Router();
var product = require( '../controller/product');

/* GET home page. */
router.post('/', function(req, res, next) {

  const a = new product.Product();
  const courierName = req.body.courierName;
  const orderDate = req.body.orderDate;
  res.send(a.getDeliveryDate(orderDate, courierName));
});

module.exports = router;
