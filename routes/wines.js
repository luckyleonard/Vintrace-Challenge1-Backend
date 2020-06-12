const express = require('express');
const router = express.Router();
const winesController = require('../controllers/wines');

router.get('/', function (req, res) {
  winesController.getWines(req, res);
});

router.get('/:lotCode/getYearBreakdown', function (req, res) {
  winesController.getBreakdownByYear(req, res);
});

module.exports = router;
