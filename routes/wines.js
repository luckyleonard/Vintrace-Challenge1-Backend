const express = require('express');
const router = express.Router();
const winesController = require('../controllers/wines');

router.get('/', function (req, res) {
  winesController.getWines(req, res);
});

router.get('/:lotCode', function (req, res) {
  winesController.getWineDetail(req, res);
});

router.get('/:lotCode/getYearBreakdown', function (req, res) {
  winesController.getBreakdownByYear(req, res);
});

router.get('/:lotCode/getVarietyBreakdown', function (req, res) {
  winesController.getBreakdownByVariety(req, res);
});

router.get('/:lotCode/getRegionBreakdown', function (req, res) {
  winesController.getBreakdownByRegion(req, res);
});

router.get('/:lotCode/getYearAndVarietyBreakdown', function (req, res) {
  winesController.getBreakdownByYearAndVariety(req, res);
});

module.exports = router;
