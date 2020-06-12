const express = require('express');
const router = express.Router();
const wines = require('../controllers/wines');

router.get('/', function (req, res) {
  wines.getWines(req, res);
});

module.exports = router;
